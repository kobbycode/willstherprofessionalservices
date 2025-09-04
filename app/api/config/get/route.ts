import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const db = await getAdminDb()
    const doc = await db.collection('config').doc('site').get()
    if (!doc.exists) {
      return NextResponse.json({ config: null })
    }
    const data = doc.data() || {}
    return NextResponse.json({ config: data })
  } catch (error) {
    console.error('Error loading site config:', error)
    return NextResponse.json({ error: 'Failed to load configuration' }, { status: 500 })
  }
}


