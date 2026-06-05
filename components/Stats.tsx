'use client'

import { motion } from 'framer-motion'
import { Users, Building, Star, TrendingUp, LucideIcon as LucideIconType } from 'lucide-react'
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
    <section className="section-padding relative overflow-hidden bg-white" id="stats">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_70%)]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-primary-600 font-bold tracking-[0.4em] uppercase text-xs sm:text-[11px] mb-3 block">
            Our Impact
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-3 md:mb-4 font-outfit tracking-tight uppercase"
          >
            {title}
          </motion.h2>
          <div className="w-8 md:w-12 h-1 bg-gradient-to-r from-primary-500 to-blue-400 mx-auto mb-4 md:mb-6 rounded-full"></div>
          <p className="text-sm md:text-lg text-secondary-600 max-w-2xl mx-auto font-medium leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {items.map((stat, index) => {
            const Icon = iconMap[stat.icon] || Building
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-5 rounded-2xl md:rounded-[2.5rem] bg-white border border-secondary-100 relative group transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
              >
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full group-hover:bg-primary-500/10 transition-colors"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors"></div>

                <div className="relative mb-6 md:mb-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 border border-secondary-100 shadow-sm">
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary-600" />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-1 font-outfit">
                    <Counter value={stat.number} />
                  </div>
                  <p className="text-xs sm:text-[12px] font-bold text-primary-600 uppercase tracking-[0.3em] break-words leading-tight">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16 md:mt-32"
        >
          <div className="bg-white border border-secondary-100 rounded-2xl md:rounded-[3rem] p-6 md:p-12 lg:p-16 relative overflow-hidden group max-w-5xl mx-auto shadow-xl shadow-secondary-200/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 via-transparent to-blue-600/5 transition-opacity group-hover:opacity-80"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 md:mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600/10 border border-primary-600/20 text-primary-600 text-xs font-bold tracking-widest uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                Start Your Project
              </div>

              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black mb-4 md:mb-6 text-secondary-900 font-outfit tracking-tight max-w-2xl leading-[1.1]">
                Ready to Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 italic">Premium</span> Service?
              </h3>
              
              <p className="text-secondary-600 mb-6 md:mb-10 text-sm md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Join our premium clientele and witness the transformation of your property with our bespoke professional solutions.
              </p>
              
                <Link
                  href="#contact"
                  className="group relative inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-black py-3 md:py-5 px-6 md:px-12 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-primary-600/20 gap-3 md:gap-4 overflow-hidden"
              >
                <span className="relative z-10 text-sm md:text-base font-outfit uppercase tracking-wider">Get Started Now</span>
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Stats
