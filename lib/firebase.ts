// Firebase client initialization
// This module is safe to import in client components. It lazily initializes Firebase once.

'use client'

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getAuth as getFirebaseAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyB4XxvcqkCGS6IgwkDQSKEr8XFKJgodCIU',
  authDomain: 'wilsther-profesional-services.firebaseapp.com',
  projectId: 'wilsther-profesional-services',
  storageBucket: 'wilsther-profesional-services.firebasestorage.app',
  messagingSenderId: '484189314031',
  appId: '1:484189314031:web:cc4f556f31e37757eab41a',
  measurementId: 'G-BGVH0BFR5Y'
}

let app: FirebaseApp | undefined
let db: Firestore | undefined
let storage: FirebaseStorage | undefined
let analytics: Analytics | undefined
let auth: Auth | undefined

export function getFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be initialized on the client side')
  }
  
  if (!app) {
    const existingApps = getApps()
    if (existingApps.length > 0) {
      app = existingApps[0]!
    } else {
      try {
        app = initializeApp(firebaseConfig)
      } catch (error) {
        console.error('Failed to initialize Firebase app:', error)
        throw error
      }
    }
  }
  return app
}

export function getDb(): Firestore {
  if (typeof window === 'undefined') {
    throw new Error('Firestore can only be initialized on the client side')
  }
  
  if (!db) {
    try {
      const firebaseApp = getFirebaseApp()
      db = getFirestore(firebaseApp)
    } catch (error) {
      console.error('Failed to initialize Firestore:', error)
      throw error
    }
  }
  return db
}

export function getStorageClient(): FirebaseStorage {
  if (!storage) {
    try {
      const firebaseApp = getFirebaseApp()
      storage = getStorage(firebaseApp)
    } catch (error) {
      console.error('Failed to initialize Firebase Storage:', error)
      throw error
    }
  }
  return storage
}

export function getAuth(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth can only be initialized on the client side')
  }
  
  if (!auth) {
    try {
      const firebaseApp = getFirebaseApp()
      auth = getFirebaseAuth(firebaseApp)
    } catch (error) {
      console.error('Failed to initialize Firebase auth:', error)
      throw error
    }
  }
  return auth
}

export async function getClientAnalytics(): Promise<Analytics | undefined> {
  if (analytics) return analytics
  try {
    if (typeof window === 'undefined') return undefined
    if (await isSupported()) {
      const firebaseApp = getFirebaseApp()
      analytics = getAnalytics(firebaseApp)
      return analytics
    }
  } catch (error) {
    console.error('Failed to initialize Analytics:', error)
    return undefined
  }
  return undefined
}

// Debug function to verify Firebase configuration
export function debugFirebaseConfig() {
}

// Initialize Firebase immediately when this module is imported
if (typeof window !== 'undefined') {
  try {
    // Pre-initialize Firebase to ensure it's ready
    getFirebaseApp()
    
    // Also pre-initialize auth to maintain session
    const auth = getAuth()
  } catch (error) {
    console.error('Failed to pre-initialize Firebase:', error)
  }
}


