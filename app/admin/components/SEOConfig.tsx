'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    Search,
    Zap,
    BarChart4,
    Globe,
    ShieldCheck,
    Target,
    Sparkles,
    Link,
    Layers,
    FileText,
    Hash,
    Activity
} from 'lucide-react'

interface SEOConfigProps {
    config: any
    onChange: (next: any) => void
}

export const SEOConfig = ({ config, onChange }: SEOConfigProps) => {
    const seo = config.seo || { defaultTitle: '', defaultDescription: '', keywords: [] }
    const update = (key: string, value: any) => onChange({ ...config, seo: { ...seo, [key]: value } })
    const setKeywords = (value: string) => update('keywords', value.split(',').map((k: string) => k.trim()).filter(Boolean))

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight uppercase">Search Engine Management</h2>
                    <p className="text-secondary-500 font-medium tracking-widest text-[10px] uppercase">Management of global SEO markers & indexing Settings</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-premium">
                    <div className="w-10 h-10 bg-primary-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/20">
                        <Search className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Global Index</p>
                        <p className="text-xs font-black text-primary-900 mt-1 uppercase">Visibility saved</p>
                    </div>
                </div>
            </div>

            {/* Visibility Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-premium flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
                        <BarChart4 className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Search Potential</p>
                        <p className="text-3xl font-black text-primary-900 mt-1">94%</p>
                        <p className="text-[9px] font-bold text-blue-600 uppercase mt-1">High Intent Reach</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-premium flex items-center gap-6">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center">
                        <Activity className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Index Health</p>
                        <p className="text-3xl font-black text-primary-900 mt-1">Optimal</p>
                        <p className="text-[9px] font-bold text-green-600 uppercase mt-1">Global Propagation</p>
                    </div>
                </div>

                <div className="bg-primary-900 p-8 rounded-[2.5rem] shadow-2xl shadow-primary-900/20 flex items-center gap-6 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-all duration-700" />
                    <div className="relative z-10 w-16 h-16 bg-white/10 text-accent-500 rounded-3xl flex items-center justify-center">
                        <Target className="w-8 h-8" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">Social Graph</p>
                        <p className="text-xl font-black text-white mt-1 uppercase tracking-tighter">Elite Reach</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-[9px] font-bold text-green-400 uppercase">SEO Automatic Active</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                {/* Metadata Settings */}
                <div className="xl:col-span-3 space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-primary-900" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary-900">Metadata Settings</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span className="text-[10px] font-black text-secondary-300 uppercase tracking-widest">Integrity Verified</span>
                            </div>
                        </div>

                        <div className="p-10 space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Master Name (Default Title)</label>
                                <div className="relative group/input">
                                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                    <input
                                        value={seo.defaultTitle || ''}
                                        onChange={(e) => update('defaultTitle', e.target.value)}
                                        className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-[12px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                        placeholder="e.g. Willsther Professional Services | Excellence in Ghana"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest">SEO Abstract (Meta Description)</label>
                                    <div className="text-[9px] font-bold text-secondary-300 uppercase italic">Maximum 160 characters</div>
                                </div>
                                <div className="relative group/input">
                                    <Layers className="absolute left-6 top-6 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                    <textarea
                                        value={seo.defaultDescription || ''}
                                        onChange={(e) => update('defaultDescription', e.target.value)}
                                        rows={6}
                                        className="w-full pl-14 pr-8 py-6 bg-gray-50 border-none rounded-[2rem] text-[12px] font-medium text-secondary-600 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none resize-none leading-relaxed"
                                        placeholder="Articulate the default reach proposition for search nodes..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest">Category List (Keywords)</label>
                                    <div className="text-[9px] font-bold text-secondary-300 uppercase italic">Comma-separated Settings</div>
                                </div>
                                <div className="relative group/input">
                                    <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                    <input
                                        value={(seo.keywords || []).join(', ')}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-[12px] font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                        placeholder="sanitation, facility management, industrial hygiene..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Automatic Management Section */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-primary-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-primary-900/40">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-all duration-1000" />

                        <div className="relative z-10 space-y-8">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-accent-500 animate-pulse">
                                <Zap className="w-8 h-8" />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-black uppercase tracking-tight">Auto Automatic</h3>
                                <p className="text-[11px] font-medium leading-relaxed opacity-60 uppercase tracking-widest">Our SEO engine is currently analyzing your Settings. High-integrity metadata reduces search friction by up to 40%.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 pt-4">
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Mobile Indexing Capable</span>
                                </div>
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Schema.org Integrated</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-premium space-y-8 relative overflow-hidden">
                        <Sparkles className="absolute top-8 right-8 w-12 h-12 text-gray-50" />
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black text-primary-900 uppercase tracking-widest">Settings Insights</h4>
                            <p className="text-[9px] font-bold text-secondary-400 uppercase leading-relaxed tracking-tight">A well-structured SEO Settings ensures that search nodes can accurately categorize and prioritize your entity in global results.</p>
                        </div>
                        <div className="pt-4">
                            <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black text-secondary-300 uppercase tracking-widest hover:border-primary-900/20 hover:text-primary-900 transition-all active:scale-95">
                                Run SEO Audit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
