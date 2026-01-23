'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useSiteConfig } from '@/lib/site-config'

const Testimonials = () => {
  const { config } = useSiteConfig()
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

  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8"></div>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(testimonial.rating)}
                </div>
                <Quote className="w-8 h-8 text-primary-200" />
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                  {testimonial.title}
                </h4>
                <p className="text-secondary-600 leading-relaxed">
                  {testimonial.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="font-medium text-secondary-900">
                  {testimonial.name}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-secondary-500">Rating:</span>
                  <span className="text-sm font-medium text-secondary-700">
                    {testimonial.rating} out of 5
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-primary-900 rounded-3xl p-8 text-white shadow-premium relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">
              Join Our Happy Customers
            </h3>
            <p className="text-primary-100 mb-6 text-lg relative z-10">
              Experience the same level of excellence that our customers rave about
            </p>
            <a
              href="#contact"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 relative z-10 shadow-lg"
            >
              Get Your Quote Today
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
