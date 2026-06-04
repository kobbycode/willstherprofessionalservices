'use client'

import { getDb } from './firebase'
import { collection, getDocs, addDoc, orderBy, query, doc, setDoc, deleteDoc } from 'firebase/firestore'

const COLLECTION = 'categories'

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
  try {
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
  } catch (error) {
    console.error('Error fetching service categories:', error)
    throw error
  }
}

export async function addServiceCategory(category: Omit<ServiceCategory, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const db = getDb()
    const col = collection(db, COLLECTION)
    const now = new Date().toISOString()
    return await addDoc(col, {
      ...category,
      createdAt: now,
      updatedAt: now
    })
  } catch (error) {
    console.error('Error adding service category:', error)
    throw error
  }
}

export async function updateServiceCategory(id: string, updates: Partial<Omit<ServiceCategory, 'id' | 'createdAt'>>) {
  try {
    const db = getDb()
    const ref = doc(db, COLLECTION, id)
    const now = new Date().toISOString()
    return await setDoc(ref, { ...updates, updatedAt: now }, { merge: true })
  } catch (error) {
    console.error('Error updating service category:', error)
    throw error
  }
}

export async function deleteServiceCategory(id: string) {
  try {
    const db = getDb()
    const ref = doc(db, COLLECTION, id)
    return await deleteDoc(ref)
  } catch (error) {
    console.error('Error deleting service category:', error)
    throw error
  }
}

// Legacy functions for backward compatibility
export async function fetchCategories(): Promise<string[]> {
  try {
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
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export async function addCategory(name: string) {
  try {
    const db = getDb()
    const col = collection(db, 'categories')
    await addDoc(col, { name })
  } catch (error) {
    console.error('Error adding category:', error)
    throw error
  }
}

export type CategoryDoc = { id: string; name: string }
export async function fetchCategoriesWithIds(): Promise<CategoryDoc[]> {
  try {
    const db = getDb()
    const col = collection(db, 'categories')
    const q = query(col, orderBy('name'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, name: (d.data() as any).name || '' }))
  } catch (error) {
    console.error('Error fetching categories with IDs:', error)
    throw error
  }
}

export async function updateCategory(id: string, name: string) {
  try {
    const db = getDb()
    const ref = doc(db, 'categories', id)
    await setDoc(ref, { name }, { merge: true })
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

export async function deleteCategory(id: string) {
  try {
    const db = getDb()
    const ref = doc(db, 'categories', id)
    await deleteDoc(ref)
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}
