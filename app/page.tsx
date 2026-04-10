'use client'

import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Stats from '@/components/Stats'
import Values from '@/components/Values'
import Testimonials from '@/components/Testimonials'
import Gallery from '@/components/Gallery'
import Contact from '@/components/Contact'
import MaintenanceMode from '@/components/MaintenanceMode'
import { useSiteConfig } from '@/lib/site-config'

export default function Home() {
  const { config } = useSiteConfig()
  
  if (config.maintenanceMode) {
    return (
      <main className="min-h-screen">
        <MaintenanceMode />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Services />
      <Stats />
      <Values />
      <Testimonials />
      <Gallery />
      <Contact />
    </main>
  )
}