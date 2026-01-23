'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, FileText, Users, Wrench } from 'lucide-react'
import Skeleton from '@/components/Skeleton'
import { fetchPosts, type BlogPost } from '@/lib/blog'
import { fetchCategories } from '@/lib/categories'
import { getUserStats } from '@/lib/users'
import { useSiteConfig } from '@/lib/site-config'

interface OverviewTabProps {
    setActiveTab: (tab: string) => void
}

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
                    .slice(0, 5)

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

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                    <p className="text-gray-600 mt-1">Real-time insights and statistics</p>
                </div>
                <div className="text-sm text-gray-500 hidden sm:block">
                    Last updated: {new Date().toLocaleDateString('en-GB')}
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <Skeleton className="h-4 w-1/2 mb-3" />
                            <Skeleton className="h-8 w-1/3" />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Blog Views</p>
                                    <p className="text-2xl font-bold text-blue-600">{formatNumber(analytics.blogStats.totalViews)}</p>
                                </div>
                                <div className="p-3 bg-blue-500 rounded-lg"><BarChart3 className="w-6 h-6 text-white" /></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Published Posts</p>
                                    <p className="text-2xl font-bold text-green-600">{analytics.blogStats.publishedPosts}</p>
                                </div>
                                <div className="p-3 bg-green-500 rounded-lg"><FileText className="w-6 h-6 text-white" /></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                                    <p className="text-2xl font-bold text-purple-600">{analytics.userStats.active}</p>
                                </div>
                                <div className="p-3 bg-purple-500 rounded-lg"><Users className="w-6 h-6 text-white" /></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Services</p>
                                    <p className="text-2xl font-bold text-orange-600">{analytics.siteStats.services}</p>
                                </div>
                                <div className="p-3 bg-orange-500 rounded-lg"><Wrench className="w-6 h-6 text-white" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Statistics</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Total Posts</span>
                                    <span className="text-lg font-bold text-gray-900">{analytics.blogStats.totalPosts}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Published Posts</span>
                                    <span className="text-lg font-bold text-green-600">{analytics.blogStats.publishedPosts}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Draft Posts</span>
                                    <span className="text-lg font-bold text-yellow-600">{analytics.blogStats.draftPosts}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Categories</span>
                                    <span className="text-lg font-bold text-blue-600">{analytics.siteStats.categories}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Posts</h3>
                            <div className="space-y-3">
                                {analytics.popularPosts.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No published posts yet</p>
                                ) : (
                                    analytics.popularPosts.map((post) => (
                                        <div key={post.id} className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600 truncate flex-1">{post.title}</p>
                                            <span className="text-sm font-medium text-gray-900 ml-2">{formatNumber(post.views || 0)} views</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span>Total Users</span><span className="font-bold">{analytics.userStats.total}</span></div>
                                <div className="flex justify-between"><span>Active</span><span className="text-green-600 font-bold">{analytics.userStats.active}</span></div>
                                <div className="flex justify-between"><span>Admins</span><span className="text-red-600 font-bold">{analytics.userStats.admins}</span></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4">Website Content</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span>Hero Slides</span><span className="font-bold">{analytics.siteStats.heroSlides}</span></div>
                                <div className="flex justify-between"><span>Services</span><span className="font-bold">{analytics.siteStats.services}</span></div>
                                <div className="flex justify-between"><span>Categories</span><span className="font-bold">{analytics.siteStats.categories}</span></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4">Performance</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span>Avg. Views/Post</span><span className="font-bold">{analytics.blogStats.publishedPosts > 0 ? Math.round(analytics.blogStats.totalViews / analytics.blogStats.publishedPosts) : 0}</span></div>
                                <div className="flex justify-between"><span>User Activity</span><span className="font-bold">{analytics.userStats.total > 0 ? Math.round((analytics.userStats.active / analytics.userStats.total) * 100) : 0}%</span></div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    )
}
