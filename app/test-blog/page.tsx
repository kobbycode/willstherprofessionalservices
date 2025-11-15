'use client'

import { useState, useEffect } from 'react'
import { fetchPosts } from '@/lib/blog'

export default function TestBlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        const allPosts = await fetchPosts(false, 100) // Fetch all posts, not just published
        console.log('All posts:', allPosts)
        setPosts(allPosts)
      } catch (err) {
        console.error('Failed to fetch posts:', err)
        setError('Failed to fetch posts')
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
      <h1 className="text-2xl font-bold mb-6">Blog Posts Test</h1>
      <p className="mb-4">Total posts: {posts.length}</p>
      
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">Status: {post.status}</p>
            <p className="text-gray-600">Category: {post.category}</p>
            <p className="text-gray-600">Created: {post.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  )
}