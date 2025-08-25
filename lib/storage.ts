'use client'

import { getStorageClient, getAuth } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function uploadImage(file: File, pathPrefix = 'uploads'): Promise<string> {
  try {
    console.log('=== UPLOAD DEBUG START ===')
    console.log('Starting upload process...')
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    })
    
    // Check authentication status
    const auth = getAuth()
    console.log('Auth state:', {
      currentUser: auth.currentUser ? {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        emailVerified: auth.currentUser.emailVerified,
        providerId: auth.currentUser.providerId
      } : null,
      isAuthenticated: !!auth.currentUser
    })
    
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to upload files')
    }

    // Check if user has a valid token
    let token: string | null = null
    try {
      token = await auth.currentUser.getIdToken()
      console.log('User token obtained:', !!token)
    } catch (tokenError) {
      console.error('Failed to get user token:', tokenError)
      throw new Error('Authentication token is invalid or expired')
    }
    
    const storage = getStorageClient()
    console.log('Storage client initialized:', !!storage)
    console.log('Storage app:', storage.app.name)
    console.log('Storage bucket:', storage.app.options.storageBucket)
    
    const key = `${pathPrefix}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    console.log('Upload path:', key)
    
    const r = ref(storage, key)
    console.log('Storage reference created')
    
    console.log('Starting upload...')
    
    // Add timeout to prevent forever loading
    const uploadPromise = uploadBytes(r, file, { 
      contentType: file.type,
      customMetadata: {
        uploadedBy: auth.currentUser.uid,
        uploadedAt: new Date().toISOString(),
        originalName: file.name
      }
    })
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout after 30 seconds')), 30000)
    })
    
    const snap = await Promise.race([uploadPromise, timeoutPromise]) as any
    console.log('Upload completed, getting download URL...')
    
    const downloadURL = await getDownloadURL(snap.ref)
    console.log('Download URL obtained:', downloadURL)
    console.log('=== UPLOAD DEBUG END ===')
    
    return downloadURL
  } catch (error) {
    console.error('=== UPLOAD ERROR ===')
    console.error('Upload error details:', error)
    const err: any = error
    console.error('Error code:', err?.code)
    console.error('Error message:', err?.message)
    console.error('Error stack:', err?.stack)
    console.error('=== END UPLOAD ERROR ===')
    
    // Handle specific error types
    if (err?.message?.includes('CORS') || err?.message?.includes('403') || err?.message?.includes('503')) {
      throw new Error('Storage service is currently unavailable. Please try again later.')
    }
    
    if (err?.message?.includes('timeout')) {
      throw new Error('Upload timed out. Please check your connection and try again.')
    }
    
    if (err?.code === 'storage/unauthorized') {
      throw new Error('You are not authorized to upload files. Please check your permissions.')
    }
    
    if (err?.code === 'storage/quota-exceeded') {
      throw new Error('Storage quota exceeded. Please contact support.')
    }
    
    // Generic error
    throw new Error(`Upload failed: ${err?.message || 'Unknown error occurred'}`)
  }
}


