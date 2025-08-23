'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, Database } from 'lucide-react'
import Link from 'next/link'

export default function TestFirestorePage() {
  const [testStatus, setTestStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    const runFirestoreTest = async () => {
      addLog('Starting Firestore test...')

      try {
        // Test 1: Initialize Firebase
        addLog('Testing Firebase initialization...')
        const { getFirebaseApp } = await import('@/lib/firebase')
        const app = getFirebaseApp()
        addLog(`Firebase app initialized: ${app.name}`)

        // Test 2: Initialize Firestore
        addLog('Testing Firestore initialization...')
        const { getDb } = await import('@/lib/firebase')
        const db = getDb()
        addLog(`Firestore initialized: ${db.app.name}`)

        // Test 3: Test document creation
        addLog('Testing document creation...')
        const { doc, setDoc, getDoc } = await import('firebase/firestore')
        
        const testDocRef = doc(db, 'test', 'test-doc')
        const testData = {
          message: 'Test document',
          timestamp: new Date().toISOString(),
          test: true
        }
        
        addLog('Creating test document...')
        await setDoc(testDocRef, testData)
        addLog('Test document created successfully')

        // Test 4: Test document reading
        addLog('Testing document reading...')
        const testDoc = await getDoc(testDocRef)
        if (testDoc.exists()) {
          addLog('Test document read successfully')
          addLog(`Document data: ${JSON.stringify(testDoc.data())}`)
        } else {
          addLog('Test document does not exist')
        }

        // Test 5: Test users collection
        addLog('Testing users collection...')
        const usersRef = doc(db, 'users', 'test-user')
        const userData = {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLogin: null,
          permissions: ['read', 'write']
        }
        
        addLog('Creating test user document...')
        await setDoc(usersRef, userData)
        addLog('Test user document created successfully')

        // Clean up test documents
        addLog('Cleaning up test documents...')
        const { deleteDoc } = await import('firebase/firestore')
        await deleteDoc(testDocRef)
        await deleteDoc(usersRef)
        addLog('Test documents cleaned up')

        setTestStatus('success')
        addLog('All Firestore tests passed!')

      } catch (error) {
        console.error('Firestore test error:', error)
        addLog(`Error: ${error}`)
        setTestStatus('error')
      }
    }

    runFirestoreTest()
  }, [])

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Firestore Test</h1>
          <p className="text-gray-600">Testing Firestore database functionality</p>
        </div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Firestore Test Status
            </h3>
            {testStatus === 'loading' && <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />}
            {testStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
            {testStatus === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
          </div>
          <p className="text-sm text-gray-600">
            Status: <span className="font-medium">
              {testStatus === 'loading' && 'Testing...'}
              {testStatus === 'success' && 'All tests passed'}
              {testStatus === 'error' && 'Tests failed'}
            </span>
          </p>
        </motion.div>

        {/* Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Logs</h3>
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
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Link
            href="/admin/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Registration
          </Link>
          <Link
            href="/admin/profile"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Test Profile
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Run Test Again
          </button>
        </motion.div>
      </div>
    </div>
  )
}
