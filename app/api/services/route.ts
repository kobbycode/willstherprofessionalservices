import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

// GET all services
export async function GET() {
  try {
    console.log('=== SERVICES API: Starting to fetch services ===')

    const db = await getAdminDb()
    console.log('=== SERVICES API: Firebase Admin DB initialized ===')

    // Try to fetch services with orderBy, but fallback to without if it fails
    let snapshot;
    try {
      console.log('=== SERVICES API: Attempting to fetch services with orderBy ===')
      // Add a limit to prevent loading too much data
      snapshot = await db.collection('services').orderBy('createdAt', 'desc').limit(50).get()
      console.log('=== SERVICES API: Firestore query with orderBy completed, docs count:', snapshot.size)
    } catch (orderByError) {
      console.warn('=== SERVICES API: orderBy failed, fetching without orderBy ===', orderByError)
      // Add a limit to prevent loading too much data
      snapshot = await db.collection('services').limit(50).get()
      console.log('=== SERVICES API: Firestore query without orderBy completed, docs count:', snapshot.size)
    }

    console.log('=== SERVICES API: Processing documents ===')
    const services = []

    // Process documents one by one with error handling
    // Only process the fields we need to reduce payload size
    for (let i = 0; i < snapshot.docs.length; i++) {
      const doc = snapshot.docs[i];
      try {
        const data = doc.data()
        // Only include the fields we actually need
        services.push({
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'General',
          imageUrl: data.imageUrl || '',
          createdAt: data.createdAt || null
        })
      } catch (docError) {
        console.error(`=== SERVICES API: Error processing document ${doc.id} ===`, docError)
        // Continue with other documents even if one fails
      }
    }

    console.log('=== SERVICES API: Services processed, count:', services.length)

    // No caching to ensure deleted items are removed immediately
    const response = NextResponse.json({ services })
    response.headers.set('Cache-Control', 'no-store, max-age=0')

    console.log('=== SERVICES API: Response sent successfully ===')
    return response
  } catch (error: any) {
    console.error('=== SERVICES API: Error fetching services ===', error)

    // Provide more specific error messages
    let errorMessage = 'Failed to fetch services'
    let errorDetails = error.message || 'Unknown error'

    if (error.code === 7 && error.message.includes('PERMISSION_DENIED')) {
      errorMessage = 'Firebase Permission Denied'
      errorDetails = 'Check your Firebase Admin credentials and ensure they have proper permissions'
    }

    return NextResponse.json({
      error: errorMessage,
      details: errorDetails,
      code: error.code
    }, { status: 500 })
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  try {
    console.log('=== SERVICE CREATION START ===', new Date().toISOString())

    const db = await getAdminDb()
    const body = await request.json()
    const { title, description, imageUrl, category } = body

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const serviceData = {
      title: title.trim(),
      description: description?.trim() || '',
      imageUrl: imageUrl?.trim() || '',
      category: category?.trim() || 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const docRef = await db.collection('services').add(serviceData)
    console.log('=== SERVICE CREATED === ID:', docRef.id, 'Time:', Date.now() - startTime, 'ms')

    return NextResponse.json({
      id: docRef.id,
      ...serviceData
    })
  } catch (error: any) {
    console.error('=== SERVICE CREATION ERROR ===', error)

    // Provide more specific error messages
    let errorMessage = 'Failed to create service'
    let errorDetails = error.message || 'Unknown error'

    if (error.code === 7 && error.message.includes('PERMISSION_DENIED')) {
      errorMessage = 'Firebase Permission Denied'
      errorDetails = 'Check your Firebase Admin credentials and ensure they have proper permissions'
    }

    return NextResponse.json({
      error: errorMessage,
      details: errorDetails,
      code: error.code
    }, { status: 500 })
  }
}