import { getAdminDb } from '@/lib/firebase-admin'
import type { Metadata } from 'next'
import ProductDetailClient from './ProductDetailClient'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const siteUrl = 'https://willstherprofessionalservices.com'

    try {
        const db = await getAdminDb()
        const doc = await db.collection('products').doc(params.id).get()

        if (!doc.exists) {
            return { title: 'Product Not Found' }
        }

        const data = doc.data()
        const title = data?.title || 'Product'
        const description = data?.description
            ? data.description.substring(0, 160)
            : 'Check out this product at WILLSTHER Professional Services'
        const imageUrl = data?.images?.[0] || data?.imageUrl || '/logo-v2.jpg'
        const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                type: 'website',
                url: `${siteUrl}/shop/${params.id}`,
                siteName: 'WILLSTHER Professional Services',
                locale: 'en_US',
                images: [{ url: fullImageUrl, width: 1200, height: 630, alt: title }],
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [fullImageUrl],
            },
            alternates: {
                canonical: `${siteUrl}/shop/${params.id}`,
            },
            robots: {
                index: true,
                follow: true,
            },
        }
    } catch {
        return {
            title: 'Shop',
            description: 'Browse our products at WILLSTHER Professional Services',
        }
    }
}

export default function ProductDetailPage() {
    return <ProductDetailClient />
}
