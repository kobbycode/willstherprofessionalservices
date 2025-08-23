'use client'

import { useEffect, useState } from 'react'
import { getAuth, getFirebaseApp } from '@/lib/firebase'

export default function TestFirebase() {
  const [status, setStatus] = useState('Testing...')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const testFirebase = async () => {
      try {
        setStatus('Initializing Firebase...')
        
        // Test Firebase App
        const app = getFirebaseApp()
        setStatus('Firebase App initialized successfully')
        
        // Test Auth
        const auth = getAuth()
        setStatus('Firebase Auth initialized successfully')
        
        console.log('Firebase App:', app)
        console.log('Firebase Auth:', auth)
        
        setStatus('✅ All Firebase services working correctly!')
        setIsLoading(false)
      } catch (err: any) {
        console.error('Firebase test failed:', err)
        setError(err.message)
        setStatus('❌ Firebase test failed')
        setIsLoading(false)
      }
    }

    testFirebase()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Firebase Test</h1>
        
        <div className="space-y-4">
          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Testing Firebase...</p>
            </div>
          )}
          
          <div>
            <p className="text-sm font-medium text-gray-700">Status:</p>
            <p className="text-lg text-gray-900">{status}</p>
          </div>
          
          {error && (
            <div>
              <p className="text-sm font-medium text-red-700">Error:</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <div className="mt-6">
            <a 
              href="/admin/login" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Admin Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
