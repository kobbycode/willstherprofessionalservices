'use client'

import { getStorageClient, getAuth } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function uploadImage(file: File, pathPrefix = 'uploads'): Promise<string> {
  try {
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
        emailVerified: auth.currentUser.emailVerified
      } : null,
      isAuthenticated: !!auth.currentUser
    })
    
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to upload files')
    }
    
    const storage = getStorageClient()
    console.log('Storage client initialized:', !!storage)
    
    const key = `${pathPrefix}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    console.log('Upload path:', key)
    
    const r = ref(storage, key)
    console.log('Storage reference created')
    
    console.log('Starting upload...')
    const snap = await uploadBytes(r, file, { contentType: file.type })
    console.log('Upload completed, getting download URL...')
    
    const downloadURL = await getDownloadURL(snap.ref)
    console.log('Download URL obtained:', downloadURL)
    
    return downloadURL
  } catch (error) {
    console.error('Upload error details:', error)
    console.error('Error code:', (error as any)?.code)
    console.error('Error message:', (error as any)?.message)
    throw error
  }
}


