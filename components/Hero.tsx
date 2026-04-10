'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useSiteConfig } from '@/lib/site-config'
import { getFallbackImageUrl } from '@/lib/storage'

const Hero = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(false) // Start as false, only show loading if explicitly needed
  const { config, isLoaded, refresh } = useSiteConfig()

  const slides = useMemo(() => {
    // Always provide default slides even if config is not loaded
    const defaultSlides = [
      {
        id: 'default-slide-1',
        image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=1974&auto=format&fit=crop',
        title: 'Professional Cleaning',
        description: 'Trusted, reliable and affordable services',
        ctaLabel: 'Get Started Today',
        ctaLink: '#contact',
        fallbackImages: [
          'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=1200&h=600&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop&crop=center'
        ]
      },
      {
        id: 'default-slide-2',
        image: 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=1200&h=600&fit=crop&crop=center',
        title: 'Maintenance Services',
        description: 'Comprehensive maintenance solutions for all your needs',
        ctaLabel: 'Learn More',
        ctaLink: '#services',
        fallbackImages: [
          'https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=1974&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop&crop=center'
        ]
      }
    ]

    const configured = Array.isArray(config.heroSlides) ? config.heroSlides : []

    if (configured.length > 0) {
      // Sort slides by order (if available) to maintain admin-defined order
      const sortedSlides = [...configured].sort((a, b) => {
        const orderA = a.order ?? 0
        const orderB = b.order ?? 0
        return orderA - orderB
      })

      return sortedSlides.map((s) => ({
        id: s.id || `slide-${Date.now()}-${Math.random()}`, // Use Firebase document ID
        image: (s.imageUrl || '').trim() || getFallbackImageUrl(),
        title: s.title || 'Professional Maintenance Services',
        description: s.subtitle || 'Trusted, reliable and affordable services',
        ctaLabel: s.ctaLabel || 'Get Started Today',
        ctaLink: s.ctaHref || '#contact',
        // Add fallback images for better reliability
        fallbackImages: [
          'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=1200&h=600&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1200&h=600&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop&crop=center'
        ]
      }))
    }

    // Return default slides if no slides are configured or if there's an error
    return defaultSlides
  }, [config.heroSlides])

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  useEffect(() => {
    // Ensure current index is valid if slides change size
    if (currentSlide >= slides.length) {
      setCurrentSlide(0)
    }
  }, [slides.length, currentSlide])

  useEffect(() => {
    if (slides.length <= 1) return

    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide, slides.length])

  useEffect(() => {
    // Only show loading briefly, then hide to allow default content to show
    if (!isLoaded) {
      setIsLoading(true)
      // Hide loading after a short time to allow default content to show
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setIsLoading(false)
    }
  }, [isLoaded])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    if (newDirection > 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  }

  return (
    <section id="home" className="relative h-screen bg-secondary-950 overflow-hidden pt-14 sm:pt-16">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-[100]">
          <div className="w-20 h-20 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Hero Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative w-full h-full"
      >
        <div className="relative h-full w-full">
          <AnimatePresence initial={false} custom={currentSlide}>
            {slides.map((slide, index) => (
              index === currentSlide && (
                <motion.div
                  key={slide.id}
                  custom={currentSlide}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 200, damping: 30 },
                    opacity: { duration: 0.6 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x)
                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1)
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1)
                    }
                  }}
                  className="absolute inset-0"
                >
                  <div className="relative w-full h-full overflow-hidden">
                    {/* Background Image with Parallax-esque Scale */}
                    <motion.div 
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 10, ease: "linear" }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority={index === 0}
                        className="object-cover"
                        sizes="100vw"
                        quality={95}
                      />
                    </motion.div>
                    
                    {/* Dark Premium Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Ambient Light */}
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full"></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center px-4 md:px-12 lg:px-24">
                      <div className="max-w-5xl">
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          className="flex items-center gap-4 mb-3"
                        >
                          <div className="w-6 h-[1px] bg-primary-400"></div>
                          <span className="text-white font-bold tracking-[0.5em] uppercase text-[9px] sm:text-[10px]">
                            Premier Property Solutions
                          </span>
                        </motion.div>
                        
                        <motion.h1
                          initial={{ y: 40, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-4 leading-tight tracking-[0.15em] font-outfit text-secondary-900 uppercase italic"
                        >
                          {slide.title.split(' ').map((word, i) => (
                            <span key={i} className={i === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200 inline-block' : 'inline-block mr-2 text-white'}>
                              {word}
                            </span>
                          ))}
                        </motion.h1>

                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.8 }}
                          className="text-[10px] sm:text-[11px] lg:text-xs mb-8 max-w-sm text-white/70 font-normal leading-relaxed text-balance tracking-widest uppercase"
                        >
                          {slide.description}
                        </motion.p>

                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.9, duration: 0.8 }}
                          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                        >
                          <Link
                            href={slide.ctaLink}
                            className="group relative px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg transition-all duration-500 hover:bg-primary-700 shadow-lg hover:shadow-primary-500/20 text-[11px] uppercase tracking-[0.2em] font-outfit overflow-hidden"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              {slide.ctaLabel}
                              <ChevronRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                          </Link>

                          <Link
                            href="#services"
                            className="px-6 py-2.5 text-white font-semibold rounded-lg transition-all duration-500 border border-white/20 hover:bg-white/10 text-[11px] uppercase tracking-[0.2em] font-outfit"
                          >
                            Our Portfolio
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        {slides.length > 1 && (
          <div className="absolute bottom-10 right-10 flex items-center gap-2 z-20">
            <button
              onClick={prevSlide}
              className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-white/70 border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300 group shadow-sm bg-black/20 backdrop-blur-md"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
            <button
              onClick={nextSlide}
              className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-white/70 border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300 group shadow-sm bg-black/20 backdrop-blur-md"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

        {/* Indicators */}
        <div className="absolute left-10 bottom-10 flex items-center gap-2.5 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 rounded-full transition-all duration-500 ${index === currentSlide ? 'w-10 bg-primary-500' : 'w-3 bg-secondary-200 hover:bg-secondary-300'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Hint */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-secondary-200 to-transparent"></div>
        </motion.div>
      </motion.div>
    </section>
  )
})

Hero.displayName = 'Hero'
export default Hero