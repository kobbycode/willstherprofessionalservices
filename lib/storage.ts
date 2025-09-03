'use client'

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getApp } from 'firebase/app'

// Primary: Firebase Storage (more reliable across devices)
// Fallback: ImgBB if Firebase fails
export async function uploadImage(file: File, pathPrefix = 'uploads'): Promise<string> {
  try {
    console.log('=== UPLOAD START ===')
    console.log('File details:', { name: file.name, size: file.size, type: file.type })

    // Try Firebase Storage first
    try {
      const app = getApp()
      const storage = getStorage(app)
      const timestamp = Date.now()
      const fileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`
      const storageRef = ref(storage, `${pathPrefix}/${fileName}`)
      
      console.log('Attempting Firebase Storage upload...')
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      console.log('Firebase Storage upload successful:', downloadURL)
      return downloadURL
    } catch (firebaseError) {
      console.warn('Firebase Storage upload failed, trying ImgBB fallback:', firebaseError)
      
      // Fallback to ImgBB
      return await uploadToImgBB(file)
    }
  } catch (error: any) {
    console.error('=== UPLOAD ERROR ===')
    console.error('Error details:', error)
    throw new Error(error?.message || 'Upload failed')
  }
}

// ImgBB fallback upload
async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
  if (!apiKey) {
    throw new Error('Missing NEXT_PUBLIC_IMGBB_API_KEY for fallback upload')
  }

  const form = new FormData()
  form.append('image', file, file.name)
  form.append('name', `${Date.now()}_${file.name.replace(/\s+/g, '_')}`)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 45000)

  try {
    const url = `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`
    const res = await fetch(url, {
      method: 'POST',
      body: form,
      signal: controller.signal
    })
    clearTimeout(timeout)

    let data: any
    try {
      data = await res.json()
    } catch {
      const text = await res.text().catch(() => '')
      throw new Error(`ImgBB upload failed: ${res.status} ${res.statusText} ${text}`)
    }

    if (!res.ok) {
      const errMsg = data?.error?.message || data?.error || res.statusText
      throw new Error(`ImgBB upload failed: ${res.status} ${errMsg}`)
    }

    const imageUrl: string | undefined = data?.data?.display_url || data?.data?.url
    if (!imageUrl) {
      throw new Error('ImgBB response missing URL')
    }

    console.log('ImgBB fallback upload successful:', imageUrl)
    return imageUrl
  } catch (error: any) {
    clearTimeout(timeout)
    if (error?.name === 'AbortError') {
      throw new Error('Upload timed out. Please check your connection and try again.')
    }
    throw error
  }
}


