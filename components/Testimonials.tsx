'use client'

import { motion } from 'framer-motion'
import { Star, Quote, ArrowRight } from 'lucide-react'
import { useSiteConfig } from '@/lib/site-config'
import Skeleton from '@/components/Skeleton'
import Link from 'next/link'

const Testimonials = () => {
  const { config, isLoaded } = useSiteConfig()
  const testimonials = (config.testimonials || []).map((t) => ({
    name: t.name,
    rating: t.rating || 5,
    title: t.role || 'Customer',
    comment: t.content,
    highlight: t.role || 'Customer'
  }))

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'}`}
      />
    ))
  }

  if (!isLoaded && (!config.testimonials || config.testimonials.length === 0)) {
    return (
      <section className="bg-[#F8FAFC] py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-4">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white shadow-sm p-6">
                <Skeleton className="h-5 w-24 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="testimonials" className="bg-[#F8FAFC] py-16 md:py-24">
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
            SUCCESS STORIES
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">
            Trust the Excellence
          </h2>
          <p className="text-[#64748B] text-sm max-w-xl leading-relaxed">
            Hear from our clients about their experience working with us.
          </p>
        </motion.div>

        {/* TESTIMONIALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white shadow-sm p-6 flex flex-col hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex gap-0.5">
                  {renderStars(testimonial.rating)}
                </div>
                <div className="w-9 h-9 bg-[#0F172A] flex items-center justify-center">
                  <Quote className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 mb-5">
                <p className="font-bold text-[#0F172A] text-sm mb-2">{testimonial.title}</p>
                <p className="text-[#64748B] text-sm leading-relaxed italic">
                  &ldquo;{testimonial.comment}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#E2E8F0]">
                <p className="font-bold text-[#0F172A] text-sm">{testimonial.name}</p>
                <p className="text-[#2563EB] text-xs font-semibold mt-0.5">Verified Client</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="bg-white shadow-sm p-8 md:p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-4">
              Ready to Experience Premium Care?
            </h3>
            <p className="text-[#64748B] text-sm max-w-lg mx-auto leading-relaxed mb-8">
              Experience the same level of excellence that our customers rave about. Let us transform your environment today.
            </p>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold text-sm transition-all duration-300"
            >
              Get Your Quote Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
