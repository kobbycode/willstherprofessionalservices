import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getAdminDb()
    const { id } = params
    const body = await request.json()
    const { imageUrl, title, subtitle, ctaLabel, ctaHref, order } = body

    const updateData = {
      ...(imageUrl !== undefined && { imageUrl }),
      ...(title !== undefined && { title }),
      ...(subtitle !== undefined && { subtitle }),
      ...(ctaLabel !== undefined && { ctaLabel }),
      ...(ctaHref !== undefined && { ctaHref }),
      ...(order !== undefined && { order }),
      updatedAt: new Date().toISOString()
    }

    await db.collection('heroSlides').doc(id).update(updateData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating slide:', error)
    return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getAdminDb()
    const { id } = params
    
    await db.collection('heroSlides').doc(id).delete()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting slide:', error)
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 })
  }
}
