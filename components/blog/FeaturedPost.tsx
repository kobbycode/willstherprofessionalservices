'use client'

import { Calendar, Clock, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatDateHuman } from '@/lib/date'
import type { BlogPost } from '@/lib/blog'

export default function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <article className="bg-white shadow-sm border border-[#E2E8F0] overflow-hidden rounded-xl group">
        <div className="grid md:grid-cols-5 gap-0">
          <div className="md:col-span-3 relative h-56 sm:h-64 md:h-full min-h-[280px] overflow-hidden">
            <Image
              src={post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop&crop=center'}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="bg-[#2563EB] text-white px-3 py-1 text-[11px] font-bold tracking-wider uppercase shadow-sm">
                Featured
              </span>
              <span className="bg-white/90 text-[#0F172A] px-3 py-1 text-[11px] font-semibold uppercase shadow-sm">
                {post.category}
              </span>
            </div>
          </div>

          <div className="md:col-span-2 p-5 md:p-6 lg:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-xs text-[#64748B] mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDateHuman(post.date, 'en-GB')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-3 leading-tight">
              {post.title}
            </h2>

            <p className="text-[#64748B] text-sm leading-relaxed mb-4 line-clamp-3">
              {post.excerpt || 'No excerpt available'}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <div className="w-7 h-7 bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] font-bold text-[11px]">
                  {post.author.charAt(0)}
                </div>
                <span className="font-medium text-[#0F172A]">{post.author}</span>
              </div>

              <Link
                href={`/blog/${post.id}`}
                className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all group/btn"
              >
                Read More
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  )
}
