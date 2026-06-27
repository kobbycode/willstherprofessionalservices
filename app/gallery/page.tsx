'use client'

import React from 'react'
import Gallery from '@/components/Gallery'
import { motion } from 'framer-motion'
import { useSiteConfig } from '@/lib/site-config'

export default function GalleryPage() {
    const { config } = useSiteConfig()

    return (
        <main className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px]">

            <div className="py-8 md:py-12">
                <div className="container-custom px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="text-[#2563EB] font-semibold tracking-[0.2em] text-xs mb-2 block">
                            OUR GALLERY
                        </span>
                        <h1 className="text-xl md:text-3xl font-bold text-[#0F172A] mb-3 tracking-tight">
                            Visual <span className="text-[#2563EB]">Showcase</span>
                        </h1>
                        <p className="text-[#64748B] text-sm max-w-xl leading-relaxed mb-6">
                            {config.siteDescription || 'Visual representation of our professional cleaning and maintenance services across Ghana.'}
                        </p>
                    </motion.div>

                    <Gallery />
                </div>
            </div>

        </main>
    )
}
