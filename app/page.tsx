'use client'

import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'
import About from '@/components/About'
import MaintenanceMode from '@/components/MaintenanceMode'
import { useSiteConfig } from '@/lib/site-config'

const Services = dynamic(() => import('@/components/Services'))
const Stats = dynamic(() => import('@/components/Stats'))
const Values = dynamic(() => import('@/components/Values'))
const Testimonials = dynamic(() => import('@/components/Testimonials'))
const Contact = dynamic(() => import('@/components/Contact'))

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
      <Contact />
    </main>
  )
}