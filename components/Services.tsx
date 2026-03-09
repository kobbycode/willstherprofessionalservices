'use client'

import { motion } from 'framer-motion'
import {
  Home, Building, Users, Wrench,
  Sparkles, Shield, Clock, Star,
  Car, Truck, Zap, Target
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
      const iconPool = [Home, Building, Users, Wrench, Sparkles, Shield, Clock, Star, Car, Truck, Zap, Target]

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
      'Cleaning': Sparkles,
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
      <section id="services" className="section-padding bg-secondary-50">
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
    <section id="services" className="section-padding bg-secondary-50">
      <div className="container-custom px-4">
        {/* What We Offer heading - always show */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            What We Offer
          </h2>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-primary-500 mx-auto"></div>
        </div>

        {/* Services by Category Section */}
        {Object.keys(categorizedServices).length > 0 ? (
          <div className="space-y-16 sm:space-y-20 md:space-y-24">
            {Object.entries(categorizedServices)
              .sort(([nameA], [nameB]) => {
                const priorityOrder = [
                  'Cleaning Services',
                  'Maintenance',
                  'Laundry Service',
                  'Pest Control'
                ];
                let indexA = priorityOrder.findIndex(p => nameA.toLowerCase() === p.toLowerCase());
                let indexB = priorityOrder.findIndex(p => nameB.toLowerCase() === p.toLowerCase());

                if (indexA === -1) indexA = 999;
                if (indexB === -1) indexB = 999;

                return indexA - indexB;
              })
              .map(([categoryName, categoryServices], categoryIndex) => {
                const categoryObj = categories.find(cat => (cat.title || cat.name) === categoryName) || {};

                return (
                  <motion.div
                    key={categoryName}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className={`inline-block px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-none mb-4 sm:mb-6 md:mb-8 ${categoryIndex === 0 ? 'bg-blue-100' :
                      categoryIndex === 1 ? 'bg-green-100' :
                        categoryIndex === 2 ? 'bg-purple-100' :
                          'bg-orange-100'
                      }`}>
                      <h3 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center ${categoryIndex === 0 ? 'text-blue-700' :
                        categoryIndex === 1 ? 'text-green-700' :
                          categoryIndex === 2 ? 'text-purple-700' :
                            'text-orange-700'
                        }`}>
                        {categoryName}
                      </h3>
                    </div>

                    {categoryObj.subtitle && (
                      <p className="text-secondary-600 mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base max-w-2xl mx-auto">
                        {categoryObj.subtitle}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                      {categoryServices.map((service, serviceIndex) => (
                        <Link
                          key={service.id || serviceIndex}
                          href={`/services/${service.id}`}
                          className="block h-full"
                        >
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: serviceIndex * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-lg sm:rounded-xl shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100 group overflow-hidden flex flex-col h-full cursor-pointer"
                          >
                            <div className="relative aspect-video w-full overflow-hidden">
                              <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="absolute top-3 right-3 w-8 h-8 sm:w-10 sm:h-10 bg-accent-500 rounded-full flex items-center justify-center shadow-lg z-10 transform group-hover:scale-110 transition-transform duration-300 border border-white/20">
                                <service.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                            </div>
                            <div className="p-4 sm:p-5 flex-grow flex flex-col items-center justify-center bg-white relative">
                              <h4 className="text-sm sm:text-base md:text-lg font-bold text-secondary-900 text-center group-hover:text-primary-600 transition-colors leading-tight">
                                {service.title}
                              </h4>
                              <div className="mt-2 w-0 h-0.5 bg-accent-500 group-hover:w-12 transition-all duration-300 mx-auto"></div>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
              <Wrench className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Available</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're working on adding new services. Please check back later.
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12 md:mt-16"
        >
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-100">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary-900 mb-2 sm:mb-3 md:mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-secondary-600 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base">
              We offer tailored maintenance and cleaning solutions to meet your specific requirements.
            </p>
            <a href="#contact" className="btn-primary text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3">
              Get a Quote
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services