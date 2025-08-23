'use client'

import { motion } from 'framer-motion'
import { Shield, Users, Target, Award } from 'lucide-react'
import { useSiteConfig } from '@/lib/site-config'

const About = () => {
  const { config } = useSiteConfig()
  const features = [
    {
      icon: Shield,
      title: 'Property Management',
      description: 'We arrange any service required to have your property in the best condition, making it rentable or fit for sale.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our team of 23 working experts ensures professional and reliable service delivery for all your needs.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center',
      color: 'bg-green-500'
    },
    {
      icon: Target,
      title: 'Quality Focus',
      description: 'We take great pride in improving upon your property and making your facility shine with our attention to detail.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center',
      color: 'bg-purple-500'
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: '100% customer satisfaction rate with 30+ institutions and households served per month.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
      color: 'bg-orange-500'
    }
  ]

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-3 sm:mb-4 md:mb-6">
            Who We Are?
          </h2>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-primary-500 mx-auto mb-4 sm:mb-6 md:mb-8"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-secondary-900 mb-3 sm:mb-4 md:mb-6">
              {config.about.title || 'Professional Maintenance & Cleaning Services'}
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-secondary-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
              {config.about.content || 'WILLSTHER PROFESSIONAL SERVICES is a fast-growing industrial, commercial, and household maintenance services provider.'}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-primary-500 rounded-full"></div>
                <span className="text-xs sm:text-sm md:text-base text-secondary-600 font-medium">Professional Service</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-primary-500 rounded-full"></div>
                <span className="text-xs sm:text-sm md:text-base text-secondary-600 font-medium">Quality Guaranteed</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2"
          >
            <div className="bg-primary-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center group"
                  >
                    <div className="relative mb-2 sm:mb-3 md:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary-600" />
                      </div>
                      <div className={`absolute inset-0 ${feature.color} rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    </div>
                    <h4 className="text-xs sm:text-sm md:text-sm font-semibold text-secondary-900 mb-1 sm:mb-1 md:mb-2 leading-tight">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-secondary-600 leading-tight">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards with Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4 md:gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group overflow-hidden flex flex-col h-full"
            >
              <div className="relative mb-2 sm:mb-3 md:mb-4 flex-1">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full min-h-[200px] sm:min-h-[240px] md:min-h-[280px] object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=400&h=300&fit=crop&crop=center'
                  }}
                />
                <div className={`absolute top-1 right-1 sm:top-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${feature.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <h4 className="text-sm sm:text-base md:text-lg font-semibold text-secondary-900 mb-1 sm:mb-2 md:mb-3 text-center">
                  {feature.title}
                </h4>
                <p className="text-xs sm:text-xs md:text-sm text-secondary-600 leading-relaxed text-center flex-1">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default About
