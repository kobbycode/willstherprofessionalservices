'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSiteConfig } from '@/lib/site-config'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { config } = useSiteConfig()

  return (
    <footer className="bg-[#0F172A]">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-14">
          {/* BRAND */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#2563EB] flex items-center justify-center">
                <span className="text-white text-base font-bold">W</span>
              </div>
              <span className="text-base font-bold text-white">WILLSTHER</span>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-6 max-w-sm">
              Elevating the standard of real estate and property management through excellence, integrity, and innovation. Your trusted partner in premier property solutions.
            </p>
            <div className="flex gap-2">
              {[
                { icon: <Facebook className="w-3.5 h-3.5" />, href: config.footer.social?.facebook || '#' },
                { icon: <Instagram className="w-3.5 h-3.5" />, href: config.footer.social?.instagram || 'https://www.instagram.com/willstherprofessionalservices?utm_source=qr&igsh=bG04azZsODFmOGN5' },
                { icon: <Twitter className="w-3.5 h-3.5" />, href: config.footer.social?.twitter || 'https://x.com/willsther' },
                { icon: <Linkedin className="w-3.5 h-3.5" />, href: config.footer.social?.linkedin || '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-9 h-9 bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Our Services', href: '/#services' },
                { name: 'Gallery', href: '/gallery' },
                { name: 'Shop', href: '/shop' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#94A3B8] hover:text-white text-sm transition-all duration-300 flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3 text-[#2563EB]" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SERVICES */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Our Services</h4>
            <ul className="grid grid-cols-1 gap-3">
              {(config.footer.links?.services || [
                { name: 'Fumigation', href: '#services' },
                { name: 'Laundry', href: '#services' },
                { name: 'Residential Cleaning', href: '#services' },
                { name: 'Commercial Cleaning', href: '#services' },
                { name: 'Industrial Cleaning', href: '#services' },
                { name: 'Maintenance Services', href: '#services' },
              ]).map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#94A3B8] hover:text-white text-sm transition-all duration-300 flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3 text-[#2563EB]" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Newsletter</h4>
            <p className="text-[#94A3B8] text-sm mb-4 leading-relaxed">
              Join our exclusive list for the latest property updates and real estate insights.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[#2563EB] text-white placeholder:text-[#64748B] transition-all"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300"
              >
                Join
              </button>
            </form>
            <div className="mt-6 flex gap-3">
              <a
                href={`mailto:${config.contactEmail || 'willstherprofessionalservices@gmail.com'}`}
                className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all duration-300"
                title="Email us"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:${config.contactPhone?.split(' / ')[0] || '0594850005'}`}
                className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all duration-300"
                title="Call us"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#64748B]">
            {config.footer.copyright || `© ${currentYear} WILLSTHER. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
