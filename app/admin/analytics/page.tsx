'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  TrendingUp,
  Users,
  FileText,
  Eye,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Settings,
  Clock,
  Star,
  Target,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { fetchPosts } from '@/lib/blog'
import { fetchCategories } from '@/lib/categories'
import { fetchUsers, getUserStats } from '@/lib/users'
import { useSiteConfig } from '@/lib/site-config'
import AdminHeader from '@/components/AdminHeader'

interface AnalyticsData {
  blogStats: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalViews: number
    avgViewsPerPost: number
    categories: number
  }
  userStats: {
    total: number
    active: number
    inactive: number
    pending: number
    admins: number
    editors: number
    regularUsers: number
  }
  siteStats: {
    heroSlides: number
    services: number
    categories: number
  }
  popularPosts: Array<{
    id: string
    title: string
    views: number
    category: string
    publishedAt: string
  }>
  recentActivity: Array<{
    type: 'post' | 'user' | 'category'
    action: string
    title: string
    time: string
  }>
  performance: {
    publishRate: number
    userActivityRate: number
    avgViewsPerPost: number
    topCategory: string
  }
}

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const { config } = useSiteConfig()

  // Fallback config in case useSiteConfig fails - moved outside component to prevent recreation
  const fallbackConfig = useMemo(() => ({
    hero: { slides: [] },
    services: []
  }), [])

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true)

      // Add a timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        console.warn('Analytics loading timeout - setting default data')
        const defaultAnalytics: AnalyticsData = {
          blogStats: {
            totalPosts: 0,
            publishedPosts: 0,
            draftPosts: 0,
            totalViews: 0,
            avgViewsPerPost: 0,
            categories: 0
          },
          userStats: {
            total: 0,
            active: 0,
            inactive: 0,
            pending: 0,
            admins: 0,
            editors: 0,
            regularUsers: 0
          },
          siteStats: {
            heroSlides: 0,
            services: 0,
            categories: 0
          },
          popularPosts: [],
          recentActivity: [],
          performance: {
            publishRate: 0,
            userActivityRate: 0,
            avgViewsPerPost: 0,
            topCategory: 'None'
          }
        }
        setAnalytics(defaultAnalytics)
        setIsLoading(false)
      }, 10000) // 10 second timeout

      try {
        console.log('Loading analytics data...')

        // Fetch all data with individual error handling
        let posts: any[] = []
        let categories: string[] = []
        let users: any[] = []
        let userStats = { total: 0, active: 0, inactive: 0, pending: 0, admins: 0, editors: 0, users: 0 }

        try {
          posts = await fetchPosts(false) // Get all posts including drafts
          console.log('Posts loaded:', posts.length)
        } catch (error) {
          console.error('Error loading posts:', error)
          posts = []
        }

        try {
          categories = await fetchCategories()
          console.log('Categories loaded:', categories.length)
        } catch (error) {
          console.error('Error loading categories:', error)
          categories = []
        }

        try {
          users = await fetchUsers()
          console.log('Users loaded:', users.length)
        } catch (error) {
          console.error('Error loading users:', error)
          users = []
        }

        try {
          userStats = await getUserStats()
          console.log('User stats loaded:', userStats)
        } catch (error) {
          console.error('Error loading user stats:', error)
          userStats = { total: 0, active: 0, inactive: 0, pending: 0, admins: 0, editors: 0, users: 0 }
        }

        // Calculate blog statistics
        const publishedPosts = posts.filter(post => post.status === 'published')
        const draftPosts = posts.filter(post => post.status === 'draft')
        const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0)
        const avgViewsPerPost = publishedPosts.length > 0 ? Math.round(totalViews / publishedPosts.length) : 0

        // Calculate site statistics
        const currentConfig = config || fallbackConfig
        const siteStats = {
          heroSlides: (currentConfig as any)?.hero?.slides?.length || 0,
          services: currentConfig?.services?.length || 0,
          categories: categories.length
        }

        // Get popular posts (top 5 by views)
        const popularPosts = posts
          .filter(post => post.status === 'published')
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map(post => ({
            id: post.id,
            title: post.title,
            views: post.views || 0,
            category: post.category || 'Uncategorized',
            publishedAt: post.publishedAt || post.createdAt || ''
          }))

        // Generate recent activity (simulated based on data)
        const recentActivity = [
          ...publishedPosts.slice(0, 3).map(post => ({
            type: 'post' as const,
            action: 'Published',
            title: post.title,
            time: post.publishedAt || post.createdAt || ''
          })),
          ...users.slice(0, 2).map(user => ({
            type: 'user' as const,
            action: 'Joined',
            title: user.name,
            time: user.createdAt || ''
          }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .slice(0, 5)

        // Calculate performance metrics
        const publishRate = posts.length > 0 ? Math.round((publishedPosts.length / posts.length) * 100) : 0
        const userActivityRate = userStats.total > 0 ? Math.round((userStats.active / userStats.total) * 100) : 0

        // Find top category
        const categoryCounts = publishedPosts.reduce((acc, post) => {
          const category = post.category || 'Uncategorized'
          acc[category] = (acc[category] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        const topCategory = Object.entries(categoryCounts)
          .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 'None'

        const analyticsData: AnalyticsData = {
          blogStats: {
            totalPosts: posts.length,
            publishedPosts: publishedPosts.length,
            draftPosts: draftPosts.length,
            totalViews,
            avgViewsPerPost,
            categories: categories.length
          },
          userStats: {
            total: userStats.total,
            active: userStats.active,
            inactive: userStats.inactive,
            pending: userStats.pending,
            admins: userStats.admins,
            editors: userStats.editors,
            regularUsers: userStats.users
          },
          siteStats,
          popularPosts,
          recentActivity,
          performance: {
            publishRate,
            userActivityRate,
            avgViewsPerPost,
            topCategory
          }
        }

        console.log('Analytics data created:', analyticsData)
        clearTimeout(timeoutId) // Clear the timeout
        setAnalytics(analyticsData)
      } catch (error) {
        console.error('Error loading analytics:', error)
        clearTimeout(timeoutId) // Clear the timeout
        // Set default analytics data even if there's an error
        const defaultAnalytics: AnalyticsData = {
          blogStats: {
            totalPosts: 0,
            publishedPosts: 0,
            draftPosts: 0,
            totalViews: 0,
            avgViewsPerPost: 0,
            categories: 0
          },
          userStats: {
            total: 0,
            active: 0,
            inactive: 0,
            pending: 0,
            admins: 0,
            editors: 0,
            regularUsers: 0
          },
          siteStats: {
            heroSlides: 0,
            services: 0,
            categories: 0
          },
          popularPosts: [],
          recentActivity: [],
          performance: {
            publishRate: 0,
            userActivityRate: 0,
            avgViewsPerPost: 0,
            topCategory: 'None'
          }
        }
        setAnalytics(defaultAnalytics)
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalytics()
  }, [timeRange]) // Removed config and fallbackConfig to prevent infinite loops

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString('en-GB')
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post': return <FileText className="w-4 h-4" />
      case 'user': return <Users className="w-4 h-4" />
      case 'category': return <BarChart3 className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-4">Loading analytics...</p>
          <p className="text-sm text-gray-500 mb-4">If this takes too long, there might be a Firebase connection issue.</p>
          <Link href="/admin" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Back to Admin
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        title="Analytics Dashboard"
        subtitle="Real-time insights and performance metrics"
        backLink="/admin"
        backLabel="Back to Admin"
        actions={
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-1.5 bg-white/5 border border-white/20 rounded-lg text-primary-100 text-xs font-bold uppercase tracking-wider focus:ring-2 focus:ring-accent-500 focus:border-accent-500 backdrop-blur-md outline-none"
          >
            <option value="7d" className="bg-primary-900">Last 7 days</option>
            <option value="30d" className="bg-primary-900">Last 30 days</option>
            <option value="90d" className="bg-primary-900">Last 90 days</option>
            <option value="1y" className="bg-primary-900">Last year</option>
          </select>
        }
      />

      <div className="container-custom px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.blogStats.totalViews)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span>+12% from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published Posts</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.blogStats.publishedPosts}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-blue-500 mr-1" />
                <span>{analytics.performance.publishRate}% publish rate</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.userStats.active}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <Activity className="w-4 h-4 text-green-500 mr-1" />
                <span>{analytics.performance.userActivityRate}% activity rate</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.siteStats.services}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <Globe className="w-4 h-4 text-blue-500 mr-1" />
                <span>Website content</span>
              </div>
            </div>
          </motion.div>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Blog Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Blog Statistics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Total Posts</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.blogStats.totalPosts}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Eye className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Avg. Views per Post</p>
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.blogStats.avgViewsPerPost)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BarChart3 className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Categories</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.blogStats.categories}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Target className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Published</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.blogStats.publishedPosts}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Drafts</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.blogStats.draftPosts}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Star className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Top Category</p>
                        <p className="text-lg font-bold text-gray-900">{analytics.performance.topCategory}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* User Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                User Statistics
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Total Users</span>
                  <span className="text-lg font-bold text-gray-900">{analytics.userStats.total}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Active</span>
                  <span className="text-lg font-bold text-green-600">{analytics.userStats.active}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Pending</span>
                  <span className="text-lg font-bold text-yellow-600">{analytics.userStats.pending}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Inactive</span>
                  <span className="text-lg font-bold text-red-600">{analytics.userStats.inactive}</span>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">User Roles</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Admins</span>
                      <span className="text-sm font-medium text-red-600">{analytics.userStats.admins}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Editors</span>
                      <span className="text-sm font-medium text-blue-600">{analytics.userStats.editors}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Regular Users</span>
                      <span className="text-sm font-medium text-gray-600">{analytics.userStats.regularUsers}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Popular Posts & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Popular Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Popular Posts
              </h2>

              <div className="space-y-4">
                {analytics.popularPosts.length > 0 ? (
                  analytics.popularPosts.map((post, index) => (
                    <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                          <p className="text-xs text-gray-600">{post.category} • {formatDate(post.publishedAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatNumber(post.views)}</p>
                        <p className="text-xs text-gray-600">views</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No published posts yet</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </h2>

              <div className="space-y-4">
                {analytics.recentActivity.length > 0 ? (
                  analytics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-600 truncate">{activity.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{formatDate(activity.time)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Performance Metrics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Publish Rate</h3>
                <p className="text-3xl font-bold text-blue-600">{analytics.performance.publishRate}%</p>
                <p className="text-sm text-gray-600 mt-2">of posts are published</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">User Activity</h3>
                <p className="text-3xl font-bold text-green-600">{analytics.performance.userActivityRate}%</p>
                <p className="text-sm text-gray-600 mt-2">of users are active</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg. Views</h3>
                <p className="text-3xl font-bold text-purple-600">{formatNumber(analytics.performance.avgViewsPerPost)}</p>
                <p className="text-sm text-gray-600 mt-2">per published post</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
