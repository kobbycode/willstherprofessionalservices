'use client'

import { Calendar, Eye, ChevronRight, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatDateHuman } from '@/lib/date'
import type { BlogPost } from '@/lib/blog'
import { useState } from 'react'

interface SidebarProps {
  popularPosts: BlogPost[]
  categories: { name: string; count: number }[]
  onCategoryClick?: (name: string) => void
}

export default function Sidebar({ popularPosts, categories, onCategoryClick }: SidebarProps) {
  const [email, setEmail] = useState('')

  return (
    <aside className="space-y-6">
      {/* Popular Posts */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white shadow-sm border border-[#E2E8F0] p-5"
      >
        <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
          Popular Posts
        </h3>

        {popularPosts.length === 0 ? (
          <p className="text-xs text-[#64748B]">No popular posts yet.</p>
        ) : (
          <div className="space-y-3">
            {popularPosts.slice(0, 4).map((post) => (
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
        )}
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white shadow-sm border border-[#E2E8F0] p-5"
      >
        <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4">
          Categories
        </h3>

        {categories.length === 0 ? (
          <p className="text-xs text-[#64748B]">No categories found.</p>
        ) : (
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onCategoryClick?.(cat.name)}
                className="w-full flex items-center justify-between py-2 px-3 text-xs text-[#64748B] hover:text-[#2563EB] hover:bg-[#F8FAFC] transition-all group"
              >
                <span className="flex items-center gap-2">
                  <ChevronRight className="w-2.5 h-2.5 text-[#94A3B8] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
                  {cat.name}
                </span>
                <span className="bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 text-[11px] font-medium group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Newsletter */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] p-5 text-white"
      >
        <Mail className="w-6 h-6 mb-3 text-white/80" />
        <h3 className="text-sm font-bold mb-1">Stay Updated</h3>
        <p className="text-xs text-white/70 mb-4 leading-relaxed">
          Get the latest cleaning tips and industry insights delivered to your inbox.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 text-sm text-[#0F172A] bg-white outline-none placeholder:text-[#94A3B8]"
          />
          <button
            onClick={() => {
              if (email) {
                alert('Subscribed! (demo)')
                setEmail('')
              }
            }}
            className="bg-white text-[#2563EB] hover:bg-[#F8FAFC] px-3 py-2 font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-1"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </aside>
  )
}
