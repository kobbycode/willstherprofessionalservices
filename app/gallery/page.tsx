'use client'

import React from 'react'
import Gallery from '@/components/Gallery'
import { motion } from 'framer-motion'
import { useSiteConfig } from '@/lib/site-config'

export default function GalleryPage() {
    const { config } = useSiteConfig()

    return (
        <main className="min-h-screen bg-[#fafafa]">
            
            <div className="pt-32 pb-20">
                <div className="container-custom px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-3xl md:text-4xl font-semibold text-secondary-900 mb-4 tracking-tight">
                            Our <span className="text-primary-600 font-bold">Gallery</span>
                        </h1>
                        <p className="max-w-xl mx-auto text-secondary-500 font-medium text-base md:text-lg leading-relaxed">
                            {config.siteDescription || 'Visual representation of our professional cleaning and maintenance services across Ghana.'}
                        </p>
                        <div className="w-12 h-0.5 bg-primary-500 mx-auto mt-6 rounded-full" />
                    </motion.div>
                </div>

                <Gallery />
            </div>

        </main>
    )
}
