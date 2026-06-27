import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

function estimateReadTime(text: string): string {
  // Strip HTML tags and normalize whitespace for consistent calculation
  if (!text || typeof text !== 'string') return '1 min read'
  
  // Remove HTML tags and normalize whitespace
  const plain = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  
  // Count words more reliably
  const words = plain.split(' ').filter(word => word.length > 0).length
  
  // Ensure consistent calculation
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

export async function POST(request: Request) {
  try {
    const db = await getAdminDb()
    const input = await request.json()
    
    // Validate image URL - reject base64/data URLs
    if (input.image && input.image.startsWith('data:')) {
      return NextResponse.json({ 
        error: 'Base64/Data URLs are not allowed. Please upload images to Firebase Storage.' 
      }, { status: 400 })
    }
    
    // Prepare post data
    const postData = {
      title: input.title,
      excerpt: input.excerpt || '',
      content: input.content,
      category: input.category,
      image: input.image || '',
      tags: input.tags || [],
      status: input.status || 'draft',
      author: input.author || 'Willsther Team',
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: estimateReadTime(input.content)
    }
    
    
    const docRef = await db.collection('posts').add(postData)
    
    return NextResponse.json({ id: docRef.id })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}