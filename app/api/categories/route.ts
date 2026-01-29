import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

// GET all service categories (Unified source for frontend 'What We Offer' and Admin)
export async function GET() {
    try {
        const db = await getAdminDb()
        const snapshot = await db.collection('service_categories').orderBy('createdAt', 'desc').get()

        // Map to array format expected by Services.tsx
        const categories = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        // Add caching headers
        const response = NextResponse.json(categories)
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
        response.headers.set('CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')

        return response
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
}
