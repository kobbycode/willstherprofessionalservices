'use client'

import { useState, useEffect } from 'react'
import { fetchPosts } from '@/lib/blog'

export default function TestPublishedPosts() {
  const [publishedPosts, setPublishedPosts] = useState<any[]>([])
  const [allPosts, setAllPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)
      try {
        // Fetch published posts only
        const published = await fetchPosts(true, 100)
        setPublishedPosts(published)
        
        // Fetch all posts
        const all = await fetchPosts(false, 100)
        setAllPosts(all)
        
        console.log('Published posts:', published)
        console.log('All posts:', all)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  if (loading) {
    return <div className="p-8">Loading posts...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Published Posts</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Published Posts ({publishedPosts.length})</h2>
        {publishedPosts.length === 0 ? (
          <p className="text-gray-500">No published posts found</p>
        ) : (
          <div className="space-y-4">
            {publishedPosts.map((post) => (
              <div key={post.id} className="border p-4 rounded-lg">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">Status: {post.status}</p>
                <p className="text-sm text-gray-600">Category: {post.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">All Posts ({allPosts.length})</h2>
        {allPosts.length === 0 ? (
          <p className="text-gray-500">No posts found</p>
        ) : (
          <div className="space-y-4">
            {allPosts.map((post) => (
              <div key={post.id} className="border p-4 rounded-lg">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">Status: {post.status} {post.status === 'published' ? '✅' : '❌'}</p>
                <p className="text-sm text-gray-600">Category: {post.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}