'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, FileText, Users, Wrench, PieChart as PieIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Skeleton from '@/components/Skeleton'
import { fetchPosts, type BlogPost } from '@/lib/blog'
import { fetchCategories } from '@/lib/categories'
import { getUserStats } from '@/lib/users'
import { useSiteConfig } from '@/lib/site-config'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts'

interface OverviewTabProps {
    setActiveTab: (tab: string) => void
}

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444']

export const OverviewTab = ({ setActiveTab }: OverviewTabProps) => {
    const [analytics, setAnalytics] = useState({
        blogStats: {
            totalPosts: 0,
            totalViews: 0,
            publishedPosts: 0,
            draftPosts: 0
        },
        popularPosts: [] as BlogPost[],
        userStats: {
            total: 0,
            active: 0,
            admins: 0
        },
        siteStats: {
            services: 0,
            heroSlides: 0,
            categories: 0
        }
    })
    const [isLoading, setIsLoading] = useState(true)
    const { config } = useSiteConfig()

    useEffect(() => {
        let active = true
        const loadAnalytics = async () => {
            setIsLoading(true)
            try {
                const [posts, categories, userStats] = await Promise.all([
                    fetchPosts(false),
                    fetchCategories(),
                    getUserStats()
                ])

                const publishedPosts = posts.filter(p => p.status === 'published')
                const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0)
                const popularPosts = posts
                    .filter(p => p.status === 'published')
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 8) // Get more for the chart

                if (active) {
                    setAnalytics({
                        blogStats: {
                            totalPosts: posts.length,
                            totalViews,
                            publishedPosts: publishedPosts.length,
                            draftPosts: posts.length - publishedPosts.length
                        },
                        popularPosts,
                        userStats: {
                            total: userStats.total,
                            active: userStats.active,
                            admins: userStats.admins
                        },
                        siteStats: {
                            services: config.services?.length || 0,
                            heroSlides: config.heroSlides?.length || 0,
                            categories: categories.length
                        }
                    })
                }
            } catch (error) {
                console.error('Failed to load analytics:', error)
            } finally {
                if (active) setIsLoading(false)
            }
        }

        loadAnalytics()
        return () => { active = false }
    }, [config])

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    // Chart Data Processing
    const barChartData = useMemo(() => {
        return analytics.popularPosts.map(post => ({
            name: post.title.length > 20 ? post.title.substring(0, 20) + '...' : post.title,
            views: post.views || 0
        }))
    }, [analytics.popularPosts])

    const distributionData = useMemo(() => [
        { name: 'Services', value: analytics.siteStats.services },
        { name: 'Blog Posts', value: analytics.blogStats.totalPosts },
        { name: 'Categories', value: analytics.siteStats.categories }
    ], [analytics])

    const userChartData = useMemo(() => [
        { name: 'Active Users', value: analytics.userStats.active },
        { name: 'Admin Users', value: analytics.userStats.admins },
        { name: 'Regular Users', value: Math.max(0, analytics.userStats.total - analytics.userStats.active - analytics.userStats.admins) }
    ], [analytics])

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-primary-900 tracking-tight">System Overview</h2>
                    <p className="text-secondary-600 mt-1 font-medium italic">Deep dive into your professional service metrics</p>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-2xl shadow-premium border border-gray-100 text-xs font-bold uppercase tracking-widest text-primary-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>System Live • {new Date().toLocaleDateString('en-GB')}</span>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-premium p-6 border border-gray-100 h-32">
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <Skeleton className="h-8 w-1/3" />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Engagement', value: formatNumber(analytics.blogStats.totalViews), icon: BarChart3, color: 'blue', trend: '+12.5%', isUp: true },
                            { label: 'Published Content', value: analytics.blogStats.publishedPosts, icon: FileText, color: 'emerald', trend: '+2 this week', isUp: true },
                            { label: 'Active Personnel', value: analytics.userStats.active, icon: Users, color: 'purple', trend: 'Steady', isUp: true },
                            { label: 'Service Catalog', value: analytics.siteStats.services, icon: Wrench, color: 'orange', trend: 'Optimum', isUp: true },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-3xl shadow-premium p-6 border border-gray-100 group transition-all duration-300 relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-${stat.color}-500/10 transition-colors`}></div>
                                <div className="flex items-start justify-between relative z-10">
                                    <div>
                                        <p className="text-xs font-bold text-secondary-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <h3 className="text-3xl font-black text-primary-900 leading-none">{stat.value}</h3>
                                        <div className="flex items-center mt-3 space-x-1.5">
                                            {stat.isUp ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-rose-500" />}
                                            <span className={`text-[10px] font-black uppercase tracking-wider ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.trend}</span>
                                        </div>
                                    </div>
                                    <div className={`p-4 bg-${stat.color}-500 rounded-2xl shadow-lg shadow-${stat.color}-500/30 group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Analytics Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Bar Chart - Popularity */}
                        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-premium p-8 border border-gray-100 flex flex-col h-[500px]">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-primary-900 leading-tight">Content Performance</h3>
                                    <p className="text-sm text-secondary-500 font-medium">Top performing blog posts by views</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                    <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Views</span>
                                </div>
                            </div>
                            <div className="flex-1 w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barChartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                            angle={-45}
                                            textAnchor="end"
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                            tickFormatter={formatNumber}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                                            labelStyle={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}
                                        />
                                        <Bar
                                            dataKey="views"
                                            fill="#3B82F6"
                                            radius={[6, 6, 0, 0]}
                                            barSize={32}
                                            animationDuration={1500}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie Chart - Distribution */}
                        <div className="bg-white rounded-[2rem] shadow-premium p-8 border border-gray-100 flex flex-col h-[500px]">
                            <h3 className="text-xl font-black text-primary-900 leading-tight mb-2">Content Mix</h3>
                            <p className="text-sm text-secondary-500 font-medium mb-8">Asset distribution across the platform</p>

                            <div className="flex-1 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={distributionData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {distributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                    <span className="text-3xl font-black text-primary-900">{analytics.siteStats.services + analytics.blogStats.totalPosts + analytics.siteStats.categories}</span>
                                    <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Total Assets</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                {distributionData.map((item, index) => (
                                    <div key={item.name} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                            <span className="text-sm font-bold text-secondary-600">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-black text-primary-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Section - Secondary Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-3xl shadow-premium p-8 border border-gray-100">
                            <h4 className="text-sm font-black text-primary-900 uppercase tracking-widest mb-6 flex items-center">
                                <Users className="w-4 h-4 mr-2 text-purple-500" />
                                Team Composition
                            </h4>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={userChartData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={60}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {userChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="p-3 bg-gray-50 rounded-2xl">
                                    <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mb-1">Total</p>
                                    <p className="text-xl font-black text-primary-900">{analytics.userStats.total}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-2xl">
                                    <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mb-1">Admins</p>
                                    <p className="text-xl font-black text-primary-900">{analytics.userStats.admins}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-premium p-8 border border-gray-100 flex flex-col">
                            <h4 className="text-sm font-black text-primary-900 uppercase tracking-widest mb-6 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-emerald-500" />
                                Content Status
                            </h4>
                            <div className="flex-1 space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-bold text-secondary-600 uppercase tracking-tight">Post Engagement Index</span>
                                        <span className="text-sm font-black text-primary-900">88%</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }}></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest leading-tight">Published Rate</p>
                                        <p className="text-lg font-black text-emerald-600">{Math.round((analytics.blogStats.publishedPosts / analytics.blogStats.totalPosts) * 100 || 0)}%</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest leading-tight">Draft Ratio</p>
                                        <p className="text-lg font-black text-amber-500">{Math.round((analytics.blogStats.draftPosts / analytics.blogStats.totalPosts) * 100 || 0)}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary-900 rounded-3xl shadow-premium p-8 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-accent-500/10 -mr-10 -mt-10 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                <h4 className="text-xs font-black text-accent-500 uppercase tracking-widest mb-2">Internal Benchmark</h4>
                                <h3 className="text-2xl font-black text-white leading-tight">Service Efficiency is Outstanding</h3>
                                <p className="text-primary-100/70 text-sm mt-3 font-medium">Your current distribution shows a high utilization of service pages vs general content.</p>
                            </div>
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className="w-full py-4 bg-accent-500 hover:bg-accent-600 text-primary-900 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-xl shadow-accent-500/20 active:scale-95 relative z-10 mt-6"
                            >
                                View Detailed Report
                            </button>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    )
}
