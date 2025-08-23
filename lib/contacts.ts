'use client'

import { getDb } from './firebase'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore'

export type ContactSubmission = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  service?: string
  message: string
  status: 'new' | 'in_progress' | 'completed'
  createdAt?: string
  updatedAt?: string
}

export type NewContactInput = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  service?: string
  message: string
}

const COLLECTION = 'contact_submissions'

export async function createContactSubmission(input: NewContactInput): Promise<string> {
  const db = getDb()
  const col = collection(db, COLLECTION)
  const ref = await addDoc(col, {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone || '',
    service: input.service || '',
    message: input.message,
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  return ref.id
}

export async function fetchContactSubmissions(take = 100): Promise<ContactSubmission[]> {
  const db = getDb()
  const col = collection(db, COLLECTION)
  const q = query(col, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  const items: ContactSubmission[] = []
  snap.forEach((d) => {
    const data = d.data() as any
    items.push({
      id: d.id,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      service: data.service || '',
      message: data.message || '',
      status: (data.status as any) || 'new',
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString()
    })
  })
  return items.slice(0, take)
}

export async function updateContactStatus(id: string, status: 'new' | 'in_progress' | 'completed'): Promise<void> {
  const db = getDb()
  const ref = doc(db, COLLECTION, id)
  await updateDoc(ref, { status, updatedAt: serverTimestamp() })
}

export async function updateContact(id: string, input: Partial<NewContactInput>): Promise<void> {
  const db = getDb()
  const ref = doc(db, COLLECTION, id)
  await setDoc(ref, { ...input, updatedAt: serverTimestamp() }, { merge: true })
}

export async function deleteContactSubmission(id: string): Promise<void> {
  const db = getDb()
  const ref = doc(db, COLLECTION, id)
  await deleteDoc(ref)
}


