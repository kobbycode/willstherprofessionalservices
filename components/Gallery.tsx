'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useSiteConfig } from '@/lib/site-config'

const Gallery = () => {
  const { config } = useSiteConfig()
  const items = Array.isArray(config.gallery) ? config.gallery : []

  if (items.length === 0) return null

  return (
    <section className="section-padding bg-white" id="gallery">
      <div className="container-custom px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">Gallery</h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((g, i) => (
            <motion.div
              key={g.id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl border border-white/10 shadow-premium hover:shadow-premium-hover transition-all duration-500 bg-white group"
            >
              {g.imageUrl ? (
                <div className="relative w-full h-64">
                  <Image
                    src={g.imageUrl}
                    alt={g.caption || 'Gallery image'}
                    fill
                    priority={i < 3}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">No image</div>
              )}
              {g.caption && (
                <div className="p-4 text-sm font-medium text-primary-900/80 bg-white border-t border-gray-50 italic">
                  "{g.caption}"
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


