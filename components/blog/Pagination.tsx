'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = []
    const delta = 1

    pages.push(1)

    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

    if (rangeStart > 2) pages.push('ellipsis')

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i)
    }

    if (rangeEnd < totalPages - 1) pages.push('ellipsis')

    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex items-center justify-center gap-1.5"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0] bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#64748B] rounded-lg"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((page, idx) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-2 py-2 text-xs text-[#94A3B8]">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] px-2.5 py-2 text-xs font-semibold transition-all rounded-lg ${
                page === currentPage
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0] bg-white'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0] bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#64748B] rounded-lg"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}
