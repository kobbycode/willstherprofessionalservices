import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Stats from '@/components/Stats'
import Values from '@/components/Values'
import Testimonials from '@/components/Testimonials'
import Gallery from '@/components/Gallery'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import MaintenanceMode from '@/components/MaintenanceMode'

export default function Home() {
  return (
    <main className="min-h-screen">
      <MaintenanceMode />
      <Header />
      <Hero />
      <About />
      <Services />
      <Stats />
      <Values />
      <Testimonials />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  )
}
