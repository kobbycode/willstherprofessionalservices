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
  storageBucket: 'wilsther-profesional-services.appspot.com',
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
    const existingApps = getApps()
    if (existingApps.length > 0) {
      app = existingApps[0]!
      console.log('Using existing Firebase app')
    } else {
      app = initializeApp(firebaseConfig)
      console.log('Created new Firebase app')
    }
  }
  return app
}

export function getDb(): Firestore {
  if (typeof window === 'undefined') {
    throw new Error('Firestore can only be initialized on the client side')
  }
  
  if (!db) {
    db = getFirestore(getFirebaseApp())
  }
  return db
}

export function getStorageClient(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(getFirebaseApp())
  }
  return storage
}

export function getAuth(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth can only be initialized on the client side')
  }
  
  if (!auth) {
    console.log('Initializing Firebase auth...')
    const app = getFirebaseApp()
    auth = getFirebaseAuth(app)
    console.log('Firebase auth initialized')
  }
  return auth
}

export async function getClientAnalytics(): Promise<Analytics | undefined> {
  if (analytics) return analytics
  try {
    if (typeof window === 'undefined') return undefined
    if (await isSupported()) {
      analytics = getAnalytics(getFirebaseApp())
      return analytics
    }
  } catch {
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
  
  if (auth?.currentUser) {
    console.log('Current user:', {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      emailVerified: auth.currentUser.emailVerified
    })
  } else {
    console.log('No current user')
  }
  console.log('=== END FIREBASE CONFIG DEBUG ===')
}


