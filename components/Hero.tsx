'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Shield, Home, Building2, Brush, Settings, ChevronLeft, Droplets } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useSiteConfig } from '@/lib/site-config'
import { getFallbackImageUrl } from '@/lib/storage'

const serviceCategories = [
  { icon: Shield, title: 'EPA Certified Pest Controller', desc: 'Professional pest control for your peace of mind.' },
  { icon: Home, title: 'Residential Cleaning', desc: 'Homes, apartments and private spaces.' },
  { icon: Building2, title: 'Commercial Cleaning', desc: 'Offices, shops and commercial facilities.' },
  { icon: Brush, title: 'Deep Cleaning Services', desc: 'Thorough cleaning for a healthier environment.' },
  { icon: Droplets, title: 'Sofa/Carpet Cleaning', desc: 'Specialized fabric and upholstery care.' },
  { icon: Settings, title: 'Facility Support Services', desc: 'Maintenance and support you can rely on.' },
]

const Hero = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { config, isLoaded } = useSiteConfig()

  const slides = useMemo(() => {
    const configured = Array.isArray(config.heroSlides) ? config.heroSlides : []
    if (configured.length > 0) {
      return [...configured]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((s) => ({
          id: s.id || `slide-${Math.random()}`,
          image: (s.imageUrl || '').trim() || getFallbackImageUrl(),
          title: s.title || 'Professional Cleaning & Facility Support Services',
          subtitle: s.subtitle || 'Reliable, affordable and high-quality cleaning solutions for homes, offices and commercial spaces.',
          ctaLabel: s.ctaLabel || 'Get Free Quote',
          ctaHref: s.ctaHref || '#contact',
        }))
    }
    return [
      {
        id: 'default-1',
        image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=1974&auto=format&fit=crop',
        title: 'Professional Cleaning & Facility Support Services',
        subtitle: 'Reliable, affordable and high-quality cleaning solutions for homes, offices and commercial spaces.',
        ctaLabel: 'Get Free Quote',
        ctaHref: '#contact',
      },
    ]
  }, [config.heroSlides])

  const current = slides[currentSlide] ?? slides[0]

  const next = useCallback(() => setCurrentSlide((p) => (p + 1) % slides.length), [slides.length])
  const prev = useCallback(() => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next, slides.length])

  useEffect(() => {
    if (currentSlide >= slides.length) setCurrentSlide(0)
  }, [slides.length, currentSlide])

  const titleWords = current.title.split(' ')
  const lastWord = titleWords[titleWords.length - 1]
  const mainWords = titleWords.slice(0, -1).join(' ')

  return (
    <section id="home" className="relative bg-[#031633] pt-[56px] md:pt-[110px]">

      {/* ───────────────────────────────────────────── */}
      {/* MOBILE LAYOUT (< 768px) — image ABOVE text    */}
      {/* ───────────────────────────────────────────── */}
      <div className="lg:hidden relative">
        {/* Image Slider */}
        <div className="relative mx-4 pt-4">
          <div className="relative h-[320px] sm:h-[380px] overflow-hidden bg-[#0a1f3d]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id + '-mob-img'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                  quality={85}
                />
              </motion.div>
            </AnimatePresence>

            {/* Nav arrows */}
            {slides.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Pagination dots */}
            {slides.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-2 h-2 transition-all ${i === currentSlide ? 'bg-white w-6' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            )}

            {/* EPA Certified badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute bottom-4 right-4 z-20 bg-white shadow-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="font-bold text-red-600 text-[11px] leading-tight">EPA Certified</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-6 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-[2px] bg-[#2563EB]" />
              <span className="text-[#60A5FA] font-bold tracking-[0.2em] uppercase text-[10px]">
                Premier Property Solutions
              </span>
            </div>

            <h1 className="text-[40px] sm:text-[48px] font-black leading-[1.05] mb-3 tracking-tight text-white">
              Best Cleaning <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#60A5FA]">Services</span>
            </h1>

            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
              {current.subtitle}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col gap-3"
          >
            <Link
              href={current.ctaHref}
              className="w-full flex items-center justify-center gap-2 h-14 bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white font-bold text-sm uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-[#2563EB]/30 active:scale-[0.98]"
            >
              {current.ctaLabel}
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="#services"
              className="w-full flex items-center justify-center gap-2 h-14 border-2 border-white/20 text-white font-bold text-sm uppercase tracking-wider transition-all hover:bg-white/5 hover:border-white/40 active:scale-[0.98]"
            >
              Our Services
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ───────────────────────────────────────────── */}
      {/* DESKTOP LAYOUT (>= 768px) — split text/image  */}
      {/* ───────────────────────────────────────────── */}
      <div className="hidden lg:block">
        <div className="relative min-h-[75vh] flex">
          {/* LEFT: Content */}
          <div className="relative z-10 flex flex-col justify-center px-8 lg:px-12 xl:px-16 py-10 w-[52%] xl:w-[50%]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-6 h-[2px] bg-[#2563EB]" />
              <span className="text-[#60A5FA] font-bold tracking-[0.2em] uppercase text-[11px]">
                Premier Property Solutions
              </span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={current.id + '-dt-title'}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl xl:text-5xl font-black leading-[1.1] mb-4 tracking-tight"
              >
                <span className="text-white">{mainWords}&nbsp;</span>
                <br />
                <span className="text-[#60A5FA]">{lastWord}</span>
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={current.id + '-dt-sub'}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-white/70 text-base leading-relaxed mb-6 max-w-lg"
              >
                {current.subtitle}
              </motion.p>
            </AnimatePresence>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Link
                href={current.ctaHref}
                className="group flex items-center gap-2 px-6 py-3.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold shadow-lg shadow-[#2563EB]/30 transition-all duration-300 hover:-translate-y-0.5 text-xs uppercase tracking-wider"
              >
                {current.ctaLabel}
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#services"
                className="group flex items-center gap-2 px-6 py-3.5 border-2 border-white/30 text-white font-bold hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-xs uppercase tracking-wider"
              >
                Our Services
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: Image */}
          <div className="absolute right-0 top-0 bottom-0 w-[52%] xl:w-[54%] bg-[#031633]">
            <div className="absolute inset-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id + '-dt-img'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="55vw"
                    quality={95}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-24 right-6 z-20 bg-white shadow-2xl p-4 w-48"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <p className="font-black text-red-600 text-xs leading-tight">EPA Certified</p>
              </div>
            </motion.div>

            {slides.length > 1 && (
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-between pointer-events-none">
                <button onClick={prev} className="pointer-events-auto w-8 h-8 bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all shadow-lg">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={next} className="pointer-events-auto w-8 h-8 bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all shadow-lg">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────── */}
      {/* SERVICE CATEGORIES (shared mobile + desktop)  */}
      {/* ───────────────────────────────────────────── */}
      <div className="relative z-30 flex justify-center pointer-events-none">
        <div className="w-full px-4 pointer-events-auto max-w-7xl">
          <div className="bg-white shadow-2xl mt-6 md:-mt-4 lg:-mt-16">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {serviceCategories.map((cat, i) => (
                <div
                  key={cat.title}
                  className="group flex items-start gap-2.5 px-3 sm:px-4 py-3 sm:py-4 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-[#2563EB]/10 group-hover:bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <cat.icon className="w-3.5 h-3.5 text-[#2563EB]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0F172A] text-[11px] sm:text-xs leading-snug mb-0.5">{cat.title}</p>
                    <p className="text-[#64748B] text-[10px] sm:text-[11px] leading-snug line-clamp-2">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
})

Hero.displayName = 'Hero'
export default Hero
