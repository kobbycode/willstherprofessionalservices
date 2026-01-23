'use client'

import { Calendar, Clock, User, ArrowLeft, Share2, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Skeleton from '@/components/Skeleton'
import Image from 'next/image'
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
      // Load post and related posts in parallel for better performance
      const [p, all] = await Promise.all([
        fetchPostById(params.id),
        fetchPosts(true, 6) // Fetch only 6 related posts instead of 12
      ])

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
            <div className="flex flex-col gap-8">
              <Skeleton className="h-10 w-48 rounded-xl" />
              <div className="bg-white rounded-3xl shadow-premium overflow-hidden border border-gray-100">
                <Skeleton className="h-80 md:h-[500px] w-full" />
                <div className="p-8 space-y-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-32 rounded-full" />
                  </div>
                  <Skeleton className="h-12 w-3/4 rounded-xl" />
                  <Skeleton className="h-6 w-1/4 rounded-xl" />
                  <div className="space-y-4 pt-8">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
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
        <div className="bg-primary-900 shadow-premium border-b border-white/10 mt-8">
          <div className="container-custom px-4 py-6">
            <div className="flex items-center justify-between">
              <Link href="/blog" className="flex items-center space-x-2 text-primary-100 hover:text-accent-500 transition-colors duration-200 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Blog</span>
              </Link>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-primary-100 hover:text-accent-500 transition-colors duration-200">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Share Article</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom px-4 py-8 md:py-12">
          <div className="mb-8 md:mb-12">
            <div className="bg-white rounded-3xl shadow-premium overflow-hidden border border-gray-100">
              <div className="relative h-80 md:h-96 lg:h-[500px] xl:h-[600px] overflow-hidden">
                <Image
                  src={post.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-primary-900 text-accent-500 px-4 py-1.5 rounded-none text-xs font-bold tracking-wider uppercase shadow-lg">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6 md:p-10">
                <div className="flex items-center space-x-4 text-sm text-secondary-500 mb-6">
                  <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {post.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateHuman(post.date, 'en-GB')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-secondary-900 mb-8 leading-tight">
                  {post.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-secondary-500 mb-8 pb-8 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-secondary-900">{post.author}</p>
                      <p className="text-xs">Expert Contributor</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(post.tags || []).map((tag, index) => (
                    <span key={index} className="bg-secondary-50 text-secondary-600 px-4 py-1.5 rounded-lg text-sm font-medium border border-gray-100">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-premium p-6 md:p-12 mb-8 md:mb-12 border border-gray-100">
            <div className="mb-10 p-6 bg-primary-50/50 rounded-2xl border border-primary-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/50 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-110"></div>
              <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center relative z-10">
                <BookOpen className="w-6 h-6 mr-3 text-accent-600" />
                Core Topics in this Article
              </h3>
              <div className="space-y-3 relative z-10">
                {tableOfContents.map((item, index) => (
                  <div key={index} className="ml-2 group/item">
                    <a href={`#section-${item?.index || index}`} className="text-secondary-700 hover:text-primary-900 text-base transition-all duration-200 flex items-center">
                      <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-3 opacity-0 group-hover/item:opacity-100 transition-opacity"></span>
                      {item?.title || ''}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="prose prose-lg max-w-none prose-headings:text-primary-900 prose-headings:font-bold prose-a:text-accent-600 hover:prose-a:text-accent-700 prose-img:rounded-3xl prose-img:shadow-premium text-secondary-700 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full h-1.5 bg-gray-100 z-50">
            <div className="bg-accent-500 h-full transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: `${readingProgress}%` }}></div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-secondary-500 mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Estimated reading time: {post.readTime}</span>
          </div>

          <div className="bg-white rounded-3xl shadow-premium p-8 md:p-12 mb-12 border border-gray-100">
            <h3 className="text-3xl font-bold text-secondary-900 mb-8">Related Strategy & Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`} className="group block">
                  <div className="bg-primary-50/30 rounded-2xl p-6 hover:bg-primary-50 transition-all duration-500 border border-transparent hover:border-primary-100 hover:shadow-premium group">
                    <h4 className="text-xl font-bold text-secondary-900 group-hover:text-primary-900 transition-colors duration-200 mb-3 line-clamp-2">{relatedPost.title}</h4>
                    <p className="text-sm text-secondary-600 line-clamp-3 mb-4">{relatedPost.excerpt}</p>
                    <div className="flex items-center space-x-4 text-xs text-secondary-500">
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        <span>{formatDateHuman(relatedPost.date, 'en-GB')}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

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
    </div>
  )
}