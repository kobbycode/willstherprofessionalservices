'use client'

import { motion } from 'framer-motion'
import { Shield, Users, Target, Award, ArrowRight, Check, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSiteConfig } from '@/lib/site-config'

const features = [
  {
    icon: Shield,
    title: 'Property Management',
    description: 'We arrange any service required to have your property in the best condition, making it rentable or fit for sale.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&crop=center',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Our team of 23 working experts ensures professional and reliable service delivery for all your needs.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=center',
  },
  {
    icon: Target,
    title: 'Quality Focus',
    description: 'We take great pride in improving upon your property and making your facility shine with our attention to detail.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&crop=center',
  },
  {
    icon: Award,
    title: '',
    description: '100% customer satisfaction rate with 450+ institutions and households served.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=center',
  },
]

const trustPoints = [
  'Professional Team',
  'Reliable Maintenance',
  'Quality Guaranteed',
]

const About = () => {
  const { config } = useSiteConfig()

  return (
    <section id="about" className="bg-[#F8FAFC] py-16 md:py-24">
      <div className="container-custom">
        {/* SECTION 1: ABOUT / IDENTITY */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[#2563EB] font-semibold tracking-[0.2em] text-xs mb-4 block">
              OUR IDENTITY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] leading-[1.15] tracking-tight mb-5">
              Professional Property & Facility Support Experts
            </h2>
            <p className="text-[#64748B] text-base leading-relaxed max-w-lg mb-8">
              {config.about.content || 'WILLSTHER PROFESSIONAL SERVICES is a fast-growing industrial, commercial, and household maintenance services provider committed to delivering unparalleled quality.'}
            </p>
            <div className="space-y-3 mb-10">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                  </div>
                  <span className="text-[#0F172A] font-medium text-sm">{point}</span>
                </div>
              ))}
            </div>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold text-sm transition-all duration-300"
            >
              Explore Our Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1473&auto=format&fit=crop"
                alt="Professional Services"
                width={700}
                height={500}
                className="w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent" />
            </div>
            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-5 -left-5 bg-white shadow-lg p-5 max-w-[240px]"
            >
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="font-bold text-[#0F172A] text-sm">100% Client Satisfaction</p>
              <p className="text-[#64748B] text-xs mt-0.5">Trusted by businesses and households across Ghana</p>
            </motion.div>
          </motion.div>
        </div>

        {/* SECTION 2: FEATURES */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <span className="text-[#2563EB] font-semibold tracking-[0.2em] text-xs mb-3 block">
            WHY CHOOSE US
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight">
            Built for Excellence
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden group flex flex-col"
            >
              <div className="p-5 flex-1">
                <div className="w-10 h-10 bg-[#2563EB]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <h3 className="font-bold text-[#0F172A] text-base mb-2">{feature.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center gap-1 text-[#2563EB] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
