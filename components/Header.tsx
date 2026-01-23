'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Phone, Mail, Menu, X, ShoppingBag, Heart } from 'lucide-react'
import { useSiteConfig } from '@/lib/site-config'
import { useShop } from '@/context/ShopContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const { cartCount, setIsCartOpen } = useShop()

  const { config } = useSiteConfig()

  const navigation = useMemo(() => {
    const base = (config?.navigation || []).filter((item) => item.enabled !== false)
    return base
  }, [config])

  // Function to check if a navigation item is active
  const isActive = (item: any) => {
    if (item.isHash) {
      // For hash links on the homepage, check if the section is active
      if (pathname === '/') {
        return activeSection === item.href.substring(1) // Remove the # prefix
      }
      return false
    }
    // For page links, check if the current path matches
    return pathname === item.href
  }

  // Detect which section is currently in view
  useEffect(() => {
    if (pathname !== '/') return

    const sections = ['home', 'about', 'services', 'contact']
    let currentSection = 'home'

    const checkSection = () => {
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = section
            break
          }
        }
      }

      setActiveSection(currentSection)
    }

    // Check on scroll and resize
    window.addEventListener('scroll', checkSection)
    window.addEventListener('resize', checkSection)

    // Initial check
    checkSection()

    return () => {
      window.removeEventListener('scroll', checkSection)
      window.removeEventListener('resize', checkSection)
    }
  }, [pathname])

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
    }
    // For page links, we're using Link components which handle navigation directly
    // Just close the mobile menu if it's open
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
                <img
                  src="/logo-v2.jpg"
                  alt="Willsther Logo"
                  className="w-24 h-12 sm:w-32 sm:h-14 md:w-40 md:h-16 object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                item.isHash ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item)}
                    className={`px-4 py-2 text-white hover:text-primary-100 font-medium rounded-lg hover:bg-primary-700 transition-all duration-200 relative group ${isActive(item) ? 'underline underline-offset-4' : ''
                      }`}
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 text-white hover:text-primary-100 font-medium rounded-lg hover:bg-primary-700 transition-all duration-200 relative group ${isActive(item) ? 'underline underline-offset-4' : ''
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                  </Link>
                )
              ))}
            </nav>

            {/* CTA Buttons - hidden on mobile */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-white hover:bg-primary-700 rounded-lg transition-colors group"
                aria-label="Open cart"
              >
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-primary-600">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavigation({ href: '#contact', isHash: true })}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Get Quote
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-white hover:bg-primary-700 rounded-lg transition-colors relative"
              >
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-primary-600">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-white hover:text-primary-100 hover:bg-primary-700 transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-primary-500 bg-primary-600 shadow-lg">
          <div className="container-custom">
            <nav className="py-3 sm:py-4 space-y-1 sm:space-y-2">
              {navigation.map((item) => (
                item.isHash ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item)}
                    className={`block w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white hover:text-primary-100 hover:bg-primary-700 rounded-lg transition-colors duration-200 ${isActive(item) ? 'underline underline-offset-4' : ''
                      }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white hover:text-primary-100 hover:bg-primary-700 rounded-lg transition-colors duration-200 ${isActive(item) ? 'underline underline-offset-4' : ''
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
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