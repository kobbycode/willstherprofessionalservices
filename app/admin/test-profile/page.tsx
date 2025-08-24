'use client'

import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'
import { getDb } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { uploadImage } from '@/lib/storage'

export default function TestProfilePage() {
  const [auth, setAuth] = useState<any>(null)
  const [db, setDb] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploadStatus, setUploadStatus] = useState('')

  useEffect(() => {
    const initFirebase = async () => {
      try {
        const authInstance = getAuth()
        const dbInstance = getDb()
        setAuth(authInstance)
        setDb(dbInstance)
        
        if (authInstance.currentUser) {
          const userDoc = await getDoc(doc(dbInstance, 'users', authInstance.currentUser.uid))
          if (userDoc.exists()) {
            setUserData(userDoc.data())
          }
        }
      } catch (error) {
        console.error('Firebase init error:', error)
      } finally {
        setLoading(false)
      }
    }

    initFirebase()
  }, [])

  const testUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadStatus('Uploading...')
    try {
      const url = await uploadImage(file, 'test-uploads')
      setUploadStatus(`Upload successful: ${url}`)
    } catch (error) {
      setUploadStatus(`Upload failed: ${error}`)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile Test Page</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Firebase Status</h2>
          <div className="space-y-2">
            <p><strong>Auth:</strong> {auth ? '✅ Connected' : '❌ Not connected'}</p>
            <p><strong>Firestore:</strong> {db ? '✅ Connected' : '❌ Not connected'}</p>
            <p><strong>Current User:</strong> {auth?.currentUser?.email || 'Not logged in'}</p>
          </div>
        </div>

        {userData && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">User Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Storage Test</h2>
          <input
            type="file"
            accept="image/*"
            onChange={testUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploadStatus && (
            <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>
          )}
        </div>
      </div>
    </div>
  )
}
