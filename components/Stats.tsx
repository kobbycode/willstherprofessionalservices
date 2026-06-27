'use client'

import { motion } from 'framer-motion'
import { Users, Building, Star, TrendingUp, LucideIcon as LucideIconType, ArrowRight } from 'lucide-react'
import { useSiteConfig } from '@/lib/site-config'
import Link from 'next/link'

import { useEffect, useState, useRef } from 'react'

const iconMap: Record<string, typeof Building> = {
  Users,
  Building,
  Star,
  TrendingUp
}

const Counter = ({ value, duration = 2000 }: { value: string, duration?: number }) => {
  const [count, setCount] = useState(0)
  const target = parseInt(value.replace(/[^0-9]/g, ''))
  const suffix = value.replace(/[0-9]/g, '')
  const countRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (Number.isNaN(target)) return
    if (!isVisible) return

    let start = 0
    const end = target
    if (start === end) return

    let totalMiliseconds = duration
    let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10
    
    let timer = setInterval(() => {
      start += Math.ceil(target / (duration / incrementTime))
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [isVisible, target, duration])

  if (Number.isNaN(target)) return <span>{value}</span>

  return <span ref={countRef}>{count}{suffix}</span>
}

const Stats = () => {
  const { config } = useSiteConfig()
  const stats = config.stats && typeof config.stats === 'object' && !Array.isArray(config.stats)
    ? config.stats
    : { title: '', subtitle: '', items: [] }
  const title = stats.title || 'Our Services in Numbers'
  const subtitle = stats.subtitle || 'Delivering exceptional results through dedicated expertise and proven track record'
  const items = Array.isArray(stats.items) ? stats.items : []

  return (
    <section id="stats" className="bg-[#F8FAFC] py-16 md:py-24">
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
            OUR IMPACT
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-[#64748B] text-sm max-w-xl leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((stat, index) => {
            const Icon = iconMap[stat.icon] || Building
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white shadow-sm p-6 flex flex-col items-start"
              >
                <div className="w-10 h-10 bg-[#2563EB]/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-1">
                  <Counter value={stat.number} />
                </div>
                <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-[0.15em]">
                  {stat.label}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20"
        >
          <div className="bg-white shadow-sm p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight mb-4">
              Ready to Experience <span className="text-[#2563EB]">Premium</span> Service?
            </h3>
            <p className="text-[#64748B] text-sm max-w-xl mx-auto leading-relaxed mb-8">
              Join our premium clientele and witness the transformation of your property with our bespoke professional solutions.
            </p>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold text-sm transition-all duration-300"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Stats
