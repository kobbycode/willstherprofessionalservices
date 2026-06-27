'use client'

import { Calendar, Clock, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatDateHuman } from '@/lib/date'
import type { BlogPost } from '@/lib/blog'

interface BlogCardProps {
  post: BlogPost
  index?: number
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
    >
      <Link href={`/blog/${post.id}`} className="group block bg-white shadow-sm border border-[#E2E8F0] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full rounded-xl">
        <div className="relative h-44 sm:h-48 overflow-hidden bg-[#F1F5F9]">
          <Image
            src={post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop&crop=center'}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white/90 text-[#0F172A] px-2.5 py-0.5 text-[11px] font-semibold uppercase shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-4 md:p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 text-[11px] text-[#64748B] mb-2.5">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDateHuman(post.date, 'en-GB')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-[#0F172A] mb-2 line-clamp-2 group-hover:text-[#2563EB] transition-colors">
            {post.title}
          </h3>

          <p className="text-xs text-[#64748B] leading-relaxed mb-3 line-clamp-2">
            {post.excerpt || 'No excerpt available'}
          </p>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
              <User className="w-3 h-3" />
              <span>{post.author}</span>
            </div>
            <span className="text-[#2563EB] group-hover:text-[#1d4ed8] font-semibold text-[11px] inline-flex items-center gap-0.5 transition-colors">
              Read
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
