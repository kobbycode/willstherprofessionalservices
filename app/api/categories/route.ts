import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

// GET all categories
export async function GET() {
    try {
        const db = await getAdminDb()
        const snapshot = await db.collection('categories').orderBy('name').get()

        const categories = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            // Provide default values for extended fields if missing
            title: doc.data().name,
            subtitle: doc.data().subtitle || '',
            imageUrl: doc.data().imageUrl || ''
        }))

        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
}

export const dynamic = 'force-dynamic'
