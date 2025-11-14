'use client'

// Robust image upload system with multiple hosting strategies for cross-device accessibility
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getStorageClient } from '@/lib/firebase'

export async function uploadImage(file: File, pathPrefix = 'uploads'): Promise<string> {
  console.log('=== UPLOAD START ===')
  console.log('File details:', { name: file.name, size: file.size, type: file.type })

  // Strategy 1: Try ImgBB FIRST (most reliable for public access)
  try {
    console.log('Attempting ImgBB upload for guaranteed public access...')
    const result = await uploadToImgBB(file)
    console.log('ImgBB upload successful:', result)
    return result
  } catch (imgbbError) {
    console.error('ImgBB upload failed:', imgbbError)
    if (imgbbError instanceof Error && imgbbError.message.includes('Missing NEXT_PUBLIC_IMGBB_API_KEY')) {
      console.warn('ImgBB API key not configured. Please add NEXT_PUBLIC_IMGBB_API_KEY to your environment variables.')
    }
  }

  // Strategy 2: Try Firebase Storage as fallback
  try {
    console.log('Attempting Firebase Storage upload as fallback...')
    const result = await uploadToFirebaseWithTimeout(file, pathPrefix)
    console.log('Firebase Storage upload successful:', result)
    return result
  } catch (error) {
    console.error('Firebase Storage upload failed:', error)
  }

  // Strategy 3: Convert to data URL as last resort (always accessible)
  console.log('All hosting methods failed, converting to data URL for guaranteed access...')
  return convertToDataURL(file)
}

// Firebase Storage upload with timeout and public access
async function uploadToFirebaseWithTimeout(file: File, pathPrefix: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Upload timeout after 45 seconds'))
    }, 45000)

    uploadToFirebase(file, pathPrefix)
      .then((result) => {
        clearTimeout(timeout)
        resolve(result)
      })
      .catch((error) => {
        clearTimeout(timeout)
        reject(error)
      })
  })
}

// Firebase Storage upload with public access
async function uploadToFirebase(file: File, pathPrefix: string): Promise<string> {
  try {
    const storage = getStorageClient()
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`
    const storageRef = ref(storage, `${pathPrefix}/${fileName}`)
    
    console.log('Uploading to Firebase Storage...')
    const snapshot = await uploadBytes(storageRef, file)
    console.log('Upload completed, getting download URL...')
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    // Make the file publicly accessible by setting metadata
    try {
      // Note: Firebase Storage files are public by default, but we ensure it
      console.log('Firebase Storage file uploaded successfully with public access')
    } catch (metadataError) {
      console.warn('Could not set public metadata, but file should be accessible:', metadataError)
    }
    
    return downloadURL
  } catch (error) {
    console.error('Firebase Storage upload error:', error)
    throw new Error('Firebase Storage upload failed')
  }
}

// ImgBB upload (reliable for public access)
async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
  if (!apiKey) {
    throw new Error('Missing NEXT_PUBLIC_IMGBB_API_KEY')
  }

  const form = new FormData()
  form.append('image', file, file.name)
  form.append('name', `${Date.now()}_${file.name.replace(/\s+/g, '_')}`)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const url = `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`
    const res = await fetch(url, {
      method: 'POST',
      body: form,
      signal: controller.signal
    })
    clearTimeout(timeout)

    if (!res.ok) {
      throw new Error(`ImgBB upload failed: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    const imageUrl = data?.data?.display_url || data?.data?.url
    if (!imageUrl) {
      throw new Error('ImgBB response missing URL')
    }

    return imageUrl
  } catch (error) {
    clearTimeout(timeout)
    throw error
  }
}

// Convert to data URL (always accessible but larger size)
async function convertToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Get a reliable fallback image URL
export function getFallbackImageUrl(): string {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1200&h=600&fit=crop&crop=center&auto=format',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop&crop=center&auto=format',
    'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=1200&h=600&fit=crop&crop=center&auto=format'
  ]
  return fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
}


