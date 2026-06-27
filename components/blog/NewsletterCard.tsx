'use client'

import { Mail, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function NewsletterCard() {
  const [email, setEmail] = useState('')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] p-6 md:p-7 text-white rounded-xl"
    >
      <Mail className="w-7 h-7 mb-4 text-white/80" />
      <h3 className="text-lg font-bold mb-1">Subscribe for Updates</h3>
      <p className="text-sm text-white/70 mb-5 leading-relaxed">
        Get the latest cleaning tips and industry insights delivered to your inbox.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 min-w-0 px-4 py-3 text-sm text-[#0F172A] bg-white outline-none placeholder:text-[#94A3B8]"
        />
        <button
          onClick={() => {
            if (email) {
              alert('Subscribed! (demo)')
              setEmail('')
            }
          }}
          className="bg-white text-[#2563EB] hover:bg-[#F8FAFC] px-4 py-3 font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-1 flex-shrink-0"
        >
          Subscribe
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}
