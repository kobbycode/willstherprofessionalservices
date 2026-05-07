'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { useSiteConfig } from '@/lib/site-config'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createContactSubmission } from '@/lib/contacts'

const Contact = () => {
  const { config } = useSiteConfig()
  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: [config.contactPhone || '0208267704'],
      color: 'bg-green-500'
    },
    {
      icon: Mail,
      title: 'Email Address',
      details: [config.contactEmail || 'willstherprofessionalservices@gmail.com'],
      color: 'bg-blue-500'
    },
    {
      icon: MapPin,
      title: 'Office Location',
      details: [config.footer.address || 'Mahogany Street, #7 New Achimota, Accra, Ghana'],
      color: 'bg-purple-500'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: [
        'Monday - Friday: 8:00am - 5:00pm',
        'Saturday: 8:00am - 5:00pm'
      ],
      color: 'bg-orange-500'
    }
  ]

  const socialLinks = [
    { icon: Facebook, href: config.footer.social?.facebook || '#', label: 'Facebook' },
    { icon: Twitter, href: config.footer.social?.twitter || 'https://x.com/willsther', label: 'Twitter' },
    { icon: Instagram, href: config.footer.social?.instagram || 'https://www.instagram.com/willstherprofessionalservices?utm_source=qr&igsh=bG04azZsODFmOGN5', label: 'Instagram' },
    { icon: Linkedin, href: config.footer.social?.linkedin || '#', label: 'LinkedIn' }
  ]

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return
    const formData = new FormData(e.currentTarget)
    const firstName = String(formData.get('firstName') || '')
    const lastName = String(formData.get('lastName') || '')
    const email = String(formData.get('email') || '')
    const phone = String(formData.get('phone') || '')
    const service = String(formData.get('service') || '')
    const message = String(formData.get('message') || '')

    if (!firstName || !lastName || !email || !message) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)
      console.log('Submitting contact form with:', { firstName, lastName, email, phone, service, message })
      const form = e.currentTarget as HTMLFormElement
      await createContactSubmission({ firstName, lastName, email, phone, service, message })
      console.log('Contact submission successful')
      form?.reset()
      toast.success('Message sent successfully!')
    } catch (err) {
      console.error('Contact submission error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to send message: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section-padding relative overflow-hidden bg-white">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100 dark:bg-primary-900/10 rounded-full blur-[140px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3" />

      <div className="container-custom px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 font-bold tracking-[0.4em] uppercase text-[11px] sm:text-[12px] mb-3 block">
            Connect With Us
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 mb-4 font-outfit tracking-tight uppercase">
            Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 italic">Conversation</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-blue-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-12"
          >
            <div>
              <h3 className="text-base font-bold text-secondary-900 mb-6 font-outfit uppercase tracking-widest">
                Information
              </h3>
              <p className="text-base text-secondary-600 font-inter leading-relaxed mb-8">
                Have a question or ready to book a service? Reach out to us through any of these channels.
              </p>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white border border-secondary-100 rounded-3xl p-6 flex items-start space-x-6 group hover:shadow-xl hover:shadow-secondary-200/20 transition-all duration-500 shadow-lg shadow-secondary-200/5"
                  >
                    <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary-900 mb-1 font-outfit uppercase tracking-[0.2em] text-sm">
                        {info.title}
                      </h4>
                      {info.details.map((detail, detailIndex) => {
                        const isPhone = info.title.toLowerCase().includes('phone');
                        const isEmail = info.title.toLowerCase().includes('email');

                        if (isPhone) {
                          return (
                            <a key={detailIndex} href={`tel:${detail.split(' / ')[0]}`} className="text-secondary-600 text-base font-medium font-inter hover:text-primary-500 transition-colors block">
                              {detail}
                            </a>
                          );
                        }
                        if (isEmail) {
                          return (
                            <a key={detailIndex} href={`mailto:${detail}`} className="text-secondary-600 text-base font-medium font-inter hover:text-primary-500 transition-colors block">
                              {detail}
                            </a>
                          );
                        }
                        return (
                          <p key={detailIndex} className="text-secondary-600 text-base font-medium font-inter">
                            {detail}
                          </p>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white border border-secondary-100 rounded-[2rem] p-6 shadow-xl shadow-secondary-200/5">
              <h4 className="font-bold text-secondary-900 mb-6 font-outfit uppercase tracking-widest text-[12px] text-center">Follow Our Journey</h4>
              <div className="flex justify-center gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="w-14 h-14 bg-secondary-900 hover:bg-primary-600 rounded-2xl flex items-center justify-center text-white transition-all duration-500 hover:-translate-y-2 shadow-xl shadow-secondary-900/10"
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="bg-white border border-secondary-100 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-secondary-200/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-[100px] -mr-32 -mt-32" />

              <h3 className="text-base font-bold text-secondary-900 mb-8 font-outfit uppercase tracking-widest relative z-10 text-center lg:text-left">
                Send Us a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 italic">Message</span>
              </h3>

              <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label htmlFor="firstName" className="text-[11px] font-bold text-secondary-500 uppercase tracking-[0.3em] mb-2 block transform group-focus-within:text-primary-600 transition-colors">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-6 py-4 bg-white border border-secondary-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 outline-none text-secondary-900 font-medium font-inter"
                      placeholder="Kofi"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <label htmlFor="lastName" className="text-[11px] font-bold text-secondary-500 uppercase tracking-[0.3em] mb-2 block transform group-focus-within:text-primary-600 transition-colors">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-6 py-4 bg-white border border-secondary-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 outline-none text-secondary-900 font-medium font-inter"
                      placeholder="Mensah"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label htmlFor="email" className="text-[11px] font-bold text-secondary-500 uppercase tracking-[0.3em] mb-2 block transform group-focus-within:text-primary-600 transition-colors">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-6 py-4 bg-white border border-secondary-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 outline-none text-secondary-900 font-medium font-inter"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <label htmlFor="phone" className="text-[11px] font-bold text-secondary-500 uppercase tracking-[0.3em] mb-2 block transform group-focus-within:text-primary-600 transition-colors">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-6 py-4 bg-white border border-secondary-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 outline-none text-secondary-900 font-medium font-inter"
                      placeholder="+233 20 826 7704"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label htmlFor="service" className="text-[11px] font-bold text-secondary-500 uppercase tracking-[0.3em] mb-2 block transform group-focus-within:text-primary-600 transition-colors">
                    Service Required
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full px-6 py-4 bg-white border border-secondary-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 outline-none text-secondary-900 font-medium font-inter appearance-none"
                    required
                  >
                    <option value="" className="bg-white text-secondary-900">Select a service</option>
                    <option value="residential" className="bg-white text-secondary-900">Residential Cleaning</option>
                    <option value="commercial" className="bg-white text-secondary-900">Commercial Cleaning</option>
                    <option value="industrial" className="bg-white text-secondary-900">Industrial Cleaning</option>
                    <option value="maintenance" className="bg-white text-secondary-900">Maintenance Services</option>
                    <option value="other" className="bg-white text-secondary-900">Other</option>
                  </select>
                </div>

                <div className="relative group">
                  <label htmlFor="message" className="text-[11px] font-bold text-secondary-500 uppercase tracking-[0.3em] mb-2 block transform group-focus-within:text-primary-600 transition-colors">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-6 py-4 bg-white border border-secondary-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 outline-none text-secondary-900 font-medium font-inter resize-none"
                    placeholder="Describe your requirements..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-secondary-900 hover:bg-primary-600 text-white font-black py-5 px-8 rounded-2xl shadow-2xl hover:shadow-primary-600/20 transition-all duration-500 transform ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 active:scale-95'} text-lg font-outfit uppercase tracking-wider flex items-center justify-center gap-4`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Inquiry...
                    </div>
                  ) : (
                    <>
                      Send Your Inquiry
                      <Mail className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] overflow-hidden shadow-3xl"
        >
          <div className="h-[400px] md:h-[500px] w-full contrast-125 opacity-80 transition-all duration-1000">
            <iframe
              src={config.map.embedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.5!2d-0.2!3d5.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzYnMDAuMCJOIDDCsDEyJzAwLjAiVw!5e0!3m2!1sen!2sgh!4v1234567890"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location Map"
              className="w-full h-full"
            ></iframe>
          </div>

          {/* Address Overlay */}
          <div className="absolute bottom-8 left-8 right-8 lg:left-auto lg:right-8 lg:w-96 bg-white border border-secondary-100 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-secondary-200/20">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-secondary-900 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-secondary-900/10">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-black text-secondary-900 mb-2 font-outfit tracking-tight uppercase">Visit Our Office</h4>
                <p className="text-secondary-600 font-medium leading-relaxed font-inter text-sm">
                  {config.footer.address || 'Mahogany Street, #7 New Achimota, Accra, Ghana'}
                </p>
                <div className="mt-4 flex items-center gap-3 text-primary-600 font-bold uppercase tracking-[0.2em] text-[12px]">
                  <Clock className="w-4 h-4" />
                  Mon - Sat: 8:00am - 5:00pm
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
