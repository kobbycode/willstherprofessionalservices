'use client'

import { motion } from 'framer-motion'
import {
  Home, Building, Users, Wrench,
  Sparkles, Shield, Clock, Star,
  Car, Truck, Zap, Target
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'

const Services = () => {
  const [services, setServices] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load services and categories from API
  useEffect(() => {
    console.log('Services component: Loading services and categories...')

    const loadData = async () => {
      try {
        // Load categories
        const categoriesRes = await fetch('/api/service-categories')
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData.categories || [])
        }

        // Load services
        const servicesRes = await fetch('/api/services', { cache: 'no-store' })
        if (!servicesRes.ok) throw new Error('Failed to fetch services')
        const servicesData = await servicesRes.json()
        console.log('Services loaded:', servicesData.services?.length || 0, 'services')
        setServices(servicesData.services || [])
        setLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Group services by category
  const categorizedServices = useMemo(() => {
    if (services && services.length > 0) {
      const grouped: Record<string, any[]> = {}

      // Initialize with empty arrays for all categories
      const categoryNames = categories.map(cat => cat.title);
      categoryNames.forEach(catName => {
        grouped[catName] = [];
      });

      // Add services to their respective categories
      const iconPool = [Home, Building, Users, Wrench, Sparkles, Shield, Clock, Star, Car, Truck, Zap, Target]
      services.forEach((svc, idx) => {
        const cat = svc.category || 'General'
        if (!grouped[cat]) grouped[cat] = []
        grouped[cat].push({
          ...svc,
          icon: iconPool[idx % iconPool.length],
          image: svc.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=400&h=300&fit=crop&crop=center'
        })
      })

      return grouped
    }
    return {}
  }, [services, categories])

  // Extract unique service categories from services
  const serviceCategoriesFromServices = useMemo(() => {
    if (services && services.length > 0) {
      const uniqueCategories = Array.from(new Set(services.map(service => service.category || 'General')))
      return uniqueCategories
    }
    return []
  }, [services])

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

    // Default to Wrench if no match
    const categoryKey = Object.keys(iconMap).find(key =>
      category.toLowerCase().includes(key.toLowerCase())
    )

    return categoryKey ? iconMap[categoryKey] : Wrench
  }

  if (loading) {
    return (
      <section id="services" className="section-padding bg-secondary-50">
        <div className="container-custom px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
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

        {/* Service Categories from Services - Display under What We Offer */}
        {serviceCategoriesFromServices.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-12 md:mb-16">
            {serviceCategoriesFromServices.map((category, index) => {
              const IconComponent = getCategoryIcon(category);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                >
                  <div className="p-5 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-all duration-300">
                      <div className="w-6 h-6 text-white">
                        <IconComponent />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-secondary-800 group-hover:text-primary-600 transition-colors duration-300 px-2">
                      {category}
                    </h3>
                    <div className="mt-3 w-8 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Categories Section - Appears first */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-16"
          >
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <div className="inline-block bg-primary-100 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-none mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-700 text-center">
                  Our Service Categories
                </h2>
              </div>
              <div className="w-16 sm:w-20 md:w-24 h-1 bg-primary-500 mx-auto mb-4 sm:mb-6 md:mb-8"></div>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-secondary-600 max-w-3xl mx-auto px-2">
                Explore our comprehensive range of professional services organized by category
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {categories.map((category: any, index: number) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img
                      src={category.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=600&h=400&fit=crop&crop=center'}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=600&h=400&fit=crop&crop=center'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 text-sm md:text-base">{category.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Services by Category Section */}
        {Object.keys(categorizedServices).length > 0 ? (
          <div className="space-y-16 sm:space-y-20 md:space-y-24">
            {Object.entries(categorizedServices).map(([categoryName, categoryServices], categoryIndex) => {
              // Find the category object to get subtitle and image
              const categoryObj = categories.find(cat => cat.title === categoryName) || {};

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
                          className="bg-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group overflow-hidden flex flex-col h-full cursor-pointer"
                        >
                          <div className="relative flex-1">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-full h-full min-h-[180px] sm:min-h-[200px] md:min-h-[240px] lg:min-h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=400&h=300&fit=crop&crop=center'
                              }}
                            />
                            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                              <service.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                            </div>
                          </div>
                          <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col justify-center">
                            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-secondary-900 text-center mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors">
                              {service.title}
                            </h4>
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