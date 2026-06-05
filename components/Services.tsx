'use client'

import { motion } from 'framer-motion'
import { Wrench, Target, ShieldCheck } from 'lucide-react'
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

  // Only subscribe to Firestore when the section becomes visible
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

  // Group services by category
  const categorizedServices = useMemo(() => {
    const grouped: Record<string, any[]> = {}

    // 1. Initialize with specific categories from the Admin 'categories' collection
    const categoryMap = new Map<string, string>(); // lowercase -> original case

    categories.forEach(cat => {
      const title = cat.title || cat.name || '';
      if (title) {
        grouped[title] = [];
        categoryMap.set(title.toLowerCase(), title);
      }
    });

    if (services && services.length > 0) {
      services.forEach((svc) => {
        const rawCat = svc.category || 'General';
        const lowerCat = rawCat.toLowerCase();

        let targetCat = categoryMap.get(lowerCat);

        if (!targetCat) {
          targetCat = rawCat;
        }

        if (!grouped[targetCat as string]) {
          grouped[targetCat as string] = [];
        }

        grouped[targetCat as string].push({
          ...svc,
          image: svc.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=400&h=300&fit=crop&crop=center'
        })
      })
    }

    return grouped
  }, [services, categories])

  return (
    <section ref={sectionRef} id="services" className="section-padding relative overflow-hidden bg-white">
      {loading ? (
        <>
          <div className="container-custom">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <Skeleton className="h-10 w-48 mx-auto mb-4" />
              <Skeleton className="w-24 h-1 mx-auto" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-12 md:mb-16">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>

            <div className="space-y-16">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-8">
                  <Skeleton className="h-12 w-64 mx-auto" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="bg-white rounded-xl p-4 space-y-4 shadow-sm">
                        <Skeleton className="aspect-video w-full" />
                        <Skeleton className="h-6 w-3/4 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          </div>
        </>
      ) : (
        <>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4" />

          <div className="container-custom relative z-10">
            <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-primary-600 font-bold tracking-[0.4em] uppercase text-xs sm:text-[11px] mb-3 block">
              Our Expertise
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-4 font-outfit tracking-tight uppercase">
              Solutions Tailored <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 italic">For Perfection</span>
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-blue-400 mx-auto rounded-full" />
          </motion.div>
        </div>

        {Object.keys(categorizedServices).length > 0 ? (
          <div className="space-y-20">
            {Object.entries(categorizedServices)
              .sort(([nameA], [nameB]) => {
                const priorityOrder = ['Cleaning Services', 'Maintenance', 'Laundry Service', 'Pest Control'];
                let indexA = priorityOrder.findIndex(p => nameA.toLowerCase() === p.toLowerCase());
                let indexB = priorityOrder.findIndex(p => nameB.toLowerCase() === p.toLowerCase());
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
              })
              .map(([categoryName, categoryServices], categoryIndex) => {
                const categoryObj = categories.find(cat => (cat.title || cat.name) === categoryName) || {};

                return (
                  <div key={categoryName} className="relative">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-6 mb-8"
                    >
                      <div className="h-px flex-grow bg-gradient-to-r from-transparent via-secondary-100 to-transparent lg:to-secondary-100"></div>
                      <h3 className="text-xl md:text-2xl font-bold font-outfit uppercase tracking-[0.2em] text-secondary-900 flex-shrink-0">
                        {categoryName}
                      </h3>
                      <div className="h-px flex-grow bg-gradient-to-l from-transparent via-secondary-100 to-transparent"></div>
                    </motion.div>

                    {categoryObj.subtitle && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-secondary-500 mb-8 md:mb-12 text-center max-w-2xl mx-auto font-medium"
                      >
                        {categoryObj.subtitle}
                      </motion.p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                      {categoryServices.map((service, serviceIndex) => (
                        <motion.div
                          key={service.id || serviceIndex}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: serviceIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Link href={`/services/${service.id}`} className="group block">
                            <div className="bg-white border border-secondary-100 rounded-2xl md:rounded-[2.5rem] p-2 transition-all duration-700 hover:-translate-y-4 hover:shadow-2xl hover:shadow-secondary-200 relative overflow-hidden backdrop-blur-3xl">
                              <div className="aspect-[4/5] relative rounded-2xl md:rounded-[2rem] overflow-hidden">
                                <Image
                                  src={service.image}
                                  alt={service.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>

                                <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                  <h4 className="text-base md:text-xl font-black text-white font-outfit uppercase tracking-wider mb-2 text-shadow">
                                    {service.title}
                                  </h4>
                                  <div className="w-12 h-1 bg-primary-500 mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </div>
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
          <div className="text-center py-20 bg-white border border-secondary-100 rounded-2xl md:rounded-[3rem] shadow-xl">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wrench className="w-8 h-8 md:w-10 md:h-10 text-primary-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-secondary-900 mb-2 font-outfit uppercase tracking-tight">Services Coming Soon</h3>
            <p className="text-secondary-500 font-medium max-w-md mx-auto">
              We are currently curating the best professional solutions for you. Stay tuned.
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-32"
        >
          <div className="bg-white border border-secondary-100 rounded-2xl md:rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-3xl shadow-secondary-200/20">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600/5 blur-[100px] rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/5 blur-[80px] rounded-full -ml-32 -mb-32" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-4xl md:text-6xl font-black text-secondary-900 mb-4 md:mb-6 font-outfit tracking-tighter leading-tight">
                  Need a Custom <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">Service Plan?</span>
                </h3>
                <p className="text-secondary-600 text-sm md:text-lg md:text-xl font-medium leading-relaxed mb-6 md:mb-10 max-w-xl">
                  Whether it's industrial maintenance or premium commercial cleaning, we tailor our expertise to match your vision of excellence.
                </p>
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center px-6 py-3 md:px-12 md:py-5 bg-primary-600 hover:bg-primary-700 text-white font-black font-outfit rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-2xl shadow-primary-500/30 gap-4 uppercase tracking-wider text-xs md:text-sm"
                >
                  Start a Conversation
                  <Target size={20} />
                </Link>
              </div>
              <div className="hidden lg:block relative">
                <div className="absolute inset-0 bg-primary-600/10 blur-3xl rounded-full" />
                <div className="relative bg-white border border-secondary-100 rounded-2xl md:rounded-[3rem] p-5 md:p-8 rotate-3 shadow-xl">
                  <div className="flex items-center gap-4 mb-4 md:gap-6 md:mb-6">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-primary-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl">
                      <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-secondary-900 font-black text-base md:text-xl font-outfit uppercase">Elite Standards</div>
                      <div className="text-secondary-500 text-xs md:text-sm font-medium">Beyond expectations. Always.</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-secondary-50 rounded-full overflow-hidden border border-secondary-100">
                      <div className="h-full w-[95%] bg-primary-600 rounded-full" />
                    </div>
                    <div className="h-2 w-3/4 bg-secondary-50 rounded-full overflow-hidden border border-secondary-100">
                      <div className="h-full w-[90%] bg-blue-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
          </div>
        </>
      )}
    </section>
  )
}

export default Services