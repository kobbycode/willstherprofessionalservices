'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { useSiteConfig } from '@/lib/site-config'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { config } = useSiteConfig()

  const footerLinks = {
    services: config.footer.links?.services || [
      { name: 'Residential Cleaning', href: '#services' },
      { name: 'Commercial Cleaning', href: '#services' },
      { name: 'Industrial Cleaning', href: '#services' },
      { name: 'Maintenance Services', href: '#services' }
    ],
    company: config.footer.links?.company || [
      { name: 'About Us', href: '#about' },
      { name: 'Our Team', href: '#about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '#contact' }
    ],
    support: config.footer.links?.support || [
      { name: 'Help Center', href: '#' },
      { name: 'Service Areas', href: '#' },
      { name: 'FAQs', href: '#' },
      { name: 'Support', href: '#' }
    ]
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ]

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-custom py-12 md:py-16 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8 mb-8 md:mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-primary-400 mb-2">
                Willsther
              </h3>
              <p className="text-secondary-300 font-medium text-sm md:text-base">
                Professional Services
              </p>
            </div>
            <p className="text-secondary-300 text-sm md:text-base mb-4 md:mb-6 leading-relaxed">
              {config.footer.description || 'Professional maintenance, refurbishment, and cleaning services for industrial, commercial, and domestic properties.'}
            </p>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center space-x-2 md:space-x-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary-400" />
                <span className="text-secondary-300 text-sm md:text-base">{config.contactPhone || '(233) 594 850 005'}</span>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary-400" />
                <span className="text-secondary-300 text-sm md:text-base">{config.contactEmail || 'willstherprofessionalservices@gmail.com'}</span>
              </div>
              <div className="flex items-start space-x-2 md:space-x-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary-400 mt-0.5" />
                <span className="text-secondary-300 text-sm md:text-base">
                  {config.footer.address || 'Mahogany Street, #7 New Achimota, Accra, Ghana'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Our Services</h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm md:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Company</h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm md:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Support</h4>
            <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm md:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h5 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Follow Us</h5>
            <div className="flex space-x-3 md:space-x-4">
              {[
                { icon: Facebook, href: config.footer.social?.facebook || '#', label: 'Facebook' },
                { icon: Twitter, href: config.footer.social?.twitter || '#', label: 'Twitter' },
                { icon: Instagram, href: config.footer.social?.instagram || '#', label: 'Instagram' },
                { icon: Linkedin, href: config.footer.social?.linkedin || '#', label: 'LinkedIn' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="w-8 h-8 md:w-10 md:h-10 bg-secondary-700 hover:bg-primary-600 rounded-lg flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-secondary-700 pt-6 md:pt-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-secondary-400 text-sm md:text-base text-center sm:text-left">
              {config.footer.copyright || `© ${currentYear} Willsther Professional Services. All rights reserved.`}
            </p>
            <div className="flex items-center space-x-6 text-sm md:text-base">
              <Link href={config.footer.privacyPolicy || "#"} className="text-secondary-400 hover:text-primary-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href={config.footer.termsOfService || "#"} className="text-secondary-400 hover:text-primary-400 transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
