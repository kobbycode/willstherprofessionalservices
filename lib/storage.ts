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
    try {
      const token = await auth.currentUser.getIdToken()
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
    const snap = await uploadBytes(r, file, { contentType: file.type })
    console.log('Upload completed, getting download URL...')
    
    const downloadURL = await getDownloadURL(snap.ref)
    console.log('Download URL obtained:', downloadURL)
    console.log('=== UPLOAD DEBUG END ===')
    
    return downloadURL
  } catch (error) {
    console.error('=== UPLOAD ERROR ===')
    console.error('Upload error details:', error)
    console.error('Error code:', (error as any)?.code)
    console.error('Error message:', (error as any)?.message)
    console.error('Error stack:', (error as any)?.stack)
    console.error('=== END UPLOAD ERROR ===')
    throw error
  }
}


