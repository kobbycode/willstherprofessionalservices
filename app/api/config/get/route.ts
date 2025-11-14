import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const db = await getAdminDb()
    const doc = await db.collection('config').doc('hero').get()
    if (!doc.exists) {
      const response = NextResponse.json({ config: null })
      response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
      response.headers.set('CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
      return response
    }
    const data = doc.data() || {}
    const response = NextResponse.json({ config: data })
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    return response
  } catch (error) {
    console.error('Error loading site config:', error)
    return NextResponse.json({ error: 'Failed to load configuration' }, { status: 500 })
  }
}