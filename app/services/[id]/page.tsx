'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import MaintenanceMode from '@/components/MaintenanceMode'
import { useSiteConfig } from '@/lib/site-config'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, CheckCircle, Clock } from 'lucide-react'
import Skeleton from '@/components/Skeleton'

interface Service {
    id: string
    title: string
    description: string
    imageUrl: string
    category: string
    features?: string[]
}

export const dynamic = 'force-dynamic'

export default function ServiceDetails() {
    const { config } = useSiteConfig()
    const params = useParams()
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
            <main className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px]">
                <div className="container-custom py-8 md:py-12">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-10 w-2/3" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                        <div className="lg:col-span-2 space-y-5">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-28 w-full" />
                        </div>
                        <div className="lg:col-span-1">
                            <Skeleton className="h-64 w-full" />
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (error || !service) {
        return (
            <main className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px]">
                <div className="container-custom px-4 py-16 text-center">
                    <h1 className="text-xl font-bold text-[#0F172A] mb-3">Service Not Found</h1>
                    <p className="text-[#64748B] text-sm mb-6">{error || "The service you're looking for doesn't exist."}</p>
                    <Link href="/#services" className="inline-block bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all">
                        Back to Services
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px]">

            {/* Hero */}
            <section className="bg-white border-b border-[#E2E8F0] py-10 md:py-14">
                <div className="container-custom px-4">
                    <Link
                        href="/#services"
                        className="inline-flex items-center text-[#64748B] hover:text-[#2563EB] mb-4 text-xs font-semibold uppercase tracking-widest transition-colors group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Services
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-[#2563EB] font-semibold tracking-[0.2em] text-xs mb-2 block">
                            {service.category}
                        </span>
                        <h1 className="text-xl md:text-3xl font-bold text-[#0F172A] leading-tight tracking-tight">
                            {service.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-8 md:py-12">
                <div className="container-custom px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                        {/* Main Content */}
                        <motion.div
                            className="lg:col-span-2 space-y-5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {/* Service Image */}
                            <div className="bg-white shadow-sm border border-[#E2E8F0] overflow-hidden">
                                <div className="aspect-video relative overflow-hidden bg-[#F1F5F9]">
                                    <Image
                                        src={service.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=1200&h=600&fit=crop&crop=center'}
                                        alt={service.title}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                        sizes="(max-width: 1024px) 100vw, 66vw"
                                    />
                                </div>
                            </div>

                            {/* Overview */}
                            <div className="bg-white shadow-sm border border-[#E2E8F0] p-5 md:p-6">
                                <h2 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4">Service Overview</h2>
                                <div className="text-[#475569] text-sm leading-relaxed space-y-3">
                                    {service.description ? (
                                        service.description.split('\n').map((paragraph, idx) => (
                                            <p key={idx}>{paragraph}</p>
                                        ))
                                    ) : (
                                        <p className="text-[#64748B]">No description available.</p>
                                    )}
                                </div>
                            </div>

                            {/* Why Choose Us */}
                            <div className="bg-white shadow-sm border border-[#E2E8F0] p-5 md:p-6">
                                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4">Why Choose Us</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        "Professional & Experienced Team",
                                        "Quality Service Guarantee",
                                        "Timely Execution",
                                        "Competitive Pricing"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                            <CheckCircle className="w-4 h-4 text-[#2563EB] mt-0.5 flex-shrink-0" />
                                            <span className="text-[#475569] text-sm">{item}</span>
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
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="bg-white shadow-sm border border-[#E2E8F0] sticky top-[130px]">
                                <div className="p-4 md:p-5 bg-white border-b border-[#E2E8F0]">
                                    <h3 className="text-sm font-bold text-[#0F172A] mb-1">Book This Service</h3>
                                    <p className="text-[#64748B] text-xs">Get a quote or schedule an appointment today.</p>
                                </div>

                                <div className="p-4 md:p-5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] flex-shrink-0">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[#64748B] text-[11px]">Response Time</p>
                                            <p className="font-semibold text-[#0F172A] text-sm">Within 24 Hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] flex-shrink-0">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[#64748B] text-[11px]">Availability</p>
                                            <p className="font-semibold text-[#0F172A] text-sm">Mon - Sat, 8am - 6pm</p>
                                        </div>
                                    </div>

                                    <hr className="border-[#E2E8F0]" />

                                    <Link
                                        href="/#contact"
                                        className="block w-full text-center bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-semibold py-2.5 px-5 transition-all"
                                    >
                                        Contact Us Now
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    )
}
