'use client'

import { Calendar, Clock, User, ArrowLeft, Share2, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Skeleton from '@/components/Skeleton'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { fetchPostById, fetchPosts, type BlogPost } from '@/lib/blog'
import { formatDateHuman } from '@/lib/date'
import { motion } from 'framer-motion'
import DOMPurify from 'dompurify'

function extractHtmlHeadings(html: string): { title: string; level: number }[] {
  const headings: { title: string; level: number }[] = []
  const regex = /<h([2-3])(?:\s[^>]*)?>(.*?)<\/h\1>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const title = match[2].replace(/<[^>]*>/g, '').trim()
    if (title) headings.push({ title, level })
  }
  return headings
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [related, setRelated] = useState<BlogPost[]>([])
  const [readingProgress, setReadingProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const loadPost = useCallback(async () => {
    setIsLoading(true)
    try {
      const [p, all] = await Promise.all([
        fetchPostById(params.id),
        fetchPosts(true, 6)
      ])

      if (!p || p.status !== 'published') {
        notFound()
        return
      }
      setPost(p)

      try {
        const { incrementViews } = await import('@/lib/blog')
        await incrementViews(params.id)
      } catch (e) {
        
      }

      setRelated(all.filter((x) => x.id !== p.id && x.category === p.category && x.status === 'published').slice(0, 3))
    } catch (error) {
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

  const tableOfContents = useMemo(() => {
    if (!post?.content) return []
    const htmlHeadings = extractHtmlHeadings(post.content)
    if (htmlHeadings.length > 0) return htmlHeadings
    return post.content.split('\n')
      .map((line) => {
        if (line.startsWith('## ')) {
          return { title: line.replace('## ', ''), level: 2 }
        }
        return null
      })
      .filter(Boolean) as { title: string; level: number }[]
  }, [post?.content])

  const sanitizedContent = useMemo(() => {
    if (!post?.content) return ''
    return DOMPurify.sanitize(post.content, {
      ALLOWED_TAGS: [
        'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'strike',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
        'a', 'img', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'span', 'div', 'sub', 'sup', 'del', 'ins', 'mark'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
        'class', 'style', 'id', 'title'
      ]
    })
  }, [post?.content])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px]">
        <div className="container-custom py-8 md:py-12">
          <div className="flex flex-col gap-6 md:gap-8 max-w-3xl mx-auto">
            <Skeleton className="h-8 w-32" />
            <div className="bg-white shadow-sm border border-[#E2E8F0]">
              <Skeleton className="h-48 md:h-96 w-full" />
              <div className="p-5 md:p-8 space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <div className="space-y-3 pt-6">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className={`h-3 ${i % 3 === 0 ? 'w-4/5' : 'w-full'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px]">

      {/* Reading Progress Bar */}
      <div className="fixed top-[56px] md:top-[110px] left-0 w-full h-1 bg-[#E2E8F0] z-50">
        <div className="bg-[#2563EB] h-full transition-all duration-300" style={{ width: `${readingProgress}%` }} />
      </div>

      {/* Top Navigation */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="container-custom py-3">
          <div className="flex items-center justify-between">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-[#64748B] hover:text-[#2563EB] text-xs font-semibold uppercase tracking-widest transition-colors group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to Blog
            </Link>
            <button className="inline-flex items-center gap-1.5 text-[#64748B] hover:text-[#2563EB] text-xs font-semibold uppercase tracking-widest transition-colors">
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-6 md:py-10">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 max-w-6xl mx-auto">

          {/* Main Content */}
          <div className="min-w-0">
            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow-sm border border-[#E2E8F0] mb-8"
            >
              <div className="relative h-48 md:h-[420px] overflow-hidden">
                <Image
                  src={post.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-[#2563EB] text-white px-3 py-1 text-[11px] font-bold tracking-wider uppercase">{post.category}</span>
                </div>
              </div>
              <div className="p-5 md:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDateHuman(post.date, 'en-GB')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4 leading-tight">{post.title}</h1>
                <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
                  <div className="w-9 h-9 bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] font-bold text-sm">{post.author.charAt(0)}</div>
                  <div>
                    <p className="font-semibold text-[#0F172A] text-sm">{post.author}</p>
                    <p className="text-xs text-[#64748B]">Contributor</p>
                  </div>
                </div>
                {(post.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(post.tags || []).map((tag, index) => (
                      <span key={index} className="bg-[#F1F5F9] text-[#64748B] px-2.5 py-0.5 text-[11px] font-medium">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white shadow-sm border border-[#E2E8F0] p-5 md:p-8 lg:p-10 mb-8"
            >
              <div
                className="prose prose-base md:prose-lg max-w-none
                  prose-headings:text-[#0F172A] prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-lg md:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-[#475569] prose-p:leading-[1.75] prose-p:mb-5
                  prose-a:text-[#2563EB] prose-a:font-medium prose-a:no-underline hover:prose-a:text-[#1d4ed8] hover:prose-a:underline
                  prose-strong:text-[#0F172A] prose-strong:font-semibold
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-1.5 prose-ul:mb-5
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-1.5 prose-ol:mb-5
                  prose-li:text-[#475569] prose-li:leading-relaxed
                  prose-blockquote:border-l-4 prose-blockquote:border-[#2563EB] prose-blockquote:bg-[#F8FAFC] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic
                  prose-blockquote:p-4 prose-blockquote:my-6
                  prose-img:shadow-sm prose-img:my-8 prose-img:mx-auto
                  prose-hr:border-[#E2E8F0] prose-hr:my-10
                  prose-code:bg-[#F1F5F9] prose-code:text-[#0F172A] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal
                  prose-pre:bg-[#1E293B] prose-pre:text-[#E2E8F0] prose-pre:shadow-sm prose-pre:my-6
                  prose-table:w-full prose-table:border-collapse prose-table:my-8
                  prose-th:bg-[#F8FAFC] prose-th:text-[#0F172A] prose-th:font-semibold prose-th:px-4 prose-th:py-3 prose-th:border prose-th:border-[#E2E8F0]
                  prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-[#E2E8F0] prose-td:text-[#475569]"
              >
                <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
              </div>
            </motion.div>

            {/* Tags */}
            {(post.tags || []).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white shadow-sm border border-[#E2E8F0] p-4 md:p-6 mb-8"
              >
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(post.tags || []).map((tag, index) => (
                    <span key={index} className="bg-[#F1F5F9] text-[#64748B] px-2.5 py-1 text-[11px] font-medium">#{tag}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-[130px] space-y-6">
              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="bg-white shadow-sm border border-[#E2E8F0] p-4">
                  <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                    In this article
                  </h3>
                  <nav className="space-y-1">
                    {tableOfContents.map((item, index) => (
                      <div
                        key={index}
                        className={`text-xs ${item.level === 3 ? 'pl-4' : ''}`}
                      >
                        <span className="block text-[#64748B] py-1 border-l-2 border-[#E2E8F0] pl-3 cursor-default">
                          {item.title}
                        </span>
                      </div>
                    ))}
                  </nav>
                </div>
              )}

              {/* Related Posts */}
              {related.length > 0 && (
                <div className="bg-white shadow-sm border border-[#E2E8F0] p-4">
                  <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">Related Articles</h3>
                  <div className="space-y-3">
                    {related.map((rp) => (
                      <Link key={rp.id} href={`/blog/${rp.id}`} className="group block p-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors border border-[#E2E8F0]">
                        <h4 className="text-xs font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors mb-1 line-clamp-2">{rp.title}</h4>
                        <p className="text-[11px] text-[#64748B] line-clamp-2 mb-2">{rp.excerpt}</p>
                        <div className="flex items-center gap-2 text-[10px] text-[#94A3B8]">
                          <div className="flex items-center gap-0.5">
                            <Calendar className="w-2.5 h-2.5" />
                            <span>{formatDateHuman(rp.date, 'en-GB')}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{rp.readTime}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Related Posts Grid (bottom) */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 max-w-6xl mx-auto"
          >
            <div className="bg-white shadow-sm border border-[#E2E8F0] p-5 md:p-8">
              <span className="text-[#2563EB] font-semibold tracking-[0.2em] text-xs mb-2 block">RELATED</span>
              <h3 className="text-lg md:text-2xl font-bold text-[#0F172A] mb-5">More in {post.category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {related.map((rp) => (
                  <Link key={rp.id} href={`/blog/${rp.id}`} className="group block bg-[#F8FAFC] border border-[#E2E8F0] p-4 hover:bg-[#F1F5F9] transition-colors">
                    <span className="text-[#2563EB] text-[11px] font-semibold tracking-wider uppercase">{rp.category}</span>
                    <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors mt-1 mb-2 line-clamp-2">{rp.title}</h4>
                    <p className="text-xs text-[#64748B] line-clamp-2 mb-3">{rp.excerpt}</p>
                    <div className="flex items-center gap-3 text-[11px] text-[#94A3B8]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDateHuman(rp.date, 'en-GB')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{rp.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-[#0F172A] text-white p-3 shadow-sm hover:shadow-md transition-all hover:scale-105 z-40"
        aria-label="Back to top"
      >
        <ArrowLeft className="w-4 h-4 rotate-90" />
      </button>
    </div>
  )
}
