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

    // Save to Firestore in the structure    console.log('=== CONFIG SAVE API START ===')
    console.log('Received data keys:', Object.keys(data))
    if (data.gallery) console.log('Gallery items count:', data.gallery.length)
    if (data.stats) console.log('Stats title:', data.stats.title)

    const savePath = db.collection('config').doc('site')
    await savePath.set({
      ...data,
      updatedAt: new Date().toISOString()
    })

    console.log('=== CONFIG SAVE API SUCCESS ===')
    return NextResponse.json({ success: true, savedAt: new Date().toISOString(), data })
  } catch (error) {
    console.error('Error saving site config:', error)
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    )
  }
}


