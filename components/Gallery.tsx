'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useSiteConfig } from '@/lib/site-config'
import Skeleton from '@/components/Skeleton'

const Gallery = () => {
  const { config, isLoaded } = useSiteConfig()
  const items = (Array.isArray(config.gallery) ? config.gallery : [])
    .filter(g => g.imageUrl && g.imageUrl.trim() !== '')

  if (!isLoaded && items.length === 0) {
    return (
      <section className="bg-[#F8FAFC] py-16 md:py-24" id="gallery">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-4">Gallery</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="bg-[#F8FAFC] py-16 md:py-24" id="gallery">
        <div className="container-custom text-center">
          <div className="py-20 text-[#64748B] font-medium text-sm">
            No images available in the gallery yet. Stay tuned!
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="bg-[#F8FAFC] py-16 md:py-24">
      <div className="container-custom">
        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <span className="text-[#2563EB] font-semibold tracking-[0.2em] text-xs mb-3 block">
            PORTFOLIO
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">
            Visual Excellence
          </h2>
          <p className="text-[#64748B] text-sm max-w-xl leading-relaxed">
            A glimpse into our work and the quality we deliver.
          </p>
        </motion.div>

        {/* GALLERY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((g, i) => (
            <motion.div
              key={g.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group relative h-72 overflow-hidden bg-[#F1F5F9] shadow-sm hover:shadow-md transition-all duration-300"
            >
              {g.imageUrl ? (
                <>
                  <Image
                    src={g.imageUrl}
                    alt={g.caption || 'Gallery image'}
                    fill
                    priority={i < 3}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {g.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <p className="text-white text-xs font-bold uppercase tracking-wider">{g.caption}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#94A3B8] text-sm italic">
                  Image coming soon
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
