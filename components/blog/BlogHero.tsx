'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

interface BlogHeroProps {
  description?: string
  searchQuery: string
  onSearchChange: (q: string) => void
  categories: string[]
  activeCategory: string
  onCategoryChange: (cat: string) => void
}

export default function BlogHero({
  description,
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange
}: BlogHeroProps) {
  return (
    <section className="bg-white border-b border-[#E2E8F0] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#2563EB] font-semibold tracking-[0.2em] text-xs mb-3 block">
            OUR BLOG
          </span>

          <h1 className="text-3xl sm:text-[42px] font-bold text-[#0F172A] tracking-tight leading-tight mb-3">
            News & <span className="text-[#2563EB]">Insights</span>
          </h1>

          <p className="text-[#64748B] text-sm sm:text-base max-w-lg leading-relaxed mb-6">
            {description || 'Stay updated with expert cleaning tips, industry insights, and professional advice.'}
          </p>

          {/* Search Bar */}
          <div className="mb-5 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-14 pl-12 pr-10 bg-white border border-[#E2E8F0] text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all focus:border-[#2563EB] focus:shadow-sm shadow-sm rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            <div className="flex gap-2 min-w-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`flex-shrink-0 px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    cat === activeCategory
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'bg-white text-[#64748B] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 max-w-lg"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-[#F8FAFC] shadow-sm rounded-2xl">
            <Image
              src="https://res.cloudinary.com/dlu07cuqx/image/upload/v1782456577/ChatGPT_Image_Jun_26_2026_06_46_46_AM_cq6adh.png"
              alt="News & Insights"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 500px"
              priority
            />
          </div>
        </motion.div>

      </div>
    </section>
  )
}
