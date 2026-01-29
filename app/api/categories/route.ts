import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

// GET all service categories (Unified source for frontend 'What We Offer' and Admin)
export async function GET() {
    try {
        const db = await getAdminDb()
        const snapshot = await db.collection('categories').orderBy('createdAt', 'desc').get()

        // Map to array format expected by Services.tsx
        const categories = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        return NextResponse.json(categories)
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
}
