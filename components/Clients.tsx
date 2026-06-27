'use client'

import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import { useSiteConfig } from '@/lib/site-config'
import Image from 'next/image'

const Clients = () => {
  const { config } = useSiteConfig()
  const clients = Array.isArray(config.clients) ? config.clients : []

  return (
    <section className="bg-[#F8FAFC] py-16 md:py-24">
      <div className="container-custom">
        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <span className="text-[#2563EB] font-semibold tracking-[0.2em] text-xs mb-3 block">
            OUR CLIENTS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">
            Trusted by Industry Leaders
          </h2>
          <p className="text-[#64748B] text-sm max-w-xl leading-relaxed">
            We are proud to serve a diverse range of prestigious clients across multiple sectors.
          </p>
        </motion.div>

        {/* CLIENTS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {clients.map((client, index) => (
            <motion.div
              key={client.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-white shadow-sm p-6 text-center group hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col items-center"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 mb-4 flex items-center justify-center">
                {client.logoUrl ? (
                  <Image
                    src={client.logoUrl}
                    alt={client.name || 'Client logo'}
                    width={80}
                    height={80}
                    sizes="80px"
                    className="object-contain max-w-full max-h-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#2563EB]/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#2563EB]" />
                  </div>
                )}
              </div>
              <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider leading-tight">
                {client.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Clients
