import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

// GET all services
export async function GET() {
  try {
    console.log('=== SERVICES API: Starting to fetch services ===')
    
    const db = await getAdminDb()
    console.log('=== SERVICES API: Firebase Admin DB initialized ===')
    
    // Test if we can access the services collection
    const testDoc = await db.collection('services').limit(1).get()
    console.log('=== SERVICES API: Test query completed, docs found:', testDoc.size)
    
    // Try to fetch services with orderBy, but fallback to without if it fails
    let snapshot;
    try {
      snapshot = await db.collection('services').orderBy('createdAt', 'desc').get()
      console.log('=== SERVICES API: Firestore query with orderBy completed, docs count:', snapshot.size)
    } catch (orderByError) {
      console.warn('=== SERVICES API: orderBy failed, fetching without orderBy ===', orderByError)
      snapshot = await db.collection('services').get()
      console.log('=== SERVICES API: Firestore query without orderBy completed, docs count:', snapshot.size)
    }
    
    const services = snapshot.docs.map(doc => {
      const data = doc.data()
      console.log('=== SERVICES API: Processing doc:', doc.id, 'data keys:', Object.keys(data))
      return {
        id: doc.id,
        ...data
      }
    })
    
    console.log('=== SERVICES API: Services processed, count:', services.length)
    
    // Add caching headers
    const response = NextResponse.json({ services })
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    
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