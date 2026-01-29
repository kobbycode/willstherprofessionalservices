import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

// Helper to sanitize undefined values
const cleanData = (data: any) => {
    const cleaned: any = {}
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
            cleaned[key] = data[key]
        }
    })
    return cleaned
}

// Define the shape of our category data
interface CategoryData {
    id?: string
    title: string
    subtitle?: string
    imageUrl?: string
    name?: string // legacy
    createdAt?: string
    updatedAt?: string
    [key: string]: any
}

export async function GET() {
    try {
        const db = await getAdminDb()

        // 1. Fetch current 'good' data from 'service_categories' (Admin Panel source)
        console.log('Fetching service_categories...')
        const sourceSnap = await db.collection('service_categories').get()
        let categories: CategoryData[] = sourceSnap.docs.map(doc => {
            const data = doc.data()
            return {
                ...data,
                id: doc.id,
                title: data.title || '', // Ensure title exists
                subtitle: data.subtitle || '',
                imageUrl: data.imageUrl || ''
            }
        })

        // 2. Fallback: If empty, try to fetch from 'services' distinct categories
        if (categories.length === 0) {
            console.log('service_categories is empty, checking services...')
            const servicesSnap = await db.collection('services').get()
            const uniqueNames = new Set<string>()
            servicesSnap.docs.forEach(doc => {
                const cat = doc.data().category
                if (cat && typeof cat === 'string') uniqueNames.add(cat)
            })

            if (uniqueNames.size > 0) {
                categories = Array.from(uniqueNames).map(name => ({
                    title: name,
                    subtitle: 'Service Category',
                    imageUrl: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }))
            }
        }

        if (categories.length === 0) {
            return NextResponse.json({ message: 'No categories to migrate found in service_categories or services' })
        }

        // 3. Delete existing 'categories' collection items (Legacy data)
        console.log('Clearing old categories collection...')
        const targetCollection = db.collection('categories')
        const targetSnap = await targetCollection.get()

        const deleteBatch = db.batch()
        targetSnap.docs.forEach(doc => deleteBatch.delete(doc.ref))
        await deleteBatch.commit()

        // 4. Populate 'categories' with the good data
        console.log(`Migrating ${categories.length} categories...`)
        const writeBatch = db.batch()

        for (const cat of categories) {
            const newDocRef = targetCollection.doc() // Generate new ID or use existing if we want

            // Ensure strictly defined object to avoid "undefined" errors
            const categoryData = {
                title: cat.title || '',
                subtitle: cat.subtitle || '',
                imageUrl: cat.imageUrl || '',
                name: cat.title || '', // Keep 'name' for legacy compatibility if needed
                createdAt: cat.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            writeBatch.set(newDocRef, categoryData)
        }

        await writeBatch.commit()

        return NextResponse.json({
            success: true,
            migratedCount: categories.length,
            source: sourceSnap.size > 0 ? 'service_categories' : 'services (fallback)'
        })

    } catch (error: any) {
        console.error('Migration failed:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
