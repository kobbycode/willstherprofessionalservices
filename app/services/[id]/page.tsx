'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MaintenanceMode from '@/components/MaintenanceMode'
import { useSiteConfig } from '@/lib/site-config'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, CheckCircle, Clock } from 'lucide-react'
import Skeleton from '@/components/Skeleton'

// Define interface for Service
interface Service {
    id: string
    title: string
    description: string
    imageUrl: string
    category: string
    features?: string[]
}

export default function ServiceDetails() {
    const { config } = useSiteConfig()
    const params = useParams()
    const router = useRouter()
    const [service, setService] = useState<Service | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchService = async () => {
            if (!params || !params.id) return

            try {
                const res = await fetch(`/api/services/${params.id}`)

                if (!res.ok) {
                    if (res.status === 404) throw new Error('Service not found')
                    throw new Error('Failed to fetch service details')
                }

                const data = await res.json()
                setService(data.service)
            } catch (err) {
                console.error(err)
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchService()
    }, [params])

    if (config.maintenanceMode) {
        return (
            <main className="min-h-screen">
                <MaintenanceMode />
            </main>
        )
    }

    if (loading) {
        return (
            <main className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                {/* Skeleton Hero */}
                <div className="relative py-20 bg-primary-900 border-b border-white/10">
                    <div className="container-custom px-4 relative z-10 space-y-4">
                        <Skeleton className="h-6 w-32 bg-white/20" />
                        <Skeleton className="h-6 w-24 bg-white/20 rounded-full" />
                        <Skeleton className="h-12 w-3/4 bg-white/20" />
                    </div>
                </div>

                {/* Skeleton Content */}
                <div className="py-16 md:py-24 flex-1">
                    <div className="container-custom px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                                    <Skeleton className="h-8 w-48" />
                                    <div className="space-y-3">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-4">
                                    <Skeleton className="h-7 w-40" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="flex gap-3">
                                                <Skeleton className="w-5 h-5 rounded-full" />
                                                <Skeleton className="h-5 flex-1" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden space-y-6 p-6">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        )
    }

    if (error || !service) {
        return (
            <main className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 container-custom px-4 py-20 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
                    <p className="text-gray-600 mb-8">{error || "The service you're looking for doesn't exist."}</p>
                    <Link href="/#services" className="btn-primary">
                        Back to Services
                    </Link>
                </div>
                <Footer />
            </main>
        )
    }

    return (
        <main className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            {/* Hero Banner */}
            <section className="relative py-20 bg-secondary-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={service.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=1200&h=600&fit=crop&crop=center'}
                        alt={service.title}
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 to-secondary-900/70"></div>
                </div>

                <div className="container-custom px-4 relative z-10">
                    <Link
                        href="/#services"
                        className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Services
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-primary-600/30 border border-primary-500/50 text-primary-300 text-sm font-medium mb-4">
                            {service.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                            {service.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 md:py-24">
                <div className="container-custom px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Main Content */}
                        <motion.div
                            className="lg:col-span-2 space-y-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Overview</h2>
                                <div className="prose prose-lg max-w-none text-gray-600">
                                    {service.description ? (
                                        service.description.split('\n').map((paragraph, idx) => (
                                            <p key={idx} className="mb-4 last:mb-0">
                                                {paragraph}
                                            </p>
                                        ))
                                    ) : (
                                        <p>No description available.</p>
                                    )}
                                </div>
                            </div>

                            {/* Display features if we had them in the database, currently placeholders or derived */}
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Why Choose Us</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        "Professional & Experienced Team",
                                        "Quality Service Guarantee",
                                        "Timely Execution",
                                        "Competitive Pricing"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-primary-600 mt-1 mr-3 flex-shrink-0" />
                                            <span className="text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Sidebar */}
                        <motion.div
                            className="lg:col-span-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
                                <div className="p-6 bg-secondary-900 text-white">
                                    <h3 className="text-xl font-bold mb-2">Book This Service</h3>
                                    <p className="text-gray-300 text-sm">Get a quote or schedule an appointment today.</p>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="flex items-center text-gray-700">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4 text-primary-600">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Response Time</p>
                                            <p className="font-semibold">Within 24 Hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-gray-700">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4 text-primary-600">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Availability</p>
                                            <p className="font-semibold">Mon - Sat, 8am - 6pm</p>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100" />

                                    <Link
                                        href="/#contact"
                                        className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-primary-600/20"
                                    >
                                        Contact Us Now
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
