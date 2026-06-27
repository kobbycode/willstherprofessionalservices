'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react'
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
    },
    {
      icon: Mail,
      title: 'Email Address',
      details: [config.contactEmail || 'willstherprofessionalservices@gmail.com'],
    },
    {
      icon: MapPin,
      title: 'Office Location',
      details: [config.footer.address || 'Mahogany Street, #7 New Achimota, Accra, Ghana'],
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Monday - Friday: 8:00am - 5:00pm', 'Saturday: 8:00am - 5:00pm'],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: config.footer.social?.facebook || '#', label: 'Facebook' },
    { icon: Twitter, href: config.footer.social?.twitter || 'https://x.com/willsther', label: 'Twitter' },
    { icon: Instagram, href: config.footer.social?.instagram || 'https://www.instagram.com/willstherprofessionalservices?utm_source=qr&igsh=bG04azZsODFmOGN5', label: 'Instagram' },
    { icon: Linkedin, href: config.footer.social?.linkedin || '#', label: 'LinkedIn' },
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
      const form = e.currentTarget as HTMLFormElement
      await createContactSubmission({ firstName, lastName, email, phone, service, message })
      form?.reset()
      toast.success('Message sent successfully!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to send message: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="bg-[#F8FAFC] py-16 md:py-24">
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
            CONNECT WITH US
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight mb-3">
            Let&apos;s Start a Conversation
          </h2>
          <p className="text-[#64748B] text-sm max-w-xl leading-relaxed">
            Have a question or ready to book a service? Reach out to us through any of these channels.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {/* CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                  <info.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider mb-1">{info.title}</h4>
                  {info.details.map((detail, detailIndex) => {
                    const isPhone = info.title.toLowerCase().includes('phone')
                    const isEmail = info.title.toLowerCase().includes('email')

                    if (isPhone) {
                      return (
                        <a key={detailIndex} href={`tel:${detail.split(' / ')[0]}`} className="text-[#64748B] text-sm hover:text-[#2563EB] transition-colors block">
                          {detail}
                        </a>
                      )
                    }
                    if (isEmail) {
                      return (
                        <a key={detailIndex} href={`mailto:${detail}`} className="text-[#64748B] text-sm hover:text-[#2563EB] transition-colors block">
                          {detail}
                        </a>
                      )
                    }
                    return (
                      <p key={detailIndex} className="text-[#64748B] text-sm">{detail}</p>
                    )
                  })}
                </div>
              </motion.div>
            ))}

            {/* SOCIAL */}
            <div className="bg-white shadow-sm p-5">
              <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider mb-4 text-center">Follow Our Journey</h4>
              <div className="flex justify-center gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="w-10 h-10 bg-[#2563EB] hover:bg-[#1d4ed8] flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-0.5"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white shadow-sm p-6 md:p-8">
              <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider mb-6">Send Us a Message</h3>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none text-[#0F172A] text-sm transition-all"
                      placeholder="Kofi"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none text-[#0F172A] text-sm transition-all"
                      placeholder="Mensah"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none text-[#0F172A] text-sm transition-all"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none text-[#0F172A] text-sm transition-all"
                      placeholder="+233 20 826 7704"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">
                    Service Required
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="w-full px-4 py-3 bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none text-[#0F172A] text-sm transition-all appearance-none"
                    required
                  >
                    <option value="" className="bg-white text-[#0F172A]">Select a service</option>
                    <option value="residential" className="bg-white text-[#0F172A]">Residential Cleaning</option>
                    <option value="commercial" className="bg-white text-[#0F172A]">Commercial Cleaning</option>
                    <option value="industrial" className="bg-white text-[#0F172A]">Industrial Cleaning</option>
                    <option value="maintenance" className="bg-white text-[#0F172A]">Maintenance Services</option>
                    <option value="other" className="bg-white text-[#0F172A]">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none text-[#0F172A] text-sm transition-all resize-none"
                    placeholder="Describe your requirements..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold py-3.5 text-sm transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />
                      <span>Sending Inquiry...</span>
                    </div>
                  ) : (
                    <>
                      Send Your Inquiry
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* MAP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative shadow-sm"
        >
          <div className="h-[350px] md:h-[400px] w-full">
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
            />
          </div>
          <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-6 lg:w-80 bg-white shadow-sm p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#0F172A] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider mb-1">Visit Our Office</h4>
                <p className="text-[#64748B] text-sm">
                  {config.footer.address || 'Mahogany Street, #7 New Achimota, Accra, Ghana'}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[#2563EB] text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" />
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
