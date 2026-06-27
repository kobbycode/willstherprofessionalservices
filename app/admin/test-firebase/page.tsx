'use client'

import { useState, useEffect } from 'react'
import { getDb } from '@/lib/firebase'
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'

export default function TestFirebasePage() {
  const [status, setStatus] = useState('Testing...')
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    const testFirebase = async () => {
      try {
        setStatus('Getting Firestore instance...')
        const db = getDb()
        const q = collection(db, 'posts')
        const postsSnapshot = await getDocs(q)
        const posts = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setResults(posts)
        setStatus('Firebase connection test successful!')
        
        // Test creating a document
        setStatus('Testing document creation...')
        const testDoc = await addDoc(collection(db, 'test'), {
          test: 'Firebase test',
          timestamp: serverTimestamp()
        })
        setStatus('All tests passed!')
        
      } catch (error) {
        setStatus('Firebase test failed: ' + (error as Error).message)
      }
    }
    
    testFirebase()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p className="font-mono">{status}</p>
      </div>
      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Posts Found: {results.length}</h2>
          <ul className="list-disc pl-5">
            {results.slice(0, 5).map((post: any) => (
              <li key={post.id} className="mb-1">
                {post.title || 'Untitled'} - {post.status || 'No status'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}