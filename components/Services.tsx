'use client'

import { motion } from 'framer-motion'
import {
  Home, Building, Users, Wrench,
  Droplets, Shield, Clock, Star,
  Car, Truck, Zap, Target, Hammer, ShieldCheck
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Skeleton from './Skeleton'
import { useMemo, useState, useEffect } from 'react'
import { getDb } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'

const Services = () => {
  const [services, setServices] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load services and categories from Firestore Client SDK
  useEffect(() => {
    console.log('Services component: Subscribing to services and categories...')
    const db = getDb()

    // 1. Subscribe to Categories
    const categoriesQuery = query(collection(db, 'categories'), orderBy('createdAt', 'desc'))
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
      console.log('Categories synced:', categoriesData.length)
      setCategories(categoriesData)
    }, (error) => {
      console.error('Error syncing categories:', error)
    })

    // 2. Subscribe to Services
    const servicesQuery = query(collection(db, 'services'), orderBy('createdAt', 'desc'))
    const unsubscribeServices = onSnapshot(servicesQuery, (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log('Services synced:', servicesData.length)
      setServices(servicesData)
      setLoading(false)
    }, (error) => {
      console.error('Error syncing services:', error)
      setLoading(false)
    })

    return () => {
      unsubscribeCategories()
      unsubscribeServices()
    }
  }, [])

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
      const iconPool = [Home, Building, Users, Wrench, Hammer, Shield, Clock, Star, Car, Truck, Zap, Target]

      services.forEach((svc, idx) => {
        const rawCat = svc.category || 'General';
        const lowerCat = rawCat.toLowerCase();

        // Find matching category from Admin list (case-insensitive)
        let targetCat = categoryMap.get(lowerCat);

        // If not found in Admin list, use the service's own category
        if (!targetCat) {
          targetCat = rawCat;
        }

        if (!grouped[targetCat as string]) {
          grouped[targetCat as string] = [];
        }

        grouped[targetCat as string].push({
          ...svc,
          icon: iconPool[idx % iconPool.length],
          image: svc.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=400&h=300&fit=crop&crop=center'
        })
      })
    }

    return grouped
  }, [services, categories])

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Cleaning': Droplets,
      'Maintenance': Wrench,
      'Construction': Building,
      'Consulting': Users,
      'Security': Shield,
      'Transport': Car,
      'Electrical': Zap,
      'General': Target,
    }

    const categoryKey = Object.keys(iconMap).find(key =>
      category.toLowerCase().includes(key.toLowerCase())
    )

    return categoryKey ? iconMap[categoryKey] : Wrench
  }

  if (loading) {
    return (
      <section id="services" className="section-padding bg-white">
        <div className="container-custom px-4">
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
      </section>
    )
  }

  return (
    <section id="services" className="section-padding relative overflow-hidden bg-white">
      {/* Ambient background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4" />

      <div className="container-custom px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-primary-600 font-bold tracking-[0.4em] uppercase text-[11px] sm:text-[12px] mb-3 block">
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
                        className="text-secondary-500 mb-12 text-center max-w-2xl mx-auto font-medium"
                      >
                        {categoryObj.subtitle}
                      </motion.p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {categoryServices.map((service, serviceIndex) => (
                        <motion.div
                          key={service.id || serviceIndex}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: serviceIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Link href={`/services/${service.id}`} className="group block">
                            <div className="bg-white border border-secondary-100 rounded-[2.5rem] p-2 transition-all duration-700 hover:-translate-y-4 hover:shadow-2xl hover:shadow-secondary-200 relative overflow-hidden backdrop-blur-3xl">
                              <div className="aspect-[4/5] relative rounded-[2rem] overflow-hidden">
                                <Image
                                  src={service.image}
                                  alt={service.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>
                                
                                <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-xl z-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-lg">
                                  <service.icon className="w-6 h-6 text-primary-600" />
                                </div>

                                <div className="absolute bottom-8 left-8 right-8 text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                  <h4 className="text-xl font-black text-white font-outfit uppercase tracking-wider mb-2 text-shadow">
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
          <div className="text-center py-20 bg-white border border-secondary-100 rounded-[3rem] shadow-xl">
            <div className="w-20 h-20 bg-primary-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wrench className="w-10 h-10 text-primary-600" />
            </div>
            <h3 className="text-2xl font-black text-secondary-900 mb-2 font-outfit uppercase tracking-tight">Services Coming Soon</h3>
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
          className="mt-32"
        >
          <div className="bg-white border border-secondary-100 rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-3xl shadow-secondary-200/20">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600/5 blur-[100px] rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/5 blur-[80px] rounded-full -ml-32 -mb-32" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl md:text-6xl font-black text-secondary-900 mb-6 font-outfit tracking-tighter leading-tight">
                  Need a Custom <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">Service Plan?</span>
                </h3>
                <p className="text-secondary-600 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-xl">
                  Whether it's industrial maintenance or premium commercial cleaning, we tailor our expertise to match your vision of excellence.
                </p>
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center px-12 py-5 bg-primary-600 hover:bg-primary-700 text-white font-black font-outfit rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-2xl shadow-primary-500/30 gap-4 uppercase tracking-wider text-sm"
                >
                  Start a Conversation
                  <Target size={20} />
                </Link>
              </div>
              <div className="hidden lg:block relative">
                <div className="absolute inset-0 bg-primary-600/10 blur-3xl rounded-full" />
                <div className="relative bg-white border border-secondary-100 rounded-[3rem] p-8 rotate-3 shadow-xl">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center shadow-xl">
                      <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-secondary-900 font-black text-xl font-outfit uppercase">Elite Standards</div>
                      <div className="text-secondary-500 text-sm font-medium">Beyond expectations. Always.</div>
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
    </section>
  )
}

export default Services