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

const POSTS_COLLECTION = 'posts'

export async function fetchPosts(publishedOnly = true, take = 50): Promise<BlogPost[]> {
  const db = getDb()
  const col = collection(db, POSTS_COLLECTION)
  const q = publishedOnly
    ? query(col, where('status', '==', 'published'), orderBy('createdAt', 'desc'), fsLimit(take))
    : query(col, orderBy('createdAt', 'desc'), fsLimit(take))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data() as any
    return {
      id: d.id,
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
  const db = getDb()
  const col = collection(db, POSTS_COLLECTION)
  const docRef = await addDoc(col, {
    title: input.title,
    excerpt: input.excerpt || '',
    content: input.content,
    category: input.category,
    image: input.image || '',
    tags: input.tags || [],
    status: input.status || 'draft',
    author: input.author || 'Willsther Team',
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    readTime: estimateReadTime(input.content)
  })
  return docRef.id
}

export async function updatePost(id: string, input: Partial<NewPostInput>): Promise<void> {
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


