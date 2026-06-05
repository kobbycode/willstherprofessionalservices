'use client'

import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import { useSiteConfig } from '@/lib/site-config'

const Clients = () => {
  const { config } = useSiteConfig()
  const clients = Array.isArray(config.clients) ? config.clients : []
  return (
    <section className="section-padding relative overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] -z-10" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 font-bold tracking-[0.4em] uppercase text-[11px] sm:text-[12px] mb-3 block">
            Our Clients
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-4 font-outfit tracking-tight uppercase">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 italic">Industry Leaders</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-blue-400 mx-auto mb-6 rounded-full" />
          <p className="text-base md:text-lg text-secondary-600 max-w-2xl mx-auto font-normal leading-relaxed">
            We are proud to serve a diverse range of prestigious clients across multiple sectors.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {clients.map((name, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="bg-white border border-secondary-100 rounded-[2.5rem] p-6 md:p-8 text-center group hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors">
                <Building2 className="w-7 h-7 text-primary-600" />
              </div>
              <p className="text-[12px] md:text-sm font-bold text-secondary-900 uppercase tracking-wider leading-tight">
                {name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Clients
