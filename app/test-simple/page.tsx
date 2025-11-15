'use client'

import { useState } from 'react'
import { getDb } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

export default function SimpleTestPage() {
  const [status, setStatus] = useState('Ready')
  const [postId, setPostId] = useState('')

  const testCreatePost = async () => {
    try {
      setStatus('Getting Firestore instance...')
      const db = getDb()
      
      setStatus('Creating test post...')
      const docRef = await addDoc(collection(db, 'posts'), {
        title: 'Test Post',
        content: 'This is a test post created at ' + new Date().toISOString(),
        category: 'Test',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      setStatus('Post created successfully!')
      setPostId(docRef.id)
      console.log('Test post created with ID:', docRef.id)
    } catch (error) {
      console.error('Test failed:', error)
      setStatus('Test failed: ' + (error as Error).message)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Simple Firebase Test</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <p className="text-lg mb-4"><strong>Status:</strong> {status}</p>
        {postId && <p className="text-lg"><strong>Post ID:</strong> {postId}</p>}
      </div>
      
      <button
        onClick={testCreatePost}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        Test Create Post
      </button>
      
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
        <p>Click the button above to test creating a post in Firebase. Check the browser console for detailed logs.</p>
      </div>
    </div>
  )
}