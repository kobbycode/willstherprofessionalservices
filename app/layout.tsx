import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/auth-context'
import { ShopProvider } from '@/context/ShopContext'
import { SiteProvider } from '@/lib/site-config'
import { CartDrawer } from '@/components/CartDrawer'
import { ThemeProvider } from '@/components/ThemeProvider'
import LayoutWrapper from '@/components/LayoutWrapper'
import NextTopLoader from 'nextjs-toploader'
import { getAdminDb } from '@/lib/firebase-admin'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
})

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-outfit',
})

async function getSEOData() {
  try {
    const db = await getAdminDb()
    const doc = await db.collection('config').doc('site').get()
    const data = doc.data() || {}
    return { siteName: data.siteName || 'Willsther Professional Services', seo: data.seo || {} }
  } catch {
    return { siteName: 'Willsther Professional Services', seo: {} }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { siteName, seo } = await getSEOData()
  const defaultTitle = seo.defaultTitle || `${siteName} - Industrial, Commercial & Household Maintenance`
  const defaultDescription = seo.defaultDescription || 'Fast growing industrial, commercial and household maintenance services provider in Accra, Ghana.'
  const keywords = Array.isArray(seo.keywords) && seo.keywords.length > 0
    ? seo.keywords.join(', ')
    : 'maintenance services Ghana, cleaning services Accra, electrical installation, AC servicing, plumbing services, carpentry services, fumigation services, industrial maintenance, commercial cleaning, household maintenance, professional services Ghana'

  return {
    metadataBase: new URL('https://willstherprofessionalservices.com'),
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`
    },
    description: defaultDescription,
    keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
    icons: {
      icon: [
        { url: '/logo-v2.jpg', sizes: 'any', type: 'image/jpeg' },
        { url: '/favicon.ico', sizes: 'any' },
      ],
      shortcut: '/logo-v2.jpg',
      apple: [
        { url: '/logo-v2.jpg', sizes: '180x180', type: 'image/jpeg' },
      ],
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      url: 'https://willstherprofessionalservices.com',
      siteName,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/logo-v2.jpg',
          width: 1200,
          height: 630,
          alt: `${siteName} Logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDescription,
      images: ['/logo-v2.jpg'],
    },
    alternates: {
      canonical: 'https://willstherprofessionalservices.com',
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Willsther Professional Services",
              "description": "Professional maintenance and cleaning services in Accra, Ghana",
              "url": "https://willstherprofessionalservices.com",
              "logo": "https://willstherprofessionalservices.com/logo-v2.jpg",
              "image": "https://willstherprofessionalservices.com/logo-v2.jpg",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Accra",
                "addressCountry": "GH"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "0208267704",
                "contactType": "customer service"
              },
              "serviceArea": {
                "@type": "City",
                "name": "Accra"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Maintenance Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Industrial Maintenance"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Commercial Cleaning"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Household Maintenance"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <NextTopLoader
          color="#36669e"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #36669e,0 0 5px #36669e"
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <SiteProvider>
              <ShopProvider>
                <CartDrawer />
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: { fontSize: '14px' },
                    duration: 4000,
                  }}
                />
              </ShopProvider>
            </SiteProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
