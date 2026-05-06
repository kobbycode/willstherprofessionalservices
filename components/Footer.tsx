'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSiteConfig } from '@/lib/site-config'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { config } = useSiteConfig()

  return (
    <footer className="bg-[#0A0F1C] border-t border-white/5 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="container-custom relative z-10 py-16 sm:py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <span className="text-white text-lg md:text-xl font-black italic">W</span>
              </div>
              <span className="text-xl font-bold font-outfit tracking-tighter text-white">
                WILLSTHER
              </span>
            </div>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 font-medium max-w-sm">
              Elevating the standard of real estate and property management through excellence, integrity, and innovation. Your trusted partner in premier property solutions.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Facebook className="w-4 h-4" />, href: config.footer.social?.facebook || "#", color: "hover:text-[#1877F2] hover:border-[#1877F2]" },
                { icon: <Instagram className="w-4 h-4" />, href: config.footer.social?.instagram || "https://www.instagram.com/willstherprofessionalservices?utm_source=qr&igsh=bG04azZsODFmOGN5", color: "hover:text-[#E4405F] hover:border-[#E4405F]" },
                { icon: <Twitter className="w-4 h-4" />, href: config.footer.social?.twitter || "https://x.com/willsther", color: "hover:text-[#1DA1F2] hover:border-[#1DA1F2]" },
                { icon: <Linkedin className="w-4 h-4" />, href: config.footer.social?.linkedin || "#", color: "hover:text-[#0A66C2] hover:border-[#0A66C2]" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/40 transition-all duration-300 ${social.color} hover:-translate-y-1 hover:bg-white/10`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="lg:col-span-2">
            <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-[0.2em] mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Our Services", href: "/#services" },
                { name: "Gallery", href: "/gallery" },
                { name: "Shop", href: "/shop" }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-primary-400 text-sm sm:text-base transition-all duration-300 flex items-center group font-medium"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="lg:col-span-3">
            <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-[0.2em] mb-8">Our Services</h4>
            <ul className="grid grid-cols-1 gap-4">
              {(config.footer.links?.services || [
                { name: 'Our services', href: '/#services' },
                { name: 'Fumigation', href: '#services' },
                { name: 'Laundry', href: '#services' },
                { name: 'Residential Cleaning', href: '#services' },
                { name: 'Commercial Cleaning', href: '#services' },
                { name: 'Industrial Cleaning', href: '#services' },
                { name: 'Maintenance Services', href: '#services' }
              ]).map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-primary-400 text-sm sm:text-base transition-all duration-300 flex items-center group font-medium"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3 - Newsletter Section */}
          <div className="lg:col-span-3">
            <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-[0.2em] mb-8">Newsletter</h4>
            <p className="text-white/60 text-sm sm:text-base mb-6 leading-relaxed font-medium">
              Join our exclusive list for the latest property updates and real estate insights.
            </p>
            <form className="relative group">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all duration-300 text-white placeholder:text-white/30"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-all duration-300 text-[12px] sm:text-sm font-bold uppercase tracking-wider"
              >
                Join
              </button>
            </form>
            
            {/* Contact Details below newsletter on mobile, side by side on desktop? No, let's keep it simple. */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-white/60 text-sm sm:text-base font-medium">
                <Mail className="w-4 h-4 text-primary-400" />
                <a href={`mailto:${config.contactEmail || "willstherprofessionalservices@gmail.com"}`} className="hover:text-primary-400 transition-colors">
                  {config.contactEmail || "willstherprofessionalservices@gmail.com"}
                </a>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm sm:text-base font-medium">
                <Phone className="w-4 h-4 text-primary-400" />
                <a href={`tel:${config.contactPhone?.split(' / ')[0] || "0594850005"}`} className="hover:text-primary-400 transition-colors">
                  {config.contactPhone === "0208267704" ? "0594850005 / 0208267704" : (config.contactPhone || "0594850005 / 0208267704")}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[12px] sm:text-sm text-white/40 font-medium order-2 md:order-1">
            © {currentYear} WILLSTHER. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
