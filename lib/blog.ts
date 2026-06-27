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

export async function fetchPosts(publishedOnly = true, take = 12): Promise<BlogPost[]> {
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
        // Fallback without orderBy if index is missing
        q = query(colRef, fsLimit(take))
        snap = await getDocs(q)
      }
    }
  } catch (e) {
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
  try {
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
  } catch (error) {
    throw error
  }
}

export async function createPost(input: NewPostInput): Promise<string> {
  if (input.image && input.image.startsWith('data:')) {
    throw new Error('Base64/Data URLs are not allowed. Please upload images to Firebase Storage.')
  }
  
  try {
    const db = getDb()
    const col = collection(db, POSTS_COLLECTION)
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
    
    const result = await addDoc(col, postData)
    return result.id
  } catch (error) {
    throw error
  }
}

export async function updatePost(id: string, input: Partial<NewPostInput>): Promise<void> {
  if (input.image && input.image.startsWith('data:')) {
    throw new Error('Base64/Data URLs are not allowed. Please upload images to Firebase Storage.')
  }
  
  try {
    const db = getDb()
    const ref = doc(db, POSTS_COLLECTION, id)
    const updateData: any = { ...input, updatedAt: serverTimestamp() }
    if (input.content) {
      updateData.readTime = estimateReadTime(input.content)
    }
    await updateDoc(ref, updateData)
  } catch (error) {
    throw error
  }
}

export async function updatePostStatus(id: string, status: 'draft' | 'published' | 'scheduled'): Promise<void> {
  try {
    const db = getDb()
    const ref = doc(db, POSTS_COLLECTION, id)
    await updateDoc(ref, { status, updatedAt: serverTimestamp() })
  } catch (error) {
    throw error
  }
}

export async function deletePost(id: string): Promise<void> {
  try {
    const db = getDb()
    const ref = doc(db, POSTS_COLLECTION, id)
    await deleteDoc(ref)
  } catch (error) {
    throw error
  }
}

export async function incrementViews(id: string): Promise<void> {
  try {
    const db = getDb()
    const ref = doc(db, POSTS_COLLECTION, id)
    await updateDoc(ref, { views: increment(1) })
  } catch (error) {
  }
}