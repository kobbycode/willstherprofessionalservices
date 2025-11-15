import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

// PUT - Update service category
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      updatedAt: new Date().toISOString()
    }

    const docRef = db.collection('service_categories').doc(params.id)
    await docRef.set(categoryData, { merge: true })
    
    const updatedDoc = await docRef.get()
    
    return NextResponse.json({ 
      id: updatedDoc.id, 
      ...updatedDoc.data()
    })
  } catch (error) {
    console.error('Error updating service category:', error)
    return NextResponse.json({ 
      error: `Failed to update service category: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}

// DELETE - Remove service category
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getAdminDb()
    await db.collection('service_categories').doc(params.id).delete()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service category:', error)
    return NextResponse.json({ 
      error: `Failed to delete service category: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}