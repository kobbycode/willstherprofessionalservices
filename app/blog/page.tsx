'use client'

import { Calendar, Clock, User, ArrowLeft, Search, Tag, Filter, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { fetchPosts, type BlogPost } from '@/lib/blog'
import { formatDateHuman } from '@/lib/date'
import Image from 'next/image'

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState('date') // date, readTime, title

  const [categories, setCategories] = useState<string[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])

  // Memoize filtered and sorted posts for better performance
  const { filteredPosts, sortedPosts } = useMemo(() => {
    const filtered = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

    const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'readTime':
        return parseInt(a.readTime) - parseInt(b.readTime)
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

    return { filteredPosts: filtered, sortedPosts: sorted }
  }, [blogPosts, activeCategory, searchQuery, sortBy])

  // Memoize the load function to prevent unnecessary re-renders
  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Fetch posts and categories in parallel
      const [posts, categoriesData] = await Promise.all([
        fetchPosts(true, 100),
        import('@/lib/categories').then(m => m.fetchCategories())
      ])
      
      // Filter to only show published posts
      const publishedPosts = posts.filter(post => post.status === 'published')
      setBlogPosts(publishedPosts)
      
      // Set categories with 'All' as first option
      setCategories(['All', ...categoriesData])
      
      // Set initial active category to 'All' if not already set
      if (activeCategory === '') {
        setActiveCategory('All')
      }
    } catch (error) {
      console.error('Failed to load blog data:', error)
      // Fallback to default categories if fetch fails
      setCategories(['All', 'Residential Cleaning', 'Commercial Cleaning', 'Industrial Cleaning', 'Green Cleaning', 'Post-Construction', 'Fabric Care'])
    } finally {
      setIsLoading(false)
    }
  }, [activeCategory])

  useEffect(() => {
    let isMounted = true
    
    const load = async () => {
      await loadData()
      if (!isMounted) return
    }
    
    load()
    
    return () => {
      isMounted = false
    }
  }, [loadData])

  // Memoize search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  // Memoize category change handler
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category)
  }, [])

  // Memoize sort change handler
  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Safe Area Container */}
      <div className="pt-20">
        {/* Blog Header */}
        <div className="bg-primary-600 shadow-sm border-b mt-8">
          <div className="container-custom px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2 text-white hover:text-primary-100 transition-colors duration-200">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Home</span>
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Cleaning & Maintenance Blog</h1>
            </div>
          </div>
        </div>

        <div className="container-custom px-4 py-8 md:py-12">
          {/* Search and Categories */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Sort and Filter Options */}
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="readTime">Sort by Read Time</option>
                    <option value="title">Sort by Title</option>
                  </select>
                  <TrendingUp className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {isLoading ? (
                    // Loading skeleton for categories
                    [...Array(4)].map((_, index) => (
                      <div key={index} className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))
                  ) : (
                    categories.map((category, index) => (
                    <button
                      key={index}
                        onClick={() => handleCategoryChange(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        category === activeCategory
                          ? 'bg-primary-600 text-white' 
                          : 'bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Results Summary */}
            {!isLoading && (
            <div className="mt-4 text-sm text-secondary-500">
              Showing {sortedPosts.length} of {blogPosts.length} articles
              {searchQuery && ` for "${searchQuery}"`}
              {activeCategory !== 'All' && ` in ${activeCategory}`}
            </div>
            )}
          </div>

          {/* Featured Post */}
          <div className="mb-12 md:mb-16">
            {isLoading ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-secondary-500">Loading featured article...</p>
              </div>
            ) : sortedPosts.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative h-64 lg:h-full">
                    <img
                      src={sortedPosts[0].image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=400&fit=crop&crop=center'}
                      alt={sortedPosts[0].title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=400&fit=crop&crop=center'
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-none text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center space-x-4 text-sm text-secondary-500 mb-4">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {sortedPosts[0].category}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateHuman(sortedPosts[0].date, 'en-GB')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{sortedPosts[0].readTime}</span>
                      </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4">
                      {sortedPosts[0].title}
                    </h2>
                    <p className="text-secondary-600 mb-6 leading-relaxed">
                      {sortedPosts[0].excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-secondary-500">
                        <User className="w-4 h-4" />
                        <span>{sortedPosts[0].author}</span>
                      </div>
                      <Link
                        href={`/blog/${sortedPosts[0].id}`}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <h3 className="text-xl font-semibold text-secondary-600 mb-2">No articles found</h3>
                <p className="text-secondary-500">Try adjusting your search or category filter.</p>
              </div>
            )}
          </div>

          {/* Blog Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sortedPosts.map((post, index) => (
                <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                      loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                      <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-xs text-secondary-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                        <span>{formatDateHuman(post.date, 'en-GB')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-secondary-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-secondary-500">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
                </article>
            ))}
          </div>
          )}

          {/* Newsletter Signup */}
          <div className="mt-16 md:mt-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-primary-100"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Stay Updated with Cleaning Tips
              </h3>
              <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                Get the latest cleaning tips, maintenance advice, and industry insights delivered to your inbox. Join 500+ professionals already subscribed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-secondary-900 focus:ring-2 focus:ring-white focus:outline-none"
                />
                <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-200 hover:scale-105">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-primary-200 mt-3">
                No spam, unsubscribe at any time. We respect your privacy.
              </p>
            </div>
          </div>

          {/* Back to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-40"
            aria-label="Back to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default BlogPage
