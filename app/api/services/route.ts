import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

// GET all services
export async function GET() {
  try {
    const db = await getAdminDb()
    const snapshot = await db.collection('services').orderBy('createdAt', 'desc').get()
    
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Add caching headers
    const response = NextResponse.json({ services })
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    
    return response
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
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
  } catch (error) {
    console.error('=== SERVICE CREATION ERROR ===', error)
    return NextResponse.json({ 
      error: `Failed to create service: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}
