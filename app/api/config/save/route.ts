import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Invalid configuration data' },
        { status: 400 }
      )
    }

    const db = await getAdminDb()

    // Save to Firestore in the structure expected by useSiteConfig
    await db.collection('config').doc('site').set({
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving site config:', error)
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    )
  }
}


