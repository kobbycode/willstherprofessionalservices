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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Firebase Admin not initialized')) {
      return NextResponse.json({ 
        error: 'Firebase Admin is not configured. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.' 
      }, { status: 503 })
    }
    
    return NextResponse.json({ 
      error: `Failed to update slide: ${errorMessage}` 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getAdminDb()
    const { id } = params
    await db.collection('heroSlides').doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Firebase Admin not initialized')) {
      return NextResponse.json({ 
        error: 'Firebase Admin is not configured. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.' 
      }, { status: 503 })
    }
    
    return NextResponse.json({ 
      error: `Failed to delete slide: ${errorMessage}` 
    }, { status: 500 })
  }
}
