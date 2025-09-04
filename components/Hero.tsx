'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
// Using native img to support any URL (including Firebase, data/blob URLs)
import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useSiteConfig } from '@/lib/site-config'
import { getFallbackImageUrl } from '@/lib/storage'

const Hero = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(false) // Start as false, only show loading if explicitly needed
  const { config, isLoaded, refresh } = useSiteConfig()

  const slides = useMemo(() => {
    const configured = Array.isArray(config.heroSlides) ? config.heroSlides : []

    if (configured.length > 0) {
      return configured.map((s, idx) => ({
        id: idx + 1,
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

    return [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=1974&auto=format&fit=crop',
        title: 'Professional Cleaning',
        description: 'Trusted, reliable and affordable services',
        ctaLabel: 'Get Started Today',
        ctaLink: '#contact',
        fallbackImages: [
          'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=1200&h=600&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop&crop=center'
        ]
      }
    ]
  }, [config.heroSlides])

  const nextSlide = useCallback(() => {
      if (slides.length === 0) return
      setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return
    setCurrentSlide((prev) => (prev + 1 + slides.length) % slides.length)
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
    // Only show loading if config is not loaded and we have no slides
    if (!isLoaded && (!config.heroSlides || config.heroSlides.length === 0)) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [isLoaded, config.heroSlides])

  // Remove the problematic effect that resets loading state
  // useEffect(() => {
  //   if (slides.length > 0) {
  //     setIsLoading(true)
  //   }
  // }, [slides.length])

  // Test all images when slides change
  useEffect(() => {
    if (isLoaded && slides.length > 0) {
      // Preload images and check accessibility
      slides.forEach((slide) => {
        if (slide.image) {
          const img = new window.Image()
          img.src = slide.image
          img.onload = () => {
            console.log(`Preloaded image: ${slide.image}`)
          }
          img.onerror = () => {
            console.warn(`Failed to preload image: ${slide.image}, will use fallback`)
            // If image fails to preload, it will use fallback when displayed
          }
        }
      })
    }
  }, [slides, isLoaded])

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
    <section id="home" className="relative min-h-screen bg-white overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Hero Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full"
      >
        {/* Carousel Container */}
        <div className="relative h-screen w-full">
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
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
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
                  <div className="relative w-full h-full">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={async (e) => {
                        console.warn(`Image failed to load: ${slide.image}`, e)
                        const target = e.currentTarget as HTMLImageElement
                        
                        // Try fallback images first for better reliability
                        const currentSrc = target.src
                        const fallbackIndex = slide.fallbackImages?.findIndex(fb => fb === currentSrc) ?? -1
                        const nextFallback = slide.fallbackImages?.[(fallbackIndex + 1) % (slide.fallbackImages?.length ?? 1)]
                        
                        if (nextFallback && !currentSrc.includes('fallback')) {
                          console.log(`Trying fallback image: ${nextFallback}`)
                          target.src = nextFallback
                        } else if (slide.fallbackImages?.[0]) {
                          console.log(`Using first fallback image: ${slide.fallbackImages[0]}`)
                          target.src = slide.fallbackImages[0]
                        } else {
                          // Use the reliable fallback
                          console.log(`Using reliable fallback image`)
                          target.src = getFallbackImageUrl()
                        }
                      }}
                      onLoad={() => {
                        console.log(`Image loaded successfully: ${slide.image}`)
                      }}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      crossOrigin="anonymous"
                    />
                    
                    {/* Enhanced Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40"></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
                      <div className="max-w-5xl">
                        <motion.h1 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.8 }}
                          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight"
                        >
                          {slide.title || 'Professional Maintenance Services'}
                        </motion.h1>
                        <motion.p 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.8 }}
                          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 mb-6 sm:mb-8 md:mb-12 px-2 sm:px-4 font-light"
                        >
                          {slide.description || 'Trusted, reliable and affordable services'}
                        </motion.p>
                        
                        {/* CTA Buttons */}
                        {slide.ctaLabel && (
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                          >
                            <Link
                              href={slide.ctaLink}
                              className="group bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                            >
                              {slide.ctaLabel}
                            </Link>
                            <Link
                              href="#contact"
                              className="group bg-white/20 hover:bg-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-lg sm:text-xl transition-all duration-300 backdrop-blur-sm border border-white/30"
                            >
                              Contact Us
                            </Link>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>

          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-110"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-110"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {slides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Contact Info - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-16 sm:bottom-4 left-4 sm:left-auto sm:right-8 z-20"
      >
        <div className="flex flex-col space-y-1 sm:space-y-2 text-white/90 text-xs sm:text-sm">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-medium">{config.contactPhone || '(233) 594 850 005'}</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-medium hidden sm:inline">{config.contactEmail || 'willstherprofessionalservices@gmail.com'}</span>
            <span className="font-medium sm:hidden">willstherprofessionalservices@gmail.com</span>
          </div>
        </div>
      </motion.div>

      {/* Floating Contact Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-40"
      >
        <a
          href="#contact"
          className="bg-primary-600 hover:bg-primary-700 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
          aria-label="Quick Contact"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
      </motion.div>

      {/* Debug/Refresh Button - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="fixed bottom-4 sm:bottom-8 left-4 sm:left-8 z-40"
        >
          <button
            onClick={refresh}
            className="bg-gray-600 hover:bg-gray-700 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
            aria-label="Refresh Configuration"
            title="Refresh configuration from database"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </motion.div>
      )}
    </section>
  )
})

Hero.displayName = 'Hero'

export default Hero






