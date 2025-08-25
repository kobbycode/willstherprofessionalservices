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
  projectId: 'wilsther-professional-services',
  storageBucket: 'wilsther-professional-services.appspot.com',
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
    console.log('Initializing Firebase app...')
    console.log('Firebase config:', firebaseConfig)
    const existingApps = getApps()
    if (existingApps.length > 0) {
      app = existingApps[0]!
      console.log('Using existing Firebase app')
    } else {
      try {
        app = initializeApp(firebaseConfig)
        console.log('Created new Firebase app successfully')
        console.log('Firebase app project ID:', app.options.projectId)
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
      console.log('Firestore initialized successfully')
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
      console.log('Firebase Storage initialized successfully')
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
      console.log('Initializing Firebase auth...')
      const firebaseApp = getFirebaseApp()
      auth = getFirebaseAuth(firebaseApp)
      console.log('Firebase auth initialized successfully')
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
  console.log('=== FIREBASE CONFIG DEBUG ===')
  console.log('Firebase config:', firebaseConfig)
  console.log('App initialized:', !!app)
  console.log('Auth initialized:', !!auth)
  console.log('DB initialized:', !!db)
  console.log('Storage initialized:', !!storage)
  console.log('Analytics initialized:', !!analytics)
  console.log('Window available:', typeof window !== 'undefined')
  console.log('Existing apps:', getApps().length)
}

// Initialize Firebase immediately when this module is imported
if (typeof window !== 'undefined') {
  try {
    // Pre-initialize Firebase to ensure it's ready
    getFirebaseApp()
    console.log('Firebase pre-initialized successfully')
    
    // Also pre-initialize auth to maintain session
    const auth = getAuth()
    console.log('Firebase auth pre-initialized, current user:', auth.currentUser?.email)
  } catch (error) {
    console.error('Failed to pre-initialize Firebase:', error)
  }
}


