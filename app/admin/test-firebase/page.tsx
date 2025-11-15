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
        console.log('Firestore instance:', db)
        
        setStatus('Accessing posts collection...')
        const postsRef = collection(db, 'posts')
        console.log('Posts collection reference:', postsRef)
        
        setStatus('Reading posts...')
        const snapshot = await getDocs(postsRef)
        console.log('Posts snapshot:', snapshot)
        
        const posts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        console.log('Posts data:', posts)
        
        setResults(posts)
        setStatus('Firebase connection test successful!')
        
        // Test creating a document
        setStatus('Testing document creation...')
        const testDoc = await addDoc(collection(db, 'test'), {
          test: 'Firebase test',
          timestamp: serverTimestamp()
        })
        console.log('Test document created:', testDoc.id)
        setStatus('All tests passed!')
        
      } catch (error) {
        console.error('Firebase test failed:', error)
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