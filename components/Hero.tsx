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
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="100vw"
                      quality={90}
                      onError={(e) => {
                        // Note: next/image doesn't support onError in the same way as img, 
                        // but the loading strategy is more robust.
                        // Fallback handling is managed by the data layer.
                        console.warn(`Image might have issues: ${slide.image}`)
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-900/60 to-transparent"></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
                      <div className="max-w-4xl mx-auto">
                        <motion.h1
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.8 }}
                          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6"
                        >
                          {slide.title}
                        </motion.h1>

                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.8 }}
                          className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-2xl mx-auto"
                        >
                          {slide.description}
                        </motion.p>

                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                          className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                          <Link
                            href={slide.ctaLink}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            {slide.ctaLabel}
                          </Link>

                          <Link
                            href="#services"
                            className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/30"
                          >
                            Our Services
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

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
})

Hero.displayName = 'Hero'
export default Hero