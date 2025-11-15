'use client'

import { useState } from 'react'
import { getStorageClient, getFirebaseApp } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function TestStoragePage() {
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')

  const testStorageUpload = async (file: File) => {
    try {
      setUploadStatus('Initializing Firebase Storage...')
      const storage = getStorageClient()
      
      setUploadStatus('Creating storage reference...')
      const storageRef = ref(storage, `test/test-image-${Date.now()}.jpg`)
      
      setUploadStatus('Uploading file...')
      const snapshot = await uploadBytes(storageRef, file)
      
      setUploadStatus('Getting download URL...')
      const url = await getDownloadURL(snapshot.ref)
      
      setImageUrl(url)
      setUploadStatus('Upload successful!')
    } catch (error) {
      console.error('Storage test failed:', error)
      setUploadStatus(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      testStorageUpload(file)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Firebase Storage Test</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select an image to test upload:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Upload Status:</h2>
        <p className="text-gray-800">{uploadStatus}</p>
      </div>
      
      {imageUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Uploaded Image:</h2>
          <img 
            src={imageUrl} 
            alt="Uploaded test" 
            className="max-w-full h-auto rounded-lg border"
          />
          <p className="mt-2 text-sm text-gray-600 break-all">{imageUrl}</p>
        </div>
      )}
    </div>
  )
}