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
      details: [config.contactPhone || '(233) 594 850 005'],
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
    { icon: Twitter, href: config.footer.social?.twitter || '#', label: 'Twitter' },
    { icon: Instagram, href: config.footer.social?.instagram || '#', label: 'Instagram' },
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
      await createContactSubmission({ firstName, lastName, email, phone, service, message })
      ;(e.currentTarget as HTMLFormElement).reset()
      toast.success('Message sent successfully!')
    } catch (err) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-4 md:mb-6">
            Contact Us
          </h2>
          <div className="w-20 md:w-24 h-1 bg-primary-500 mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto px-2">
            Get in touch with us for all your maintenance and cleaning needs
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-6 md:mb-8">
              Get In Touch
            </h3>

            <div className="space-y-4 md:space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3 md:space-x-4"
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${info.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <info.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-900 mb-1 md:mb-2 text-sm md:text-base">
                      {info.title}
                    </h4>
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-secondary-600 mb-1 text-sm md:text-base">
                        {detail}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Media */}
            <div className="mt-6 md:mt-8">
              <h4 className="font-semibold text-secondary-900 mb-3 md:mb-4 text-sm md:text-base">Follow Us</h4>
              <div className="flex space-x-3 md:space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="w-10 h-10 md:w-12 md:h-12 bg-primary-500 hover:bg-primary-600 rounded-lg flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-secondary-50 rounded-2xl p-6 md:p-8 border border-gray-100"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-4 md:mb-6">
              Send Us a Message
            </h3>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your first name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your last name"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-secondary-700 mb-2">
                  Service Required
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select a service</option>
                  <option value="residential">Residential Cleaning</option>
                  <option value="commercial">Commercial Cleaning</option>
                  <option value="industrial">Industrial Cleaning</option>
                  <option value="maintenance">Maintenance Services</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us about your project or requirements..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100"
        >
          <h3 className="text-xl md:text-2xl font-bold text-secondary-900 mb-4 md:mb-6 text-center">Visit Our Office</h3>
          <div className="bg-gray-100 rounded-xl overflow-hidden h-64 md:h-80 lg:h-96">
            <iframe
              src={config.map.embedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.5!2d-0.2!3d5.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzYnMDAuMCJOIDDCsDEyJzAwLjAiVw!5e0!3m2!1sen!2sgh!4v1234567890"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Willsther Professional Services Office Location"
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="mt-4 md:mt-6 text-center">
            <p className="text-secondary-600 mb-1 md:mb-2 text-sm md:text-base">
              <strong>Address:</strong> {config.footer.address || 'Mahogany Street, #7 New Achimota, Accra, Ghana'}
            </p>
            <p className="text-secondary-600 text-sm md:text-base">
              <strong>Hours:</strong> Mon-Sat: 8:00am - 5:00pm
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
