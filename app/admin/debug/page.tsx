'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function DebugPage() {
  const [firebaseStatus, setFirebaseStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [authStatus, setAuthStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [firestoreStatus, setFirestoreStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    const runTests = async () => {
      addLog('Starting Firebase tests...')

      // Test 1: Firebase App Initialization
      try {
        addLog('Testing Firebase app initialization...')
        const { getFirebaseApp } = await import('@/lib/firebase')
        const app = getFirebaseApp()
        addLog(`Firebase app initialized: ${app.name}`)
        setFirebaseStatus('success')
      } catch (error) {
        addLog(`Firebase app error: ${error}`)
        setFirebaseStatus('error')
      }

      // Test 2: Firebase Auth
      try {
        addLog('Testing Firebase Auth...')
        const { getAuth } = await import('firebase/auth')
        const { getFirebaseApp } = await import('@/lib/firebase')
        const app = getFirebaseApp()
        const auth = getAuth(app)
        addLog(`Firebase Auth initialized: ${auth.app.name}`)
        setAuthStatus('success')
      } catch (error) {
        addLog(`Firebase Auth error: ${error}`)
        setAuthStatus('error')
      }

      // Test 3: Firestore
      try {
        addLog('Testing Firestore...')
        const { getDb } = await import('@/lib/firebase')
        const db = getDb()
        addLog(`Firestore initialized: ${db.app.name}`)
        setFirestoreStatus('success')
      } catch (error) {
        addLog(`Firestore error: ${error}`)
        setFirestoreStatus('error')
      }

      addLog('All tests completed')
    }

    runTests()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'loading':
        return 'Testing...'
      case 'success':
        return 'Working'
      case 'error':
        return 'Failed'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Firebase Debug</h1>
          <p className="text-gray-600">Testing Firebase services and authentication</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Firebase App</h3>
              {getStatusIcon(firebaseStatus)}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Status: <span className="font-medium">{getStatusText(firebaseStatus)}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Firebase Auth</h3>
              {getStatusIcon(authStatus)}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Status: <span className="font-medium">{getStatusText(authStatus)}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Firestore</h3>
              {getStatusIcon(firestoreStatus)}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Status: <span className="font-medium">{getStatusText(firestoreStatus)}</span>
            </p>
          </motion.div>
        </div>

        {/* Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug Logs</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Link
            href="/admin/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
          <Link
            href="/admin/bypass"
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Bypass Auth
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Refresh Page
          </button>
        </motion.div>
      </div>
    </div>
  )
}
