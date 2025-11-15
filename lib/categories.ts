'use client'

import { getDb } from './firebase'
import { collection, getDocs, addDoc, orderBy, query, doc, setDoc, deleteDoc } from 'firebase/firestore'

const COLLECTION = 'service_categories'

// Category type with image, title, and subtitle
export type ServiceCategory = {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export async function fetchServiceCategories(): Promise<ServiceCategory[]> {
  const db = getDb()
  const col = collection(db, COLLECTION)
  const q = query(col, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      title: data.title || '',
      subtitle: data.subtitle || '',
      imageUrl: data.imageUrl || '',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    }
  })
}

export async function addServiceCategory(category: Omit<ServiceCategory, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = getDb()
  const col = collection(db, COLLECTION)
  const now = new Date().toISOString()
  return await addDoc(col, {
    ...category,
    createdAt: now,
    updatedAt: now
  })
}

export async function updateServiceCategory(id: string, updates: Partial<Omit<ServiceCategory, 'id' | 'createdAt'>>) {
  const db = getDb()
  const ref = doc(db, COLLECTION, id)
  const now = new Date().toISOString()
  return await setDoc(ref, { ...updates, updatedAt: now }, { merge: true })
}

export async function deleteServiceCategory(id: string) {
  const db = getDb()
  const ref = doc(db, COLLECTION, id)
  return await deleteDoc(ref)
}

// Legacy functions for backward compatibility
export async function fetchCategories(): Promise<string[]> {
  const db = getDb()
  const col = collection(db, 'categories')
  const q = query(col, orderBy('name'))
  const snap = await getDocs(q)
  const names: string[] = []
  snap.forEach((doc) => {
    const data = doc.data() as any
    if (data && typeof data.name === 'string') names.push(data.name)
  })
  return names
}

export async function addCategory(name: string) {
  const db = getDb()
  const col = collection(db, 'categories')
  await addDoc(col, { name })
}

export type CategoryDoc = { id: string; name: string }
export async function fetchCategoriesWithIds(): Promise<CategoryDoc[]> {
  const db = getDb()
  const col = collection(db, 'categories')
  const q = query(col, orderBy('name'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, name: (d.data() as any).name || '' }))
}

export async function updateCategory(id: string, name: string) {
  const db = getDb()
  const ref = doc(db, 'categories', id)
  await setDoc(ref, { name }, { merge: true })
}

export async function deleteCategory(id: string) {
  const db = getDb()
  const ref = doc(db, 'categories', id)
  await deleteDoc(ref)
}