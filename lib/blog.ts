'use client'

import { getDb } from './firebase'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit as fsLimit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  updateDoc,
  deleteDoc,
  increment
} from 'firebase/firestore'

export type BlogPost = {
  id: string
  title: string
  excerpt?: string
  content: string
  author: string
  date: string // ISO string
  readTime: string
  category: string
  image?: string
  tags: string[]
  status: 'draft' | 'published' | 'scheduled'
  views?: number
  createdAt?: string
  updatedAt?: string
}

export type NewPostInput = {
  title: string
  excerpt?: string
  content: string
  category: string
  image?: string
  tags?: string[]
  status?: 'draft' | 'published' | 'scheduled'
  author?: string
}

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

export { estimateReadTime }
const POSTS_COLLECTION = 'posts'

export async function fetchPosts(publishedOnly = true, take = 50): Promise<BlogPost[]> {
  const db = getDb()
  const colRef = collection(db, POSTS_COLLECTION)
  let snap
  
  try {
    let q
    if (publishedOnly) {
      // Try with orderBy first
      try {
        q = query(colRef, where('status', '==', 'published'), orderBy('createdAt', 'desc'), fsLimit(take))
        snap = await getDocs(q)
      } catch (orderError) {
        console.warn('Failed to order posts by createdAt, trying without orderBy:', orderError)
        // Fallback without orderBy if index is missing
        q = query(colRef, where('status', '==', 'published'), fsLimit(take))
        snap = await getDocs(q)
      }
    } else {
      // Try with orderBy first
      try {
        q = query(colRef, orderBy('createdAt', 'desc'), fsLimit(take))
        snap = await getDocs(q)
      } catch (orderError) {
        console.warn('Failed to order all posts by createdAt, trying without orderBy:', orderError)
        // Fallback without orderBy if index is missing
        q = query(colRef, fsLimit(take))
        snap = await getDocs(q)
      }
    }
  } catch (e) {
    console.error('Failed to fetch posts with query, falling back to basic fetch:', e)
    // Ultimate fallback - fetch all and filter manually
    const allSnap = await getDocs(colRef)
    const allPosts = allSnap.docs.map((d) => {
      const data = d.data() as any
      return {
        id: d.id,
        title: data.title || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        author: data.author || 'Willsther Team',
        date: (data.date as string) || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        readTime: data.readTime || estimateReadTime(data.content || ''),
        category: data.category || 'General',
        image: data.image || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        status: data.status || 'draft',
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString()
      } satisfies BlogPost
    })
    
    // Filter manually if needed
    snap = {
      docs: publishedOnly 
        ? allSnap.docs.filter(d => {
            const data = d.data() as any
            return (data.status || 'draft') === 'published'
          })
        : allSnap.docs,
      size: publishedOnly 
        ? allSnap.docs.filter(d => {
            const data = d.data() as any
            return (data.status || 'draft') === 'published'
          }).length
        : allSnap.size,
      empty: publishedOnly 
        ? allSnap.docs.filter(d => {
            const data = d.data() as any
            return (data.status || 'draft') === 'published'
          }).length === 0
        : allSnap.empty,
      forEach: (callback: (doc: any) => void) => {
        if (publishedOnly) {
          allSnap.docs
            .filter(d => {
              const data = d.data() as any
              return (data.status || 'draft') === 'published'
            })
            .forEach(callback)
        } else {
          allSnap.forEach(callback)
        }
      }
    }
  }
  
  return snap.docs.map((d) => {
    const data = d.data() as any
    return {
      id: d.id,
      title: data.title || '',
      excerpt: data.excerpt || '',
      content: data.content || '',
      author: data.author || 'Willsther Team',
      date: (data.date as string) || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      readTime: data.readTime || estimateReadTime(data.content || ''),
      category: data.category || 'General',
      image: data.image || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      status: data.status || 'draft',
      views: data.views || 0,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString()
    } satisfies BlogPost
  })
}

export async function fetchPostById(id: string): Promise<BlogPost | null> {
  const db = getDb()
  const ref = doc(db, POSTS_COLLECTION, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const data = snap.data() as any
  return {
    id: snap.id,
    title: data.title || '',
    excerpt: data.excerpt || '',
    content: data.content || '',
    author: data.author || 'Willsther Team',
    date: (data.date as string) || new Date().toISOString(),
    readTime: data.readTime || estimateReadTime(data.content || ''),
    category: data.category || 'General',
    image: data.image || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    status: data.status || 'draft',
    views: data.views || 0,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString()
  } satisfies BlogPost
}

export async function createPost(input: NewPostInput): Promise<string> {
  console.log('=== CREATE POST START ===')
  console.log('Input data:', {
    title: input.title,
    excerpt: input.excerpt?.substring(0, 50) + '...',
    contentLength: input.content?.length,
    category: input.category,
    image: input.image ? 'present' : 'missing',
    tags: input.tags,
    status: input.status,
    author: input.author
  })
  
  // Validate image URL - reject base64/data URLs
  if (input.image && input.image.startsWith('data:')) {
    throw new Error('Base64/Data URLs are not allowed. Please upload images to Firebase Storage.');
  }
  
  // Strategy 1: Try direct Firestore access with reduced timeout
  try {
    console.log('Attempting createPost with direct Firestore access...')
    const db = getDb()
    console.log('Firestore DB instance obtained')
    
    const col = collection(db, POSTS_COLLECTION)
    console.log('Collection reference created:', POSTS_COLLECTION)
    
    // Simplified post data
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
    
    console.log('Post data prepared with status:', postData.status)
    
    // Short timeout for initial attempt
    const result = await Promise.race([
      addDoc(col, postData),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Direct Firestore attempt timed out after 8 seconds')), 8000)
      )
    ])
    
    console.log('Document added with ID:', result.id)
    return result.id
  } catch (error) {
    console.error('Direct Firestore attempt failed:', error)
    
    // Strategy 2: Try API route as fallback
    try {
      console.log('Attempting createPost via API route...')
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
      
      const data = await response.json()
      console.log('API route successful, post ID:', data.id)
      return data.id
    } catch (apiError) {
      console.error('API route attempt failed:', apiError)
      
      // Strategy 3: Try with even shorter timeout and simplified data
      try {
        console.log('Attempting final fallback with minimal data...')
        const db = getDb()
        const col = collection(db, POSTS_COLLECTION)
        
        // Even more simplified data
        const minimalData = {
          title: input.title || 'Untitled Post',
          content: input.content || 'No content',
          category: input.category || 'General',
          status: input.status || 'draft',
          createdAt: new Date().toISOString()
        }
        
        console.log('Minimal data prepared with status:', minimalData.status)
        
        const result = await Promise.race([
          addDoc(col, minimalData),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Final fallback timed out after 5 seconds')), 5000)
          )
        ])
        
        console.log('Final fallback successful, document ID:', result.id)
        return result.id
      } catch (finalError) {
        console.error('All attempts failed')
        // If all attempts fail, rethrow the original error for better context
        throw error
      }
    }
  }
}

export async function updatePost(id: string, input: Partial<NewPostInput>): Promise<void> {
  // Validate image URL - reject base64/data URLs
  if (input.image && input.image.startsWith('data:')) {
    throw new Error('Base64/Data URLs are not allowed. Please upload images to Firebase Storage.');
  }
  
  const db = getDb()
  const ref = doc(db, POSTS_COLLECTION, id)
  const updateData: any = {
    ...input,
    updatedAt: serverTimestamp()
  }
  
  // Recalculate read time if content changed
  if (input.content) {
    updateData.readTime = estimateReadTime(input.content)
  }
  
  await updateDoc(ref, updateData)
}

export async function updatePostStatus(id: string, status: 'draft' | 'published' | 'scheduled'): Promise<void> {
  const db = getDb()
  const ref = doc(db, POSTS_COLLECTION, id)
  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp()
  })
}

export async function deletePost(id: string): Promise<void> {
  const db = getDb()
  const ref = doc(db, POSTS_COLLECTION, id)
  await deleteDoc(ref)
}

export async function incrementViews(id: string): Promise<void> {
  const db = getDb()
  const ref = doc(db, POSTS_COLLECTION, id)
  await updateDoc(ref, {
    views: increment(1)
  })
}


