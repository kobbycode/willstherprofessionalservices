'use client'

import { motion } from 'framer-motion'
import { Shield, Users, Target, Award, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSiteConfig } from '@/lib/site-config'

const About = () => {
  const { config } = useSiteConfig()
  const features = [
    {
      icon: Shield,
      title: 'Property Management',
      description: 'We arrange any service required to have your property in the best condition, making it rentable or fit for sale.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our team of 23 working experts ensures professional and reliable service delivery for all your needs.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center',
      color: 'bg-green-500'
    },
    {
      icon: Target,
      title: 'Quality Focus',
      description: 'We take great pride in improving upon your property and making your facility shine with our attention to detail.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center',
      color: 'bg-purple-500'
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: '100% customer satisfaction rate with 30+ institutions and households served per month.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
      color: 'bg-orange-500'
    }
  ]

  return (
    <section id="about" className="section-padding relative overflow-hidden bg-white">
      {/* Ambient background decorations */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[120px] -z-10 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[100px] -z-10 translate-x-1/4 translate-y-1/4" />

      <div className="container-custom px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 font-bold tracking-[0.4em] uppercase text-[9px] sm:text-[10px] mb-3 block">
            Our Identity
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-4 font-outfit tracking-tight uppercase">
            Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 italic">Excellence</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-blue-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-6 space-y-8"
          >
            <h3 className="text-3xl md:text-5xl font-black text-secondary-900 font-outfit leading-[1.1] tracking-tight">
              {config.about.title || 'Professional Maintenance & Cleaning Services'}
            </h3>
            <p className="text-xl text-secondary-600 leading-relaxed font-inter font-light">
              {config.about.content || 'WILLSTHER PROFESSIONAL SERVICES is a fast-growing industrial, commercial, and household maintenance services provider committed to delivering unparalleled quality.'}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {[
                { title: 'Excellence Guaranteed', label: 'Superior Standards' },
                { title: 'Expert Precision', label: 'Attentive Care' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-secondary-900 font-outfit uppercase tracking-wider">{item.title}</div>
                    <div className="text-xs text-secondary-500 font-inter font-medium">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <motion.div 
              whileHover={{ x: 10 }}
              className="inline-flex items-center gap-4 pt-6 group cursor-pointer"
            >
              <Link href="#contact" className="text-primary-600 font-black font-outfit text-lg tracking-tight uppercase">
                Explore Our Commitment
              </Link>
              <div className="w-10 h-10 border border-primary-600/20 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                <ChevronRight className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-6 relative"
          >
            <div className="relative z-10 bg-white border border-secondary-100 rounded-[3rem] p-2 overflow-hidden shadow-2xl">
               <div className="aspect-[4/5] relative rounded-[2.8rem] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1473&auto=format&fit=crop"
                  alt="Professional Services"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/60 via-transparent to-transparent"></div>
                
                {/* Floating stat card */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 rounded-3xl p-6 border border-white/20 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-secondary-900 font-black text-3xl font-outfit tracking-tighter">100%</div>
                      <div className="text-secondary-500 text-xs font-bold font-inter uppercase tracking-[0.2em]">Satisfaction Rate</div>
                    </div>
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
               </div>
            </div>
            
            {/* Background geometric element */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>

        {/* Core Values / Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-secondary-100 group rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-4 flex flex-col items-center text-center h-full relative overflow-hidden shadow-xl shadow-secondary-200/5 hover:shadow-secondary-200/20"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-20 h-20 mb-8 relative">
                <div className="absolute inset-0 bg-primary-600/10 rounded-3xl blur-xl group-hover:bg-primary-600/20 transition-colors" />
                <div className="relative w-full h-full bg-white rounded-3xl flex items-center justify-center shadow-md border border-secondary-100 transform group-hover:rotate-12 transition-transform duration-500">
                  <feature.icon className="w-10 h-10 text-primary-600" />
                </div>
              </div>

              <h4 className="text-2xl font-black text-secondary-900 mb-4 font-outfit tracking-tight">
                {feature.title}
              </h4>
              <p className="text-secondary-600 leading-relaxed font-inter font-light mb-8">
                {feature.description}
              </p>

              <div className="mt-auto relative w-full aspect-square rounded-3xl overflow-hidden transition-all duration-700">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover"
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
