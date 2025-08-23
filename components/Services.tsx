'use client'

import { motion } from 'framer-motion'
import { 
  Home, Building, Users, Wrench, 
  Sparkles, Shield, Clock, Star,
  Car, Truck, Zap, Target
} from 'lucide-react'
import { useSiteConfig } from '@/lib/site-config'
import { useMemo } from 'react'

const Services = () => {
  const { config } = useSiteConfig()

  const serviceCategories = useMemo(() => {
    if (config.services && config.services.length > 0) {
      const grouped: Record<string, { title: string; services: { name: string; icon: any; image: string }[] }> = {}
      const iconPool = [Home, Building, Users, Wrench, Sparkles, Shield, Clock, Star, Car, Truck, Zap, Target]
      config.services.forEach((svc, idx) => {
        const cat = svc.category || 'General'
        if (!grouped[cat]) grouped[cat] = { title: cat, services: [] }
        grouped[cat].services.push({
          name: svc.title,
          icon: iconPool[idx % iconPool.length],
          image: svc.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=400&h=300&fit=crop&crop=center'
        })
      })
      return Object.values(grouped)
    }
    return [
   
     {
      title: 'Cleaning Services',
      services: [
        {
          name: 'Residential Cleaning',
          icon: Home,
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center'
        },
        {
          name: 'Commercial Office Cleaning',
          icon: Building,
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center'
        },
        {
          name: 'Industrial Facility Cleaning',
          icon: Users,
          image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center'
        },
        {
          name: 'High-Pressure Cleaning',
          icon: Zap,
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
        }
      ]
    },
    {
      title: 'Laundry Services',
      services: [
        {
          name: 'Residential Cleaning',
          icon: Home,
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center'
        },
        {
          name: 'Commercial Office Cleaning',
          icon: Building,
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center'
        },
        {
          name: 'Industrial Facility Cleaning',
          icon: Users,
          image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center'
        },
        {
          name: 'High-Pressure Cleaning',
          icon: Zap,
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
        }
      ]
    },
    {
      title: 'Maintenance Services',
      services: [
        {
          name: 'Post-Construction Cleaning',
          icon: Wrench,
          image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&crop=center'
        },
        {
          name: 'Carpet & Upholstery Cleaning',
          icon: Sparkles,
          image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center'
        },
        {
          name: 'Window & Glass Cleaning',
          icon: Shield,
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center'
        },
        {
          name: 'Kitchen & Bathroom Deep Clean',
          icon: Star,
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
        }
      ]
    },
    {
      title: 'Specialized Services',
      services: [
        {
          name: 'Event & Venue Cleaning',
          icon: Clock,
          image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&crop=center'
        },
        {
          name: 'Vehicle Cleaning',
          icon: Car,
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center'
        },
        {
          name: 'Equipment Maintenance',
          icon: Truck,
          image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop&crop=center'
        },
        {
          name: 'Quality Assurance',
          icon: Target,
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center'
        }
      ]
    }
    ]
  }, [config])

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
