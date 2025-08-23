'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Phone, Mail, Menu, X } from 'lucide-react'
import { useSiteConfig } from '@/lib/site-config'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const { config } = useSiteConfig()

  const navigation = useMemo(() => {
    const base = (config?.navigation || []).filter((item) => item.enabled !== false)
    return base
  }, [config])

  const handleNavigation = (item: any) => {
    if (item.isHash) {
      // For hash links, navigate to home page first if not already there
      if (pathname !== '/') {
        router.push('/' + item.href)
      } else {
        // If already on home page, just scroll to section
        const element = document.querySelector(item.href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    } else {
      // For page links, navigate directly
      router.push(item.href)
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Top utility bar - hidden on mobile */}
      <div className="hidden md:block bg-primary-700 text-white py-2">
        <div className="container-custom">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-200" />
                <span className="font-medium">{config.contactPhone || '(233) 594 850 005'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-200" />
                <span className="font-medium">{config.contactEmail || 'willstherprofessionalservices@gmail.com'}</span>
              </div>
            </div>
            <div className="text-primary-200 text-xs">
              Mon-Sat: 8:00am - 5:00pm
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-primary-600">
        <div className="container-custom">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                {!logoError ? (
                  <img 
                    src="/logo.jpg" 
                    alt="Willsther Logo" 
                    className={`w-24 h-12 sm:w-32 sm:h-14 md:w-40 md:h-16 object-cover shadow-lg group-hover:shadow-xl transition-all duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setLogoLoaded(true)}
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="text-white font-bold text-base sm:text-lg md:text-xl bg-primary-700 px-3 py-1 rounded-lg">
                    Willsther
                  </div>
                )}
                {!logoLoaded && !logoError && (
                  <div className="w-24 h-12 sm:w-32 sm:h-14 md:w-40 md:h-16 bg-gray-200 animate-pulse rounded"></div>
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className="px-4 py-2 text-white hover:text-primary-100 font-medium rounded-lg hover:bg-primary-700 transition-all duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                </button>
              ))}
            </nav>

            {/* CTA Button - hidden on mobile */}
            <div className="hidden lg:block">
              <button
                onClick={() => handleNavigation({ href: '#contact', isHash: true })}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Get Quote
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:text-primary-100 hover:bg-primary-700 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-primary-500 bg-primary-600 shadow-lg">
          <div className="container-custom">
            <nav className="py-3 sm:py-4 space-y-1 sm:space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className="block w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white hover:text-primary-100 hover:bg-primary-700 rounded-lg transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-3 sm:pt-4 border-t border-primary-500">
                <button
                  onClick={() => handleNavigation({ href: '#contact', isHash: true })}
                  className="block w-full text-center bg-white hover:bg-primary-50 text-primary-600 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg transition-all duration-300 text-sm sm:text-base"
                >
                  Get Quote
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
