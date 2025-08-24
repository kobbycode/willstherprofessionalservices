'use client'

import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import { getStorageClient, debugFirebaseConfig } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function TestStoragePage() {
  const [auth, setAuth] = useState<any>(null)
  const [storage, setStorage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [testStatus, setTestStatus] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')

  useEffect(() => {
    const initFirebase = async () => {
      try {
        const authInstance = getAuth()
        const storageInstance = getStorageClient()
        
        setAuth(authInstance)
        setStorage(storageInstance)
        
        console.log('Firebase services initialized:', {
          auth: !!authInstance,
          storage: !!storageInstance
        })
        
        debugFirebaseConfig()
        
        // Test storage connectivity
        await testStorageConnection()
        
      } catch (error) {
        console.error('Firebase init error:', error)
        setTestStatus('Failed to initialize Firebase')
      } finally {
        setLoading(false)
      }
    }

    initFirebase()
  }, [])

  const testStorageConnection = async () => {
    try {
      setTestStatus('Testing storage connection...')
      
      if (!auth?.currentUser) {
        setTestStatus('No authenticated user found')
        return
      }

      if (!storage) {
        setTestStatus('Storage not initialized')
        return
      }

      // Create a simple test file
      const testContent = 'Hello Firebase Storage!'
      const testFile = new File([testContent], 'test.txt', { type: 'text/plain' })
      
      console.log('Testing with file:', testFile.name, testFile.size)
      
      const testRef = ref(storage, 'test-connection/test.txt')
      const snapshot = await uploadBytes(testRef, testFile)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      console.log('Test upload successful:', downloadURL)
      setTestStatus('✅ Storage connection successful!')
      
    } catch (error: any) {
      console.error('Storage test failed:', error)
      setTestStatus(`❌ Storage test failed: ${error.code || error.message}`)
    }
  }

  const testImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadStatus('Uploading test image...')
    try {
      console.log('Test image upload starting...')
      console.log('File:', file.name, file.size, file.type)
      
      const testRef = ref(storage, `test-images/${Date.now()}_${file.name}`)
      const snapshot = await uploadBytes(testRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      setUploadStatus(`✅ Upload successful: ${downloadURL}`)
      console.log('Test image upload completed:', downloadURL)
    } catch (error: any) {
      console.error('Test image upload failed:', error)
      setUploadStatus(`❌ Upload failed: ${error.code || error.message}`)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Firebase Storage Test</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Firebase Status</h2>
          <div className="space-y-2">
            <p><strong>Auth:</strong> {auth ? '✅ Connected' : '❌ Not connected'}</p>
            <p><strong>Storage:</strong> {storage ? '✅ Connected' : '❌ Not connected'}</p>
            <p><strong>Current User:</strong> {auth?.currentUser?.email || 'Not logged in'}</p>
            <p><strong>User ID:</strong> {auth?.currentUser?.uid || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Storage Connection Test</h2>
          <button
            onClick={testStorageConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Storage Connection
          </button>
          {testStatus && (
            <p className="mt-2 text-sm">{testStatus}</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Image Upload Test</h2>
          <input
            type="file"
            accept="image/*"
            onChange={testImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploadStatus && (
            <p className="mt-2 text-sm">{uploadStatus}</p>
          )}
        </div>
      </div>
    </div>
  )
}
