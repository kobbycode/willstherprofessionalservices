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
      <section className="section-padding bg-white" id="gallery">
        <div className="container-custom px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 opacity-30">Gallery</h2>
            <div className="w-20 h-1 bg-primary-200 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="section-padding bg-white" id="gallery">
        <div className="container-custom px-4 text-center">
            <div className="py-20 text-secondary-400 font-medium">
                No images available in the gallery yet. Stay tuned!
            </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding relative overflow-hidden bg-transparent" id="gallery">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100 dark:bg-primary-900/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="container-custom px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 dark:text-primary-400 font-bold tracking-[0.4em] uppercase text-[11px] sm:text-[12px] mb-3 block">
            Portfolio
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-outfit tracking-tight uppercase">
            Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 italic">Excellence</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-blue-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((g, i) => (
            <motion.div
              key={g.id || i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative h-[400px] overflow-hidden rounded-[2.5rem] bg-slate-200 dark:bg-slate-800 shadow-2xl hover:shadow-primary-500/20 transition-all duration-500"
            >
              {g.imageUrl ? (
                <>
                  <Image
                    src={g.imageUrl}
                    alt={g.caption || 'Gallery image'}
                    fill
                    priority={i < 3}
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                    {g.caption && (
                      <div className="glass-card p-4 rounded-[1.5rem] backdrop-blur-xl">
                        <p className="text-white text-[12px] sm:text-[13px] font-bold font-outfit uppercase tracking-widest leading-tight mb-2">
                          {g.caption}
                        </p>
                        <div className="w-6 h-0.5 bg-primary-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium italic">
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


