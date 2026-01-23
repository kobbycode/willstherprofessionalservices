'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    History,
    Camera,
    Shield,
    Layers,
    Type,
    FileText,
    Sparkles,
    ExternalLink,
    Zap
} from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadImage } from '@/lib/storage'

interface AboutConfigProps {
    config: any
    onChange: (next: any) => void
}

export const AboutConfig = ({ config, onChange }: AboutConfigProps) => {
    const about = config.about || { title: '', content: '', imageUrl: '' }
    const [isUploading, setIsUploading] = useState(false)

    const update = (key: string, value: string) => onChange({ ...config, about: { ...about, [key]: value } })

    const handleImageUpload = async (file: File) => {
        if (!file) return
        setIsUploading(true)
        try {
            const imageUrl = await uploadImage(file, `about/about-${Date.now()}`)
            update('imageUrl', imageUrl)
            toast.success('Image asset saved')
        } catch (error) {
            toast.error('Asset upload failed')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight uppercase">Corporate Narrative</h2>
                    <p className="text-secondary-500 font-medium tracking-widest text-[10px] uppercase">Management of brand history, legacy and strategic vision</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-premium">
                    <div className="w-10 h-10 bg-primary-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/20">
                        <History className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Status</p>
                        <p className="text-xs font-black text-primary-900 mt-1 uppercase">Legacy Authenticated</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                {/* Content Editor Panel */}
                <div className="xl:col-span-3 space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
                            <div className="flex items-center gap-3">
                                <Type className="w-5 h-5 text-primary-900" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary-900">Narrative Structure</h3>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-200" />
                                <div className="w-2 h-2 rounded-full bg-gray-200" />
                                <div className="w-2 h-2 rounded-full bg-primary-900" />
                            </div>
                        </div>

                        <div className="p-10 space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Hero Name (Title)</label>
                                <div className="relative group/input">
                                    <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                    <input
                                        value={about.title || ''}
                                        onChange={(e) => update('title', e.target.value)}
                                        className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-[12px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                        placeholder="e.g. A Legacy of Engineering Excellence"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest">Chronicle Manuscript (Content)</label>
                                    <div className="text-[9px] font-bold text-secondary-300 uppercase italic">Rich text enabled</div>
                                </div>
                                <div className="relative group/input">
                                    <FileText className="absolute left-6 top-6 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                    <textarea
                                        value={about.content || ''}
                                        onChange={(e) => update('content', e.target.value)}
                                        rows={12}
                                        className="w-full pl-14 pr-8 py-6 bg-gray-50 border-none rounded-[2.5rem] text-[12px] font-medium text-secondary-600 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none resize-none leading-relaxed"
                                        placeholder="Articulate the company's journey and strategic mission..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-all duration-[2s]" />
                        <div className="relative z-10 flex items-start gap-6">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-accent-500 shadow-inner">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-black uppercase tracking-widest">Automatic Management</h4>
                                <p className="text-[10px] font-medium leading-relaxed opacity-60 uppercase tracking-tight max-w-md">Our Auto engine automatically parses this narrative to optimize global SEO markers and brand sentiment analysis. Ensure key values are articulated clearly.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Asset Panel */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden sticky top-8">
                        <div className="p-8 border-b border-gray-50 flex items-center gap-3 bg-gray-50/20">
                            <Camera className="w-5 h-5 text-primary-900" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary-900">Image Identity</h3>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="relative group/camera aspect-[4/5] rounded-[3rem] overflow-hidden border border-gray-100 bg-gray-50 shadow-inner">
                                {about.imageUrl ? (
                                    <motion.img
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        src={about.imageUrl}
                                        alt="About Narrative"
                                        className="w-full h-full object-cover grayscale group-hover/camera:grayscale-0 group-hover/camera:scale-105 transition-all duration-[1.5s]"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary-200">
                                        <Layers className="w-16 h-16 mb-6 opacity-20" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Visual Identifier</p>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-primary-900/40 opacity-0 group-hover/camera:opacity-100 transition-all flex flex-col items-center justify-center gap-6 backdrop-blur-sm">
                                    <label className="cursor-pointer group/btn">
                                        <div className="bg-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl group-hover/btn:scale-105 active:scale-95 transition-all">
                                            <Camera className="w-4 h-4 text-primary-900" />
                                            <span className="text-[10px] font-black text-primary-900 uppercase tracking-widest">{isUploading ? 'Synchronizing...' : 'Update Visual'}</span>
                                        </div>
                                        <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} disabled={isUploading} />
                                    </label>
                                    <p className="text-[8px] font-black text-white uppercase tracking-[0.4em] text-center px-10">Auto Asset Automatic Active</p>
                                </div>

                                {isUploading && (
                                    <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center z-30">
                                        <div className="w-12 h-12 border-4 border-primary-900/10 border-t-primary-900 rounded-full animate-spin mb-4" />
                                        <p className="text-[10px] font-black text-primary-900 uppercase tracking-widest">Master Sync in Progress</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                                        Identifier Source
                                        <ExternalLink className="w-3 h-3" />
                                    </p>
                                    <input
                                        value={about.imageUrl || ''}
                                        onChange={(e) => update('imageUrl', e.target.value)}
                                        className="w-full bg-transparent border-none text-[11px] font-mono text-secondary-400 focus:ring-0 truncate p-0"
                                        placeholder="https://visual-List.com/asset..."
                                    />
                                </div>
                                <div className="flex items-center gap-4 px-2">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    <p className="text-[9px] font-bold text-secondary-300 uppercase tracking-tight leading-relaxed">Secure asset hosting enabled. Recommended resolution: 1400x1000 for maximum clarity.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
