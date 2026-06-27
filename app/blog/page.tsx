'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { fetchPosts, type BlogPost } from '@/lib/blog'
import { fetchCategories } from '@/lib/categories'
import BlogHero from '@/components/blog/BlogHero'
import FeaturedPost from '@/components/blog/FeaturedPost'
import BlogCard from '@/components/blog/BlogCard'
import PopularPosts from '@/components/blog/PopularPosts'
import NewsletterCard from '@/components/blog/NewsletterCard'
import Pagination from '@/components/blog/Pagination'
import Skeleton from '@/components/Skeleton'

const POSTS_PER_PAGE = 9

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [posts, cats] = await Promise.all([
        fetchPosts(true, 100),
        fetchCategories()
      ])
      setBlogPosts(posts)
      setCategories(['All', ...cats])
    } catch (err) {
      setCategories(['All', 'Cleaning', 'Maintenance', 'Pest Control', 'Fumigation', 'Laundry'])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    setPage(1)
  }, [activeCategory, searchQuery])

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchCategory = activeCategory === 'All' || post.category === activeCategory
      const q = searchQuery.toLowerCase()
      const matchSearch = !q ||
        post.title.toLowerCase().includes(q) ||
        (post.excerpt || '').toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q)
      return matchCategory && matchSearch
    })
  }, [blogPosts, activeCategory, searchQuery])

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [filteredPosts])

  const featuredPost = sortedPosts.length > 0 ? sortedPosts[0] : null
  const gridPosts = sortedPosts.slice(1)
  const totalPages = Math.max(1, Math.ceil(gridPosts.length / POSTS_PER_PAGE))
  const paginatedPosts = gridPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  )

  const popularPosts = useMemo(() => {
    const byViews = [...blogPosts]
      .filter((p) => p.views !== undefined && p.views > 0)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
    if (byViews.length >= 4) return byViews
    return [...blogPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 4)
  }, [blogPosts])

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px]">

      <BlogHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="container-custom pb-10 md:pb-16">

        {/* Loading */}
        {isLoading && (
          <div className="space-y-8 mt-6">
            <div className="bg-white shadow-sm border border-[#E2E8F0] overflow-hidden md:flex">
              <Skeleton className="h-56 md:h-80 w-full md:w-3/5" />
              <div className="p-5 md:p-6 lg:p-8 space-y-3 flex-1">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between items-center pt-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white shadow-sm border border-[#E2E8F0] overflow-hidden">
                  <Skeleton className="h-44 sm:h-48 w-full" />
                  <div className="p-4 md:p-5 space-y-2.5">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <div className="flex justify-between items-center pt-3">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <>
            {sortedPosts.length === 0 ? (
              <div className="bg-white shadow-sm border border-[#E2E8F0] p-8 md:p-12 text-center mt-6">
                <div className="w-14 h-14 bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-1">No articles found</h3>
                <p className="text-sm text-[#64748B] mb-1">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : activeCategory !== 'All'
                    ? `No articles in "${activeCategory}"`
                    : 'No published articles yet.'}
                </p>
                <p className="text-[11px] text-[#94A3B8]">
                  {searchQuery || activeCategory !== 'All'
                    ? 'Try adjusting your search or filter.'
                    : 'Check back later for new content.'}
                </p>
              </div>
            ) : (
              <>
                {/* Featured Post + Popular Posts (side by side on desktop) */}
                <div className="mt-6 md:mt-8">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 lg:gap-8">
                    <div>
                      {featuredPost && <FeaturedPost post={featuredPost} />}
                    </div>
                    <div className="hidden lg:block">
                      <div className="sticky top-[130px]">
                        <PopularPosts posts={popularPosts} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blog Grid */}
                {paginatedPosts.length > 0 && (
                  <div className="mt-8 md:mt-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                      {paginatedPosts.map((post, idx) => (
                        <BlogCard key={post.id} post={post} index={idx} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Pagination */}
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>

                {/* Popular Posts on Mobile */}
                <div className="mt-6 lg:hidden">
                  <PopularPosts posts={popularPosts} />
                </div>
              </>
            )}

            {/* Newsletter */}
            <div className="mt-6 max-w-2xl mx-auto">
              <NewsletterCard />
            </div>
          </>
        )}

      </div>

    </main>
  )
}
