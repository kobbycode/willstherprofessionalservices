import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

// GET all service categories
export async function GET() {
  try {
    const db = await getAdminDb()
    const snapshot = await db.collection('service_categories').orderBy('createdAt', 'desc').get()
    
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Add caching headers
    const response = NextResponse.json({ categories })
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    
    return response
  } catch (error) {
    console.error('Error fetching service categories:', error)
    return NextResponse.json({ error: 'Failed to fetch service categories' }, { status: 500 })
  }
}

// POST - Create new service category
export async function POST(request: NextRequest) {
  try {
    const db = await getAdminDb()
    const body = await request.json()
    const { title, subtitle, imageUrl } = body

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const categoryData = {
      title: title.trim(),
      subtitle: subtitle?.trim() || '',
      imageUrl: imageUrl?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const docRef = await db.collection('service_categories').add(categoryData)
    
    return NextResponse.json({ 
      id: docRef.id, 
      ...categoryData 
    })
  } catch (error) {
    console.error('Error creating service category:', error)
    return NextResponse.json({ 
      error: `Failed to create service category: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}