'use client'

import { Calendar, Clock, User, ArrowLeft, Share2, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { fetchPostById, fetchPosts, type BlogPost } from '@/lib/blog'
import { formatDateHuman } from '@/lib/date'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [related, setRelated] = useState<BlogPost[]>([])
  const [readingProgress, setReadingProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Memoize the load function to prevent unnecessary re-renders
  const loadPost = useCallback(async () => {
    setIsLoading(true)
    try {
      const p = await fetchPostById(params.id)
      if (!p || p.status !== 'published') {
    notFound()
        return
      }
      setPost(p)
      
      // Increment view count
      try {
        const { incrementViews } = await import('@/lib/blog')
        await incrementViews(params.id)
      } catch (e) {
        console.error('Failed to increment views:', e)
      }
      
      // Load related posts in parallel
      const all = await fetchPosts(true, 12)
      // Filter related posts to only show published ones
      setRelated(all.filter((x) => x.id !== p.id && x.category === p.category && x.status === 'published').slice(0, 3))
    } catch (error) {
      console.error('Failed to load post:', error)
    notFound()
    } finally {
      setIsLoading(false)
  }
  }, [params.id])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  useEffect(() => {
    const update = () => {
      const element = document.documentElement
      const totalHeight = element.scrollHeight - element.clientHeight
      const scrolled = element.scrollTop
      const pct = totalHeight > 0 ? Math.round((scrolled / totalHeight) * 100) : 0
      setReadingProgress(pct)
    }
    window.addEventListener('scroll', update)
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  // Memoize table of contents to prevent recalculation
  const tableOfContents = useMemo(() => {
    if (!post?.content) return []
    return post.content.split('\n')
      .map((line, index) => {
        if (line.startsWith('## ')) {
          const title = line.replace('## ', '')
          return { title, index }
        }
        return null
      })
      .filter(Boolean)
  }, [post?.content])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20">
          <div className="container-custom px-4 py-8 md:py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-96 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20">
        <div className="bg-white shadow-sm border-b mt-8">
          <div className="container-custom px-4 py-6">
            <div className="flex items-center justify-between">
              <Link href="/blog" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Blog</span>
              </Link>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors duration-200">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom px-4 py-8 md:py-12">
          <div className="mb-8 md:mb-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-80 md:h-96 lg:h-[500px] xl:h-[600px]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=400&fit=crop&crop=center'
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-none text-sm font-medium">{post.category}</span>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center space-x-4 text-sm text-secondary-500 mb-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">{post.category}</span>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateHuman(post.date, 'en-GB')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">{post.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-secondary-500 mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {(post.tags || []).map((tag, index) => (
                    <span key={index} className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded text-sm font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 md:mb-12">
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-secondary-900 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Table of Contents
              </h3>
              <div className="space-y-2">
                {tableOfContents.map((item, index) => (
                      <div key={index} className="ml-4">
                    <a href={`#section-${item?.index || index}`} className="text-primary-600 hover:text-primary-700 text-sm transition-colors duration-200">• {item?.title || ''}</a>
                      </div>
                ))}
              </div>
            </div>
            <div className="prose prose-lg max-w-none text-secondary-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                {post.content}
              </ReactMarkdown>
              </div>
            </div>

          <div className="bg-gray-200 rounded-full h-1.5 mb-6">
            <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${readingProgress}%` }}></div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-secondary-500 mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Estimated reading time: {post.readTime}</span>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-bold text-secondary-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`} className="group block">
                    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                    <h4 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors duration-200 mb-2">{relatedPost.title}</h4>
                    <p className="text-sm text-secondary-600 line-clamp-2">{relatedPost.excerpt}</p>
                      <div className="flex items-center space-x-2 text-xs text-secondary-500 mt-3">
                        <Calendar className="w-3 h-3" />
                      <span>{formatDateHuman(relatedPost.date, 'en-GB')}</span>
                        <Clock className="w-3 h-3" />
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

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


