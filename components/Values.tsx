'use client'

import { motion } from 'framer-motion'
import { Shield, Target, Award, Heart, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const values = [
  {
    icon: Shield,
    title: 'Professionalism',
    description: 'We maintain the highest standards of professional conduct in all our services and interactions.',
  },
  {
    icon: Target,
    title: 'Integrity',
    description: 'Honest, transparent, and ethical business practices are the foundation of our company.',
  },
  {
    icon: Award,
    title: 'Accountability',
    description: 'We take full responsibility for our work and ensure complete customer satisfaction.',
  },
  {
    icon: Heart,
    title: 'Quality Service',
    description: 'Delivering exceptional results that guarantee maximum return on your investment.',
  },
]

const Values = () => {
  return (
    <section id="values" className="bg-[#F8FAFC] py-16 md:py-24">
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
            OUR FOUNDATION
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">
            Why You&apos;ll Expect More
          </h2>
          <p className="text-[#64748B] text-sm max-w-xl leading-relaxed">
            Our core values drive every service we deliver, ensuring consistency, trust, and excellence.
          </p>
        </motion.div>

        {/* VALUES GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white shadow-sm p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 bg-[#2563EB]/10 flex items-center justify-center mb-4">
                <value.icon className="w-5 h-5 text-[#2563EB]" />
              </div>
              <h3 className="font-bold text-[#0F172A] text-sm mb-2">{value.title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* MANAGEMENT PARTNER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20"
        >
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start bg-white shadow-sm p-8 md:p-12">
            <div>
              <span className="text-[#2563EB] font-semibold tracking-[0.2em] text-xs mb-3 block">
                TOTAL COMMITMENT
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight leading-tight mb-5">
                Management <span className="text-[#2563EB]">Partner</span>
              </h3>
              <div className="space-y-4">
                <p className="text-[#64748B] text-sm leading-relaxed">
                  We are your property management company that arranges any service required to have the property in best condition.
                </p>
                <p className="text-[#64748B] text-sm leading-relaxed">
                  Making it rentable or fit for sale, be it pre-move-in or even when you are already occupying. We also take care of repairs and renovations.
                </p>
              </div>
            </div>
            <div className="bg-white border border-[#E2E8F0] p-6 md:p-8 shadow-sm">
              <h4 className="font-bold text-[#0F172A] text-base mb-6">What We Deliver</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Professional maintenance',
                  'Quality refurbishment',
                  'Reliable cleaning',
                  'Technical support',
                  'Timely completion',
                  'Competitive pricing',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span className="text-[#0F172A] font-medium text-xs uppercase tracking-wider">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Values
