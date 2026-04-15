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
  try {
    const db = getDb()
    const col = collection(db, COLLECTION)
    const docData = {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone || '',
      service: input.service || '',
      message: input.message,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    console.log('Creating contact submission with data:', JSON.stringify(docData, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt') return 'serverTimestamp()'
      return value
    }, 2))
    const ref = await addDoc(col, docData)
    console.log('Contact submission created with ID:', ref.id)
    return ref.id
  } catch (error) {
    console.error('Error creating contact submission:', error)
    throw error
  }
}

export async function fetchContactSubmissions(take = 100): Promise<ContactSubmission[]> {
  try {
    const db = getDb()
    const col = collection(db, COLLECTION)
    const q = query(col, orderBy('createdAt', 'desc'))
    console.log('Fetching contact submissions with query orderBy createdAt desc')
    const snap = await getDocs(q)
    console.log('Fetched documents count:', snap.size)
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
    console.log('Returning contact submissions:', items.length)
    return items.slice(0, take)
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    throw error
  }
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


