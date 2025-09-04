import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/auth-context'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  metadataBase: new URL('https://willstherprofessionalservices.com'),
  title: {
    default: 'Willsther Professional Services - Industrial, Commercial & Household Maintenance',
    template: '%s | Willsther Professional Services'
  },
  description: 'Fast growing industrial, commercial and household maintenance services provider in Accra, Ghana. We offer maintenance, refurbishment, servicing, fumigation, alterations and cleaning services.',
  keywords: [
    'maintenance services Ghana',
    'cleaning services Accra',
    'electrical installation',
    'AC servicing',
    'plumbing services',
    'carpentry services',
    'fumigation services',
    'industrial maintenance',
    'commercial cleaning',
    'household maintenance',
    'professional services Ghana'
  ].join(', '),
  authors: [{ name: 'Willsther Professional Services' }],
  creator: 'Willsther Professional Services',
  publisher: 'Willsther Professional Services',
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
    title: 'Willsther Professional Services',
    description: 'Professional maintenance and cleaning services in Accra, Ghana. Industrial, commercial and household maintenance solutions.',
    url: 'https://willstherprofessionalservices.com',
    siteName: 'Willsther Professional Services',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo-v2.jpg',
        width: 1200,
        height: 630,
        alt: 'Willsther Professional Services Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Willsther Professional Services',
    description: 'Professional maintenance and cleaning services in Accra, Ghana',
    images: ['/logo-v2.jpg'],
  },
  alternates: {
    canonical: 'https://willstherprofessionalservices.com',
  },
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
                "telephone": "+233-594-850-005",
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
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right" 
            toastOptions={{ 
              style: { fontSize: '14px' },
              duration: 4000,
            }} 
          />
        </AuthProvider>
        {false && (
          <script
            dangerouslySetInnerHTML={{
              __html: `/* Service worker disabled */`,
            }}
          />
        )}
      </body>
    </html>
  )
}
