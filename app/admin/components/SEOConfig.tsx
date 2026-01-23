'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SEOConfigProps {
    config: any
    onChange: (next: any) => void
}

export const SEOConfig = ({ config, onChange }: SEOConfigProps) => {
    const seo = config.seo || { defaultTitle: '', defaultDescription: '', keywords: [] }
    const update = (key: string, value: any) => onChange({ ...config, seo: { ...seo, [key]: value } })
    const setKeywords = (value: string) => update('keywords', value.split(',').map((k: string) => k.trim()).filter(Boolean))

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">SEO Settings</h2>
                <p className="text-gray-600 mt-1">Configure default search engine optimization</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Page Title</label>
                    <input value={seo.defaultTitle || ''} onChange={(e) => update('defaultTitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. Willsther Professional Services" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Meta Description</label>
                    <textarea value={seo.defaultDescription || ''} onChange={(e) => update('defaultDescription', e.target.value)} rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Describe your business for search engines..." />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (comma separated)</label>
                    <input value={(seo.keywords || []).join(', ')} onChange={(e) => setKeywords(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="cleaning services, maintenance, Ghana" />
                </div>
            </div>
        </motion.div>
    )
}
