import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

// PUT - Update service
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getAdminDb()
    const { id } = params
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
      updatedAt: new Date().toISOString()
    }

    await db.collection('services').doc(id).update(serviceData)
    
    return NextResponse.json({ 
      id, 
      ...serviceData,
      success: true 
    })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json({ 
      error: `Failed to update service: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}

// DELETE - Remove service
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('DELETE request received for service ID:', params.id)
    const db = await getAdminDb()
    const { id } = params
    console.log('Attempting to delete service with ID:', id)
    
    // Check if the document exists before trying to delete
    const docRef = db.collection('services').doc(id)
    const doc = await docRef.get()
    
    if (!doc.exists) {
      console.log('Service not found with ID:', id)
      return NextResponse.json({ 
        error: 'Service not found' 
      }, { status: 404 })
    }
    
    await docRef.delete()
    console.log('Service deleted successfully with ID:', id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ 
      error: `Failed to delete service: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}
