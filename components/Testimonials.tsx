'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useSiteConfig } from '@/lib/site-config'
import Skeleton from '@/components/Skeleton'

const Testimonials = () => {
  const { config, isLoaded } = useSiteConfig()
  const testimonials = config.testimonials && config.testimonials.length > 0 ? config.testimonials.map((t) => ({
    name: t.name,
    rating: t.rating || 5,
    title: t.role || 'Customer',
    comment: t.content,
    highlight: t.role || 'Customer'
  })) : [
    {
      name: 'Edwin, Tse Addo',
      rating: 5,
      title: 'Excellent Service',
      comment: 'Good work done. i am impressed, will definately recommend and refer.',
      highlight: 'Excellent Service'
    },
    {
      name: 'Kafui, Adjeiman',
      rating: 5,
      title: 'Super Support',
      comment: 'Charlie, thanks so much for today Boss, really appreciate the support and excellent delivery, you guys are super.',
      highlight: 'Super Support'
    },
    {
      name: 'Nii My Wekuevents, Ashaley Bowta School Junction',
      rating: 5,
      title: 'Love the flexibility',
      comment: 'Thanks for these Willsther. Good job.',
      highlight: 'Love the flexibility'
    },
    {
      name: 'Joshua, North Kaneshie',
      rating: 5,
      title: 'Grateful for commitment',
      comment: 'Thank you so much once again. I am very grateful for the commitment. Good job.',
      highlight: 'Grateful for commitment'
    },
    {
      name: 'Frankly, NNF Esquire ltd, Tema Community 22',
      rating: 4,
      title: 'Fantastic quality',
      comment: 'Thanks Willsther Professional Services for restoring that shine back to our office building, especially the glass good work done.',
      highlight: 'Fantastic quality'
    },
    {
      name: 'Priscilla, Domi Pillar',
      rating: 5,
      title: 'Spotless and Smelled great',
      comment: 'Good Professional Services, The place was Spotless and Smelled great. Thank you for helping me with the heavy lifting. Would recommend Willsther Professional Services any day because you guys really came through for me.',
      highlight: 'Spotless and Smelled great'
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-accent-500 fill-current' : 'text-gray-200'
          }`}
      />
    ))
  }

  if (!isLoaded && (!config.testimonials || config.testimonials.length === 0)) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6 opacity-30">
              What Our Customers Say
            </h2>
            <div className="w-24 h-1 bg-primary-200 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-premium border border-gray-100">
                <div className="flex justify-between mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => <Skeleton key={j} className="w-5 h-5 rounded-full" />)}
                  </div>
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding relative overflow-hidden bg-white" id="testimonials">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 dark:bg-primary-900/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 font-bold tracking-[0.4em] uppercase text-[9px] sm:text-[10px] mb-3 block">
            Success Stories
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-4 font-outfit tracking-tight uppercase">
            Trust the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 italic">Excellence</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-blue-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-secondary-100 rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-secondary-200/20 transition-all duration-500 flex flex-col h-full group shadow-xl shadow-secondary-200/5"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-1.5 p-1 px-3 bg-slate-50 rounded-full">
                  {renderStars(testimonial.rating)}
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-secondary-900 rounded-2xl group-hover:bg-primary-600 transition-colors duration-500 shadow-lg shadow-secondary-900/10">
                  <Quote className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex-grow mb-6">
                <h4 className="text-base font-bold text-secondary-900 mb-3 font-outfit uppercase tracking-widest">
                  {testimonial.title}
                </h4>
                <p className="text-sm sm:text-base text-secondary-600 leading-relaxed font-inter italic">
                  "{testimonial.comment}"
                </p>
              </div>

              <div className="pt-6 border-t border-secondary-100 mt-auto">
                <p className="font-bold text-secondary-900 text-base font-outfit tracking-tight">
                  {testimonial.name}
                </p>
                <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mt-1">
                  Verified Client
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <div className="bg-white border border-secondary-100 rounded-[3rem] p-12 relative overflow-hidden group shadow-2xl shadow-secondary-200/20">
            {/* Animated background decorative element */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h3 className="text-3xl md:text-4xl font-black mb-6 text-secondary-900 font-outfit tracking-tight leading-tight uppercase">
                Ready to Experience <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 italic">Premium Care?</span>
              </h3>
              <p className="text-secondary-600 mb-10 text-lg font-light leading-relaxed font-inter">
                Experience the same level of excellence that our customers rave about. Let us transform your environment today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href="#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-secondary-900 hover:bg-primary-600 text-white font-black py-4 px-12 rounded-2xl transition-all duration-500 transform hover:-translate-y-1 shadow-xl hover:shadow-primary-600/20 gap-3 uppercase tracking-wider text-xs"
                >
                  Get Your Quote Today
                  <Quote className="w-4 h-4 rotate-180" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
