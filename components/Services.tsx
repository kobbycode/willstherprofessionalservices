'use client'

import { motion } from 'framer-motion'
import { 
  Home, Building, Users, Wrench, 
  Sparkles, Shield, Clock, Star,
  Car, Truck, Zap, Target
} from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'

const Services = () => {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load services from API once
  useEffect(() => {
    console.log('Services component: Loading services...')
    
    const loadServices = async () => {
      try {
        const res = await fetch('/api/services', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch services')
        const data = await res.json()
        console.log('Services loaded:', data.services?.length || 0, 'services')
        setServices(data.services || [])
        setLoading(false)
      } catch (error) {
        console.error('Error loading services:', error)
        setLoading(false)
      }
    }
    
    // Initial load only
    loadServices()
    
    // Removed polling - no need to poll every 5 seconds
  }, [])

  const serviceCategories = useMemo(() => {
    if (services && services.length > 0) {
      const grouped: Record<string, { title: string; services: { name: string; description?: string; icon: any; image: string }[] }> = {}
      const iconPool = [Home, Building, Users, Wrench, Sparkles, Shield, Clock, Star, Car, Truck, Zap, Target]
      services.forEach((svc, idx) => {
        const cat = svc.category || 'General'
        if (!grouped[cat]) grouped[cat] = { title: cat, services: [] }
        grouped[cat].services.push({
          name: svc.title,
          description: svc.description, // Add description to the service object
          icon: iconPool[idx % iconPool.length],
          image: svc.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=400&h=300&fit=crop&crop=center'
        })
      })
      return Object.values(grouped)
    }
    return []
  }, [services])

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

  if (serviceCategories.length === 0) {
    return (
      <section id="services" className="section-padding bg-secondary-50">
        <div className="container-custom px-4">
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Services Available</h2>
            <p className="text-gray-600">Services will be added soon. Please check back later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="section-padding bg-secondary-50">
      <div className="container-custom px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <div className="inline-block bg-primary-100 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-none mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-700 text-center">
              What We Offer
            </h2>
          </div>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-primary-500 mx-auto mb-4 sm:mb-6 md:mb-8"></div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-secondary-600 max-w-3xl mx-auto px-2">
            Comprehensive maintenance, refurbishment, and cleaning services for industrial, commercial, and domestic properties.
          </p>
        </motion.div>

        <div className="space-y-8 sm:space-y-12 md:space-y-16">
          {serviceCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`inline-block px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-none mb-4 sm:mb-6 md:mb-8 ${
                categoryIndex === 0 ? 'bg-blue-100' : 
                categoryIndex === 1 ? 'bg-green-100' : 
                categoryIndex === 2 ? 'bg-purple-100' : 
                'bg-orange-100'
              }`}>
                <h3 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center ${
                  categoryIndex === 0 ? 'text-blue-700' : 
                  categoryIndex === 1 ? 'text-green-700' : 
                  categoryIndex === 2 ? 'text-purple-700' : 
                  'text-orange-700'
                }`}>
                  {category.title}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {category.services.map((service, serviceIndex) => (
                  <motion.div
                    key={serviceIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: serviceIndex * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group overflow-hidden flex flex-col h-full"
                  >
                    <div className="relative flex-1">
                      <img
                        src={service.image}
                        alt={service.name}
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
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold text-secondary-900 text-center mb-1 sm:mb-2">
                        {service.name}
                      </h4>
                      {/* Display service description if available */}
                      {service.description && (
                        <p className="text-xs sm:text-sm text-secondary-600 text-center line-clamp-2">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

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
