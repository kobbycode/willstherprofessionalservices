import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

let adminInitialized = false

function initializeAdmin() {
  if (adminInitialized || getApps().length > 0) {
    return
  }

  const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID
  const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL
  const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    // Don't throw error immediately - allow app to start
    // Error will be thrown when admin functions are actually called
    console.warn('⚠️ Firebase Admin environment variables not set. Admin features will not work.')
    console.warn('Missing variables:', {
      FIREBASE_PROJECT_ID: FIREBASE_PROJECT_ID ? 'SET' : 'MISSING',
      FIREBASE_CLIENT_EMAIL: FIREBASE_CLIENT_EMAIL ? 'SET' : 'MISSING',
      FIREBASE_PRIVATE_KEY: FIREBASE_PRIVATE_KEY ? 'SET' : 'MISSING'
    })
    return
  }

  try {
    initializeApp({
      credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    })
    adminInitialized = true
    console.log('✅ Firebase Admin initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error)
    console.error('Check your Firebase Admin credentials in .env.local')
    throw error
  }
}

export async function getAdminDb() {
  initializeAdmin()
  if (!getApps().length) {
    const error = new Error('Firebase Admin not initialized. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.')
    console.error('❌ Firebase Admin DB access failed:', error.message)
    throw error
  }
  return getFirestore()
}

export async function verifyIdToken(idToken: string) {
  initializeAdmin()
  if (!getApps().length) {
    const error = new Error('Firebase Admin not initialized. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.')
    console.error('❌ Firebase Auth verification failed:', error.message)
    throw error
  }
  return getAuth().verifyIdToken(idToken)
}