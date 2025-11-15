'use client'

import { useState, useEffect } from 'react'
import { fetchPosts } from '@/lib/blog'
import { getDb } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

export default function DebugPostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [allPosts, setAllPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        
        // Check what's in the database directly
        const db = getDb()
        const postsRef = collection(db, 'posts')
        const q = query(postsRef, orderBy('createdAt', 'desc'), limit(50))
        const snapshot = await getDocs(q)
        
        const allPostsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        setAllPosts(allPostsData)
        
        // Check what our function returns
        const publishedPosts = await fetchPosts(true, 100)
        const allPostsViaFunction = await fetchPosts(false, 100)
        
        console.log('All posts from DB:', allPostsData)
        console.log('Published posts via function:', publishedPosts)
        console.log('All posts via function:', allPostsViaFunction)
        
        setPosts(publishedPosts)
      } catch (err) {
        console.error('Failed to fetch posts:', err)
        setError('Failed to fetch posts: ' + (err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  if (loading) {
    return <div className="p-8">Loading posts...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Blog Posts</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Published Posts (via function): {posts.length}</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-gray-600">Status: {post.status}</p>
              <p className="text-gray-600">Category: {post.category}</p>
              <p className="text-gray-600">Created: {post.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">All Posts in Database: {allPosts.length}</h2>
        <div className="space-y-4">
          {allPosts.map((post) => (
            <div key={post.id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-gray-600">Status: {post.status} {post.status === 'published' ? '✅' : '❌'}</p>
              <p className="text-gray-600">Category: {post.category}</p>
              <p className="text-gray-600">Created: {post.createdAt}</p>
              <p className="text-gray-600">ID: {post.id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}