'use client'

// Simplified upload system using Firebase Storage with timeout handling
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getApp } from 'firebase/app'

export async function uploadImage(file: File, pathPrefix = 'uploads'): Promise<string> {
  console.log('=== UPLOAD START ===')
  console.log('File details:', { name: file.name, size: file.size, type: file.type })

  try {
    // Use Firebase Storage with timeout
    const result = await uploadToFirebaseWithTimeout(file, pathPrefix)
    console.log('Firebase Storage upload successful:', result)
    return result
  } catch (error) {
    console.error('Upload failed:', error)
    
    // Fallback to ImgBB if Firebase fails
    try {
      console.log('Attempting ImgBB fallback...')
      const result = await uploadToImgBB(file)
      console.log('ImgBB fallback successful:', result)
      return result
    } catch (imgbbError) {
      console.error('ImgBB fallback also failed:', imgbbError)
      throw new Error('All upload methods failed. Please try again.')
    }
  }
}

// Firebase Storage upload with timeout
async function uploadToFirebaseWithTimeout(file: File, pathPrefix: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Upload timeout after 30 seconds'))
    }, 30000)

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

// Firebase Storage upload
async function uploadToFirebase(file: File, pathPrefix: string): Promise<string> {
  try {
    const app = getApp()
    const storage = getStorage(app)
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`
    const storageRef = ref(storage, `${pathPrefix}/${fileName}`)
    
    console.log('Uploading to Firebase Storage...')
    const snapshot = await uploadBytes(storageRef, file)
    console.log('Upload completed, getting download URL...')
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return downloadURL
  } catch (error) {
    console.error('Firebase Storage upload error:', error)
    throw new Error('Firebase Storage upload failed')
  }
}

// ImgBB upload
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

// Cloudinary upload (if configured)
async function uploadToCloudinary(file: File): Promise<string> {
  const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL
  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
  
  if (!cloudinaryUrl || !cloudinaryPreset) {
    throw new Error('Cloudinary not configured')
  }

  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', cloudinaryPreset)

  try {
    const res = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: form
    })

    if (!res.ok) {
      throw new Error(`Cloudinary upload failed: ${res.status}`)
    }

    const data = await res.json()
    return data.secure_url || data.url
  } catch (error) {
    throw new Error('Cloudinary upload failed')
  }
}

// Convert file to data URL as last resort
async function convertToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to convert file to data URL'))
    reader.readAsDataURL(file)
  })
}

// Test image accessibility from different locations
export async function testImageAccessibility(imageUrl: string): Promise<{
  accessible: boolean
  status?: number
  error?: string
}> {
  try {
    // Test with CORS mode
    const response = await fetch(imageUrl, { 
      method: 'HEAD',
      mode: 'cors'
    })
    
    return {
      accessible: response.ok,
      status: response.status
    }
  } catch (error) {
    return {
      accessible: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get a reliable fallback image URL
export function getFallbackImageUrl(): string {
  const fallbacks = [
    'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=1200&h=600&fit=crop&crop=center&auto=format',
    'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1200&h=600&fit=crop&crop=center&auto=format',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop&crop=center&auto=format'
  ]
  
  // Return a random fallback to avoid caching issues
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}


