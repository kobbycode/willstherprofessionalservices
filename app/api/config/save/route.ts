import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const { heroSlides } = await request.json()
    
    if (!heroSlides || !Array.isArray(heroSlides)) {
      return NextResponse.json(
        { error: 'Invalid heroSlides data' },
        { status: 400 }
      )
    }

    const db = await getAdminDb()
    
    // Save to Firestore in the structure expected by useSiteConfig
    await db.collection('config').doc('hero').set({
      heroSlides,
      updatedAt: new Date().toISOString()
    }, { merge: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving hero config:', error)
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    )
  }
}


