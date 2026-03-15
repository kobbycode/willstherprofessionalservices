import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const db = await getAdminDb()
    const doc = await db.collection('config').doc('site').get()

    let data = {}
    if (doc.exists) {
      data = doc.data() || {}
    } else {
      // Try fallback to 'hero' if 'site' doesn't exist yet
      const heroDoc = await db.collection('config').doc('hero').get()
      if (heroDoc.exists) {
        data = heroDoc.data() || {}
      }
    }

    const response = NextResponse.json({ config: data })
    // Remove caching to ensure real-time consistency
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    return response
  } catch (error) {
    console.error('Error loading site config:', error)
    // If Firebase Admin is not initialized or authentication fails, return default config
    if (error instanceof Error && (error.message.includes('Firebase Admin not initialized') || error.message.includes('UNAUTHENTICATED'))) {
      console.warn('Firebase Admin not initialized or authentication failed, returning null config')
      const response = NextResponse.json({ config: null })
      response.headers.set('Cache-Control', 'no-store, max-age=0')
      return response
    }
    return NextResponse.json({ error: 'Failed to load configuration' }, { status: 500 })
  }
}