'use client'

import { motion } from 'framer-motion'
import { Users, Building, Star, TrendingUp } from 'lucide-react'

const Stats = () => {
  const stats = [
    {
      icon: Building,
      number: '30',
      label: 'Institution / Household per month',
      color: 'bg-primary-500'
    },
    {
      icon: Users,
      number: '23',
      label: 'Working Experts',
      color: 'bg-accent-500'
    },
    {
      icon: Star,
      number: '100%',
      label: 'Satisfied Customers',
      color: 'bg-green-500'
    },
    {
      icon: TrendingUp,
      number: '∞',
      label: 'Growth Potential',
      color: 'bg-purple-500'
    }
  ]

  return (
    <section className="section-padding bg-primary-600 text-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Our Services in Numbers
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Delivering exceptional results through dedicated expertise and proven track record
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-12 h-12 text-white" />
                </div>
                <div className={`absolute inset-0 ${stat.color} rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              </div>
              
              <div className="mb-4">
                <span className="text-5xl md:text-6xl font-bold text-white">
                  {stat.number}
                </span>
              </div>
              
              <p className="text-lg text-primary-100 font-medium leading-relaxed">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Experience Our Excellence?
            </h3>
            <p className="text-primary-100 mb-6 text-lg">
              Join our growing list of satisfied customers and let us transform your property
            </p>
            <a 
              href="#contact" 
              className="inline-block bg-white text-primary-700 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Get Started Today
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Stats
