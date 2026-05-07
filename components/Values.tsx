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
    <section className="section-padding relative overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary-100 dark:bg-primary-900/10 rounded-full blur-[140px] -z-10 -translate-x-1/2" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 font-bold tracking-[0.4em] uppercase text-[11px] sm:text-[12px] mb-3 block">
            Our Foundation
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-4 font-outfit tracking-tight uppercase">
            Why You'll <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 italic">Expect More</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-blue-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-white border border-secondary-100 rounded-[2.5rem] p-10 text-center group hover:shadow-2xl hover:shadow-secondary-200/20 transition-all duration-500 relative overflow-hidden h-full shadow-xl shadow-secondary-200/5"
            >
              <div className="relative mb-8 z-10">
                <div className="w-20 h-20 bg-secondary-900 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-primary-600 transition-all duration-500 shadow-xl shadow-secondary-900/10">
                  <value.icon className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <h3 className="text-sm font-bold text-secondary-900 mb-3 font-outfit uppercase tracking-widest">
                {value.title}
              </h3>
              
              <p className="text-[13px] sm:text-sm text-secondary-600 leading-relaxed font-inter">
                {value.description}
              </p>

              {/* Decorative accent */}
              <div className={`absolute bottom-0 left-0 w-full h-1.5 ${value.color} opacity-20`} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="bg-white border border-secondary-100 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl shadow-secondary-200/20"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 dark:bg-primary-900/10 rounded-full blur-[100px] -z-10 -mr-48 -mt-48" />
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary-600 font-bold tracking-[0.4em] uppercase text-[11px] mb-3 block">
                Total Commitment
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-secondary-900 mb-6 font-outfit tracking-tight uppercase">
                Management <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 italic">Partner</span>
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-secondary-600 leading-relaxed font-inter">
                  We are your property management company that arranges any service required to have the property in best condition.
                </p>
                <p className="text-sm text-secondary-600 leading-relaxed font-inter">
                  Making it rentable or fit for sale, be it pre-move-in or even when you are already occupying. We also take care of repairs and renovations.
                </p>
              </div>
            </div>
            
            <div className="bg-white border border-secondary-100 rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden group">
              <h4 className="text-2xl font-black text-secondary-900 mb-8 font-outfit tracking-tight text-center uppercase">
                What We Deliver
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  'Professional maintenance',
                  'Quality refurbishment',
                  'Reliable cleaning',
                  'Technical support',
                  'Timely completion',
                  'Competitive pricing'
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 bg-white border border-secondary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300 shadow-sm">
                      <Shield className="w-5 h-5 text-primary-600 group-hover:text-white" />
                    </div>
                    <span className="text-secondary-700 font-medium text-sm uppercase tracking-wider">{item}</span>
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
