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
    
    // Add caching headers
    const response = NextResponse.json({ slides })
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    
    return response
  } catch (error) {
    console.error('Error fetching slides:', error)
    // If Firebase Admin is not initialized, return empty array instead of error
    // This allows the site to work even without admin credentials
    if (error instanceof Error && error.message.includes('Firebase Admin not initialized')) {
      console.warn('Firebase Admin not initialized, returning empty slides array')
      const response = NextResponse.json({ slides: [] })
      response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
      response.headers.set('CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
      return response
    }
    return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  try {
    console.log('=== SLIDE CREATION API START ===', new Date().toISOString())
    
    const dbStart = Date.now()
    const db = await getAdminDb()
    console.log('Database connection:', Date.now() - dbStart, 'ms')
    
    const bodyStart = Date.now()
    const body = await request.json()
    console.log('Request body parsed:', Date.now() - bodyStart, 'ms')
    let { imageUrl, title, subtitle, ctaLabel, ctaHref, order } = body

    // Validate imageUrl - reject base64/data URLs that are too large
    if (imageUrl) {
      const imageSize = new Blob([imageUrl]).size
      console.log('Image URL size:', imageSize, 'bytes')
      
      if (imageSize > 1000000) { // 1MB limit
        // Check if it's a base64/data URL
        if (imageUrl.startsWith('data:')) {
          return NextResponse.json({ 
            error: 'Base64/Data URLs are too large for Firestore. Please upload the image file instead or use a public image URL.' 
          }, { status: 400 })
        }
        return NextResponse.json({ 
          error: 'Image URL is too long (max 1MB). Please use a shorter URL or upload the image file.' 
          }, { status: 400 })
      }
    }

    // Get the next order number if not provided (optimized)
    let slideOrder = order
    if (slideOrder === undefined) {
      const orderStart = Date.now()
      try {
        const countSnapshot = await db.collection('heroSlides').count().get()
        slideOrder = countSnapshot.data().count + 1
        console.log('Order calculated:', Date.now() - orderStart, 'ms, next order:', slideOrder)
      } catch (orderError) {
        console.warn('Failed to get count, using timestamp-based order:', orderError)
        slideOrder = Date.now() // Use timestamp as order if count fails
      }
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

    console.log('Creating slide with data:', { ...slideData, imageUrl: imageUrl ? `${imageUrl.substring(0, 100)}...` : '' })
    const createStart = Date.now()
    const docRef = await db.collection('heroSlides').add(slideData)
    console.log('Firestore write:', Date.now() - createStart, 'ms, ID:', docRef.id)
    
    const result = { 
      id: docRef.id, 
      ...slideData 
    }
    
    console.log('=== SLIDE CREATION SUCCESS === Total:', Date.now() - startTime, 'ms')
    return NextResponse.json(result)
  } catch (error) {
    console.error('=== SLIDE CREATION ERROR === Failed after', Date.now() - startTime, 'ms')
    console.error('Error creating slide:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    
    // Provide more helpful error messages
    if (errorMessage.includes('Firebase Admin not initialized')) {
      return NextResponse.json({ 
        error: 'Firebase Admin is not configured. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.' 
      }, { status: 503 })
    }
    
    // Handle Firestore size limit errors
    if (errorMessage.includes('longer than') && errorMessage.includes('bytes')) {
      return NextResponse.json({ 
        error: 'Image URL is too large. Please upload an image file or use a public image URL instead of base64/data URLs.' 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: `Failed to create slide: ${errorMessage}` 
    }, { status: 500 })
  }
}
