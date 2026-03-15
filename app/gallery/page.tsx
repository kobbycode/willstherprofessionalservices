'use client'

import React from 'react'
import Header from '@/components/Header'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { useSiteConfig } from '@/lib/site-config'

export default function GalleryPage() {
    const { config } = useSiteConfig()

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="pt-32 pb-20">
                <div className="container-custom px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-black text-secondary-900 mb-6 uppercase tracking-tighter">
                            Our <span className="text-primary-600">Gallery</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-secondary-500 font-medium text-lg leading-relaxed">
                            {config.siteDescription || 'Visual representation of our professional cleaning and maintenance services across Ghana.'}
                        </p>
                        <div className="w-24 h-1.5 bg-primary-500 mx-auto mt-8 rounded-full" />
                    </motion.div>
                </div>

                <Gallery />
            </div>

            <Footer />
        </main>
    )
}
