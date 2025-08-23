'use client'

import { motion } from 'framer-motion'
import { Shield, Target, Award, Heart } from 'lucide-react'

const Values = () => {
  const values = [
    {
      icon: Shield,
      title: 'Professionalism',
      description: 'We maintain the highest standards of professional conduct in all our services and interactions.',
      color: 'bg-blue-500'
    },
    {
      icon: Target,
      title: 'Integrity',
      description: 'Honest, transparent, and ethical business practices are the foundation of our company.',
      color: 'bg-green-500'
    },
    {
      icon: Award,
      title: 'Accountability',
      description: 'We take full responsibility for our work and ensure complete customer satisfaction.',
      color: 'bg-purple-500'
    },
    {
      icon: Heart,
      title: 'Quality Service',
      description: 'Delivering exceptional results that guarantee maximum return on your investment.',
      color: 'bg-red-500'
    }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
            Why You'll Love Us
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8"></div>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            We are founded on core principles that drive our success and ensure your satisfaction
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-10 h-10 text-secondary-600" />
                </div>
                <div className={`absolute inset-0 ${value.color} rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              </div>
              
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                {value.title}
              </h3>
              
              <p className="text-secondary-600 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="bg-primary-50 rounded-3xl p-8 md:p-12 border border-primary-100"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-6">
                Your Property Management Partner
              </h3>
              <p className="text-lg text-secondary-600 leading-relaxed mb-6">
                We are your property management company that arranges any service required to have the property in best condition, 
                making it rentable or fit for sale be it pre-move-in or even when you are already occupying.
              </p>
              <p className="text-lg text-secondary-600 leading-relaxed">
                We also take care of repairs and renovations, ensuring your property maintains its value and appeal.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="text-xl font-bold text-secondary-900 mb-4 text-center">
                What We Deliver
              </h4>
              <ul className="space-y-3">
                {[
                  'Professional maintenance services',
                  'Quality refurbishment work',
                  'Reliable cleaning solutions',
                  'Expert technical support',
                  'Timely project completion',
                  'Competitive pricing'
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-secondary-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Values
