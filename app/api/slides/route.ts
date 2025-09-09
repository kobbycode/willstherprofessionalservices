import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const db = await getAdminDb()
    const slidesSnapshot = await db.collection('heroSlides').orderBy('order', 'asc').get()
    const slides = slidesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return NextResponse.json({ slides })
  } catch (error) {
    console.error('Error fetching slides:', error)
    return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getAdminDb()
    const body = await request.json()
    const { imageUrl, title, subtitle, ctaLabel, ctaHref, order } = body

    // Get the next order number if not provided
    let slideOrder = order
    if (slideOrder === undefined) {
      const lastSlideSnapshot = await db.collection('heroSlides')
        .orderBy('order', 'desc')
        .limit(1)
        .get()
      slideOrder = lastSlideSnapshot.empty ? 1 : (lastSlideSnapshot.docs[0].data().order || 0) + 1
    }

    const slideData = {
      imageUrl: imageUrl || '',
      title: title || '',
      subtitle: subtitle || '',
      ctaLabel: ctaLabel || 'Get Started Today',
      ctaHref: ctaHref || '#contact',
      order: slideOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const docRef = await db.collection('heroSlides').add(slideData)
    
    return NextResponse.json({ 
      id: docRef.id, 
      ...slideData 
    })
  } catch (error) {
    console.error('Error creating slide:', error)
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 })
  }
}
