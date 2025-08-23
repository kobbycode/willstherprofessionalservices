'use client'

import { useEffect, useState } from 'react'

export default function DebugFirebase() {
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState('')

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    const debugFirebase = async () => {
      try {
        addLog('Starting Firebase debug...')
        
        // Step 1: Check if window exists
        if (typeof window === 'undefined') {
          addLog('❌ Window is undefined (server-side)')
          return
        }
        addLog('✅ Window exists (client-side)')
        
        // Step 2: Try to import Firebase modules
        addLog('Importing Firebase modules...')
        const { initializeApp, getApps } = await import('firebase/app')
        addLog('✅ Firebase app modules imported')
        
        const { getAuth } = await import('firebase/auth')
        addLog('✅ Firebase auth modules imported')
        
        // Step 3: Check Firebase config
        const firebaseConfig = {
          apiKey: 'AIzaSyB4XxvcqkCGS6IgwkDQSKEr8XFKJgodCIU',
          authDomain: 'wilsther-profesional-services.firebaseapp.com',
          projectId: 'wilsther-profesional-services',
          storageBucket: 'wilsther-profesional-services.firebasestorage.app',
          messagingSenderId: '484189314031',
          appId: '1:484189314031:web:cc4f556f31e37757eab41a',
          measurementId: 'G-BGVH0BFR5Y'
        }
        addLog('✅ Firebase config loaded')
        
        // Step 4: Check existing apps
        const existingApps = getApps()
        addLog(`Found ${existingApps.length} existing Firebase apps`)
        
        // Step 5: Initialize Firebase app
        addLog('Initializing Firebase app...')
        const app = initializeApp(firebaseConfig)
        addLog('✅ Firebase app initialized')
        
        // Step 6: Initialize Firebase auth
        addLog('Initializing Firebase auth...')
        const auth = getAuth(app)
        addLog('✅ Firebase auth initialized')
        
        // Step 7: Test auth state
        addLog('Testing auth state...')
        console.log('Firebase App:', app)
        console.log('Firebase Auth:', auth)
        addLog('✅ Firebase initialization complete!')
        
      } catch (err: any) {
        console.error('Firebase debug failed:', err)
        setError(err.message)
        addLog(`❌ Error: ${err.message}`)
      }
    }

    debugFirebase()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Firebase Debug</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h3 className="font-semibold mb-2">Debug Logs:</h3>
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {log}
              </div>
            ))}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="flex space-x-2">
            <a 
              href="/admin/login" 
              className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Login Page
            </a>
            <a 
              href="/simple-test" 
              className="flex-1 text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Simple Test
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
