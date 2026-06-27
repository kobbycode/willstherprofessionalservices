'use client'

import { Calendar, Eye, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatDateHuman } from '@/lib/date'
import type { BlogPost } from '@/lib/blog'

interface PopularPostsProps {
  posts: BlogPost[]
}

export default function PopularPosts({ posts }: PopularPostsProps) {
  if (posts.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="bg-white shadow-sm border border-[#E2E8F0] p-5 rounded-xl">
        <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
          Popular Posts
        </h3>
        <div className="space-y-4">
          {posts.slice(0, 4).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="flex gap-3 group items-start"
            >
              <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-[#F1F5F9]">
                <Image
                  src={post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100&h=100&fit=crop&crop=center'}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-[#94A3B8] mt-1">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>{formatDateHuman(post.date, 'en-GB')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/blog"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1d4ed8] transition-colors"
        >
          View all articles <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  )
}
