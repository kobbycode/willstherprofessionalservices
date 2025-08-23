'use client'

import { getDb } from './firebase'
import { collection, getDocs, addDoc, orderBy, query, doc, setDoc, deleteDoc } from 'firebase/firestore'

const COLLECTION = 'categories'

export async function fetchCategories(): Promise<string[]> {
  const db = getDb()
  const col = collection(db, COLLECTION)
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
  const col = collection(db, COLLECTION)
  await addDoc(col, { name })
}

export type CategoryDoc = { id: string; name: string }
export async function fetchCategoriesWithIds(): Promise<CategoryDoc[]> {
  const db = getDb()
  const col = collection(db, COLLECTION)
  const q = query(col, orderBy('name'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, name: (d.data() as any).name || '' }))
}

export async function updateCategory(id: string, name: string) {
  const db = getDb()
  const ref = doc(db, COLLECTION, id)
  await setDoc(ref, { name }, { merge: true })
}

export async function deleteCategory(id: string) {
  const db = getDb()
  const ref = doc(db, COLLECTION, id)
  await deleteDoc(ref)
}


