'use client'

import { motion } from 'framer-motion'
import { Wrench, Target, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Skeleton from './Skeleton'
import { useMemo, useState, useEffect, useRef } from 'react'
import { getDb } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore'

const Services = () => {
  const [services, setServices] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return

    const db = getDb()

    const categoriesQuery = query(collection(db, 'categories'), orderBy('createdAt', 'desc'), limit(50))
    const unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          title: data.name || data.title,
          subtitle: data.subtitle || '',
          imageUrl: data.imageUrl
        }
      })
      setCategories(categoriesData)
    })

    const servicesQuery = query(collection(db, 'services'), orderBy('createdAt', 'desc'), limit(50))
    const unsubscribeServices = onSnapshot(servicesQuery, (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setServices(servicesData)
      setLoading(false)
    })

    return () => {
      unsubscribeCategories()
      unsubscribeServices()
    }
  }, [visible])

  const categorizedServices = useMemo(() => {
    const grouped: Record<string, any[]> = {}
    const categoryMap = new Map<string, string>()

    categories.forEach(cat => {
      const title = cat.title || cat.name || ''
      if (title) {
        grouped[title] = []
        categoryMap.set(title.toLowerCase(), title)
      }
    })

    if (services && services.length > 0) {
      services.forEach((svc) => {
        const rawCat = svc.category || 'General'
        const lowerCat = rawCat.toLowerCase()
        const targetCat = categoryMap.get(lowerCat) || rawCat
        if (!grouped[targetCat]) grouped[targetCat] = []
        grouped[targetCat].push({
          ...svc,
          image: svc.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=400&h=300&fit=crop&crop=center'
        })
      })
    }
    return grouped
  }, [services, categories])

  return (
    <section ref={sectionRef} id="services" className="bg-[#F8FAFC] py-16 md:py-24">
      {loading ? (
        <div className="container-custom">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="w-24 h-1 mx-auto" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-12 md:mb-16">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="space-y-16">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-8">
                <Skeleton className="h-12 w-64 mx-auto" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="bg-white p-4 space-y-4 shadow-sm">
                      <Skeleton className="aspect-video w-full" />
                      <Skeleton className="h-6 w-3/4 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
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
              OUR EXPERTISE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight">
              Solutions Tailored <br />For Perfection
            </h2>
          </motion.div>

          {Object.keys(categorizedServices).length > 0 ? (
            <div className="space-y-16">
              {Object.entries(categorizedServices)
                .sort(([nameA], [nameB]) => {
                  const priorityOrder = ['Cleaning Services', 'Maintenance', 'Laundry Service', 'Pest Control']
                  let indexA = priorityOrder.findIndex(p => nameA.toLowerCase() === p.toLowerCase())
                  let indexB = priorityOrder.findIndex(p => nameB.toLowerCase() === p.toLowerCase())
                  return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
                })
                .map(([categoryName, categoryServices], categoryIndex) => {
                  const categoryObj = categories.find(cat => (cat.title || cat.name) === categoryName) || {}

                  return (
                    <div key={categoryName}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-6"
                      >
                        <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">{categoryName}</h3>
                        {categoryObj.subtitle && (
                          <p className="text-[#64748B] text-sm mt-1">{categoryObj.subtitle}</p>
                        )}
                      </motion.div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {categoryServices.map((service, serviceIndex) => (
                          <motion.div
                            key={service.id || serviceIndex}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: serviceIndex * 0.05 }}
                          >
                            <Link href={`/services/${service.id}`} className="group block bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                              <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                  src={service.image}
                                  alt={service.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              </div>
                              <div className="p-4">
                                <h4 className="font-bold text-[#0F172A] text-sm">{service.title}</h4>
                                <div className="mt-2 flex items-center gap-1 text-[#2563EB] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                  View Details
                                  <ArrowRight className="w-3 h-3" />
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white shadow-sm">
              <div className="w-14 h-14 bg-[#2563EB]/10 flex items-center justify-center mx-auto mb-5">
                <Wrench className="w-7 h-7 text-[#2563EB]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Services Coming Soon</h3>
              <p className="text-[#64748B] text-sm max-w-md mx-auto">
                We are currently curating the best professional solutions for you. Stay tuned.
              </p>
            </div>
          )}

          {/* CTA SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-20"
          >
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center bg-white shadow-sm p-8 md:p-12">
              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight mb-4">
                  Need a Custom<br />
                  <span className="text-[#2563EB]">Service Plan?</span>
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed mb-8 max-w-md">
                  Whether it's industrial maintenance or premium commercial cleaning, we tailor our expertise to match your vision of excellence.
                </p>
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold text-sm transition-all duration-300"
                >
                  Start a Conversation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white border border-[#E2E8F0] p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-[#2563EB] flex items-center justify-center shadow-sm">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A] text-sm">Elite Standards</p>
                      <p className="text-[#64748B] text-xs">Beyond expectations. Always.</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-[#F1F5F9]">
                      <div className="h-full w-[95%] bg-[#2563EB]" />
                    </div>
                    <div className="h-2 w-3/4 bg-[#F1F5F9]">
                      <div className="h-full w-[90%] bg-[#2563EB]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}

export default Services
