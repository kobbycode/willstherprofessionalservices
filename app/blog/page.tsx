'use client'

import { Calendar, Clock, User, ArrowLeft, Search, Tag, Filter, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Skeleton from '@/components/Skeleton'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { fetchPosts, type BlogPost } from '@/lib/blog'
import { formatDateHuman } from '@/lib/date'
import Image from 'next/image'

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState('date') // date, readTime, title
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [categories, setCategories] = useState<string[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])

  // Memoize filtered and sorted posts for better performance
  const { filteredPosts, sortedPosts } = useMemo(() => {
    const filtered = blogPosts.filter(post => {
      const matchesCategory = activeCategory === 'All' || activeCategory === '' || post.category === activeCategory
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

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const newPosts = await fetchPosts(true, 12) // Fetch only 12 posts at a time
      if (newPosts.length < 12) {
        setHasMore(false)
      }

      // Avoid duplicates
      const existingIds = new Set(blogPosts.map(p => p.id))
      const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id))

      setBlogPosts(prev => [...prev, ...uniqueNewPosts])
    } catch (error) {
      console.error('Failed to load more blog posts:', error)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }, [blogPosts, isLoading, hasMore])

  // Memoize the load function to prevent unnecessary re-renders
  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Fetch posts and categories in parallel
      const [posts, categoriesData] = await Promise.all([
        fetchPosts(true, 12), // Fetch only 12 posts initially instead of 100
        import('@/lib/categories').then(m => m.fetchCategories())
      ])

      // Log for debugging
      console.log('Fetched published posts:', posts.length)
      console.log('Published posts data:', posts)

      setBlogPosts(posts)
      setHasMore(posts.length === 12) // If we got 12 posts, there might be more

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

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1)
    setHasMore(true)
    setBlogPosts([])
  }, [activeCategory, searchQuery, sortBy])

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
        <div className="bg-primary-900 shadow-premium border-b border-white/10 mt-8">
          <div className="container-custom px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2 text-primary-100 hover:text-accent-500 transition-colors duration-200 group">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to Home</span>
                </Link>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center md:text-left">
                Insightful <span className="text-accent-500">Articles</span>
              </h1>
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
                  {isLoading && blogPosts.length === 0 ? (
                    // Loading skeleton for categories
                    [...Array(6)].map((_, index) => (
                      <Skeleton key={index} className="h-10 w-24 rounded-lg" />
                    ))
                  ) : (
                    categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${category === activeCategory
                          ? 'bg-primary-900 text-accent-500 shadow-premium'
                          : 'bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-900 border border-gray-100'
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
            {!isLoading && blogPosts.length > 0 && (
              <div className="mt-4 text-sm text-secondary-500">
                Showing {sortedPosts.length} of {blogPosts.length} articles
                {searchQuery && ` for "${searchQuery}"`}
                {activeCategory !== 'All' && activeCategory !== '' && ` in ${activeCategory}`}
              </div>
            )}
          </div>

          {/* Featured Post */}
          <div className="mb-12 md:mb-16">
            {isLoading && blogPosts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-premium overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  <Skeleton className="h-64 lg:h-[400px] w-full" />
                  <div className="p-6 md:p-8 flex flex-col justify-center gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex justify-between items-center mt-4">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            ) : sortedPosts.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-premium overflow-hidden group border border-gray-100">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative h-64 lg:h-full overflow-hidden">
                    <Image
                      src={sortedPosts[0].image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=400&fit=crop&crop=center'}
                      alt={sortedPosts[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-primary-900 text-accent-500 px-4 py-1.5 rounded-none text-xs font-bold tracking-wider uppercase shadow-lg">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center space-x-4 text-sm text-secondary-500 mb-4">
                      <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold">
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
                      {sortedPosts[0].excerpt || 'No excerpt available'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-secondary-500">
                        <User className="w-4 h-4" />
                        <span>{sortedPosts[0].author}</span>
                      </div>
                      <Link
                        href={`/blog/${sortedPosts[0].id}`}
                        className="bg-primary-900 hover:bg-primary-950 text-accent-500 px-8 py-3 rounded-lg font-bold transition-all duration-300 shadow-premium hover:shadow-premium-hover transform hover:-translate-y-0.5"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-premium p-12 text-center border border-gray-100">
                <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-primary-300" />
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-3">No published articles yet</h3>
                <p className="text-secondary-500 mb-4">Check back later for our latest cleaning tips and industry insights.</p>
                <p className="text-sm text-secondary-400">Admins: Make sure to publish posts in the admin panel for them to appear here.</p>
              </div>
            )}
          </div>

          {/* Blog Grid - Exclude featured post */}
          {isLoading && blogPosts.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-premium overflow-hidden border border-gray-100">
                  <Skeleton className="h-56 w-full" />
                  <div className="p-6 flex flex-col gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedPosts.length <= 1 ? (
            <div className="bg-white rounded-2xl shadow-premium p-12 text-center border border-gray-100 max-w-2xl mx-auto">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary-300" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">No more articles</h3>
              <p className="text-secondary-500">This is all we have for now. Check back later for more premium content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPosts.slice(1).map((post, index) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl shadow-premium overflow-hidden hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 group border border-gray-100"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={post.image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop&crop=center'}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-white/90 backdrop-blur-md text-primary-900 px-3 py-1 rounded text-xs font-bold tracking-wide uppercase shadow-sm">
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
                      {post.excerpt || 'No excerpt available'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-secondary-500">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-primary-900 hover:text-accent-600 font-bold text-sm transition-colors duration-200 flex items-center group/btn"
                      >
                        <span>Read More</span>
                        <ArrowLeft className="w-4 h-4 ml-1 rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && sortedPosts.length > 1 && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMorePosts}
                disabled={isLoading}
                className="bg-primary-900 hover:bg-primary-950 text-accent-500 px-10 py-4 rounded-xl font-bold transition-all duration-300 shadow-premium hover:shadow-premium-hover transform hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : 'Load More Articles'}
              </button>
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="mt-16 md:mt-24 bg-primary-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-premium">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-500/20 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Stay Ahead of the <span className="text-accent-500">Curse</span>
              </h3>
              <p className="text-primary-100 mb-10 text-lg md:text-xl opacity-90">
                Subscribe for premium maintenance tips, exclusive industry insights, and seasonal guides delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-white/5 p-2 rounded-2xl backdrop-blur-md border border-white/10">
                <input
                  type="email"
                  placeholder="Your professional email"
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 text-white placeholder:text-primary-200 focus:ring-2 focus:ring-accent-500 focus:outline-none transition-all duration-300"
                />
                <button className="bg-accent-500 text-primary-900 px-8 py-4 rounded-xl font-bold hover:bg-accent-600 transition-all duration-300 hover:scale-105 shadow-lg active:scale-95">
                  Subscribe
                </button>
              </div>
              <p className="text-sm text-primary-300 mt-6">
                Luxury service, zero spam. Unsubscribe at any time.
              </p>
            </div>
          </div>

          {/* Back to Top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 bg-primary-900 text-accent-500 p-4 rounded-full shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:scale-110 z-40 border border-white/10 active:scale-90"
            aria-label="Back to top"
          >
            <ArrowLeft className="w-6 h-6 rotate-90" />
          </button>
        </div>
      </div>
      <Footer />
    </div >
  )
}

export default BlogPage