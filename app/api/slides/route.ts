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
    console.log('=== SLIDE CREATION API START ===')
    const db = await getAdminDb()
    console.log('Database connection established')
    
    const body = await request.json()
    console.log('Request body received:', body)
    const { imageUrl, title, subtitle, ctaLabel, ctaHref, order } = body

    // Get the next order number if not provided
    let slideOrder = order
    if (slideOrder === undefined) {
      console.log('Getting next order number...')
      const lastSlideSnapshot = await db.collection('heroSlides')
        .orderBy('order', 'desc')
        .limit(1)
        .get()
      slideOrder = lastSlideSnapshot.empty ? 1 : (lastSlideSnapshot.docs[0].data().order || 0) + 1
      console.log('Next order number:', slideOrder)
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

    console.log('Creating slide with data:', slideData)
    const docRef = await db.collection('heroSlides').add(slideData)
    console.log('Slide created with ID:', docRef.id)
    
    const result = { 
      id: docRef.id, 
      ...slideData 
    }
    console.log('Returning result:', result)
    console.log('=== SLIDE CREATION API SUCCESS ===')
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('=== SLIDE CREATION API ERROR ===')
    console.error('Error creating slide:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 })
  }
}
