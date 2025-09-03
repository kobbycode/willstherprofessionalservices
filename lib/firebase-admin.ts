'use server'

import admin from 'firebase-admin'

// Initialize Firebase Admin SDK once per runtime
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  let privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin env vars are missing. Admin features will be disabled.')
  } else {
    // Vercel stores multiline secrets with \n; convert to real newlines
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n')
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      })
    })
  }
}

export function getAdminDb() {
  if (!admin.apps.length) throw new Error('Firebase Admin not initialized')
  return admin.firestore()
}

export async function verifyIdToken(idToken: string) {
  if (!admin.apps.length) throw new Error('Firebase Admin not initialized')
  return admin.auth().verifyIdToken(idToken)
}


