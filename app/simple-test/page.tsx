'use client'

import { useEffect, useState } from 'react'

export default function SimpleTest() {
  const [status, setStatus] = useState('Loading...')
  const [error, setError] = useState('')

  useEffect(() => {
    const testFirebase = async () => {
      try {
        setStatus('Testing Firebase imports...')
        
        // Test if Firebase modules can be imported
        const { initializeApp, getApps } = await import('firebase/app')
        setStatus('Firebase app modules imported successfully')
        
        const { getAuth } = await import('firebase/auth')
        setStatus('Firebase auth modules imported successfully')
        
        // Test basic initialization
        const firebaseConfig = {
          apiKey: 'AIzaSyB4XxvcqkCGS6IgwkDQSKEr8XFKJgodCIU',
          authDomain: 'wilsther-profesional-services.firebaseapp.com',
          projectId: 'wilsther-profesional-services',
          storageBucket: 'wilsther-profesional-services.firebasestorage.app',
          messagingSenderId: '484189314031',
          appId: '1:484189314031:web:cc4f556f31e37757eab41a',
          measurementId: 'G-BGVH0BFR5Y'
        }
        
        setStatus('Initializing Firebase app...')
        const app = initializeApp(firebaseConfig)
        setStatus('Firebase app initialized successfully')
        
        setStatus('Initializing Firebase auth...')
        const auth = getAuth(app)
        setStatus('Firebase auth initialized successfully')
        
        console.log('Firebase App:', app)
        console.log('Firebase Auth:', auth)
        
        setStatus('✅ All Firebase services working correctly!')
      } catch (err: any) {
        console.error('Firebase test failed:', err)
        setError(err.message)
        setStatus('❌ Firebase test failed')
      }
    }

    testFirebase()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Simple Firebase Test</h1>
        
        <div className="space-y-4">
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
          
          <div className="mt-6 space-y-2">
            <a 
              href="/admin/login" 
              className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Admin Login
            </a>
            <a 
              href="/test-firebase" 
              className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Test Firebase Lib
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
