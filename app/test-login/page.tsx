'use client'

import { useState, useEffect } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export default function TestLogin() {
  const [auth, setAuth] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { getFirebaseApp } = await import('@/lib/firebase')
        const firebaseApp = getFirebaseApp()
        const authInstance = getAuth(firebaseApp)
        setAuth(authInstance)
        setResult('Firebase initialized successfully')
      } catch (error) {
        setResult(`Firebase init error: ${error}`)
      }
    }
    initAuth()
  }, [])

  const testLogin = async () => {
    if (!auth) {
      setResult('Firebase not initialized')
      return
    }

    setIsLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, 'admin@willsther.com', 'admin123')
      setResult(`Login successful! User: ${userCredential.user.email}`)
    } catch (error: any) {
      setResult(`Login failed: ${error.code} - ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Firebase Auth Test</h1>
        
        <div className="space-y-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Status:</p>
            <p className="text-sm font-mono">{result || 'Initializing...'}</p>
          </div>
          
          <button
            onClick={testLogin}
            disabled={!auth || isLoading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Login'}
          </button>
          
          <div className="text-xs text-gray-500">
            <p>Email: admin@willsther.com</p>
            <p>Password: admin123</p>
          </div>
          
          <div className="space-y-2">
            <a 
              href="/admin/login" 
              className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Go to Admin Login
            </a>
            <a 
              href="/admin/bypass" 
              className="block w-full text-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Go to Admin Bypass
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
