'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    Upload,
    Camera,
    Layers,
    ExternalLink,
    Monitor,
    Sparkles,
    Zap,
    ShieldCheck,
    LayoutGrid
} from 'lucide-react'
import { uploadImage } from '@/lib/storage'
import toast from 'react-hot-toast'

interface GalleryConfigProps {
    config: any
    onChange: (next: any) => void
}

export const GalleryConfig = ({ config, onChange }: GalleryConfigProps) => {
    const items = config.gallery || []
    const [isUploading, setIsUploading] = useState<number | null>(null)

    const updateItem = (index: number, key: string, value: any) => {
        const next = { ...config }
        next.gallery = [...items]
        next.gallery[index] = { ...next.gallery[index], [key]: value }
        onChange(next)
    }

    const addItem = () => {
        const newItem = {
            id: Date.now().toString(),
            imageUrl: '',
            caption: ''
        }
        onChange({ ...config, gallery: [newItem, ...items] })
        toast.success('Asset slot initialized')
    }

    const removeItem = (index: number) => {
        onChange({ ...config, gallery: items.filter((_: any, i: number) => i !== index) })
        toast.error('Asset decommissioned')
    }

    const handleUpload = async (index: number, file: File) => {
        if (!file) return
        setIsUploading(index)
        try {
            const url = await uploadImage(file, `gallery/asset-${Date.now()}`)
            updateItem(index, 'imageUrl', url)
            toast.success('Visual asset synchronized')
        } catch (error) {
            toast.error('Asset upload failure')
        } finally {
            setIsUploading(null)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Header & Global Add */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight uppercase">Visual Asset Vault</h2>
                    <p className="text-secondary-500 font-medium tracking-widest text-[10px] uppercase">Management of global media gallery & cinematic identifiers</p>
                </div>

                <button
                    onClick={addItem}
                    className="group relative px-8 py-5 bg-primary-900 text-white rounded-[2rem] shadow-2xl shadow-primary-900/20 hover:shadow-primary-900/40 transition-all active:scale-95 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-4">
                        <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                            <Plus className="w-5 h-5 text-accent-500" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deploy New Asset</span>
                    </div>
                </button>
            </div>

            {/* Neural Media Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-premium flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
                        <ImageIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Vault Capacity</p>
                        <p className="text-3xl font-black text-primary-900 mt-1">{items.length}</p>
                        <p className="text-[9px] font-bold text-blue-600 uppercase mt-1">Global Visual Assets</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-premium flex items-center gap-6">
                    <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center">
                        <Monitor className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Media Density</p>
                        <p className="text-3xl font-black text-primary-900 mt-1">High</p>
                        <p className="text-[9px] font-bold text-amber-600 uppercase mt-1">Optimized for Retina</p>
                    </div>
                </div>

                <div className="bg-primary-900 p-8 rounded-[2.5rem] shadow-2xl shadow-primary-900/20 flex items-center gap-6 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-all duration-700" />
                    <div className="relative z-10 w-16 h-16 bg-white/10 text-accent-500 rounded-3xl flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">CDN Status</p>
                        <p className="text-xl font-black text-white mt-1 uppercase tracking-tighter">Edge Verified</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-[9px] font-bold text-green-400 uppercase">Neural Distribution Active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <AnimatePresence mode='popLayout'>
                    {items.map((g: any, i: number) => (
                        <motion.div
                            key={g.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-[3rem] border border-gray-100 shadow-premium overflow-hidden group hover:border-primary-900/10 transition-all flex flex-col"
                        >
                            {/* Visual Identification Area */}
                            <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center relative overflow-hidden group/camera">
                                {g.imageUrl ? (
                                    <img src={g.imageUrl} alt="" className="w-full h-full object-cover grayscale group-hover/camera:grayscale-0 group-hover/camera:scale-105 transition-all duration-[1.5s]" />
                                ) : (
                                    <div className="text-center">
                                        <Layers className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                        <p className="text-[9px] font-black text-secondary-200 uppercase tracking-widest">Master Asset Undefined</p>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-primary-900/40 opacity-0 group-hover/camera:opacity-100 transition-all flex items-center justify-center gap-4 backdrop-blur-sm">
                                    <button
                                        onClick={() => removeItem(i)}
                                        className="p-4 bg-rose-500 text-white rounded-2xl shadow-xl shadow-rose-500/30 hover:bg-rose-600 active:scale-95 transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <label className="cursor-pointer">
                                        <div className="p-4 bg-white text-primary-900 rounded-2xl shadow-xl hover:bg-gray-50 active:scale-95 transition-all">
                                            <Camera className="w-5 h-5" />
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(i, e.target.files[0])} disabled={isUploading !== null} />
                                    </label>
                                </div>

                                {isUploading === i && (
                                    <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center z-30">
                                        <div className="w-10 h-10 border-4 border-primary-900/10 border-t-primary-900 rounded-full animate-spin mb-4" />
                                        <p className="text-[9px] font-black text-primary-900 uppercase tracking-widest">Synchronizing...</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-secondary-300 uppercase tracking-widest px-2">Asset Identifier Path</label>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-inner flex items-center gap-3">
                                        <input
                                            value={g.imageUrl || ''}
                                            onChange={(e) => updateItem(i, 'imageUrl', e.target.value)}
                                            className="flex-1 bg-transparent border-none text-[10px] font-mono text-secondary-400 focus:ring-0 truncate p-0"
                                            placeholder="https://visual-registry.com/..."
                                        />
                                        <ExternalLink className="w-3 h-3 text-secondary-200" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-secondary-300 uppercase tracking-widest px-2">Descriptive Caption</label>
                                    <div className="relative group/input">
                                        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-secondary-200 group-focus-within/input:text-primary-900 transition-colors" />
                                        <input
                                            value={g.caption || ''}
                                            onChange={(e) => updateItem(i, 'caption', e.target.value)}
                                            className="w-full pl-10 pr-6 py-4 bg-gray-50/50 border-none rounded-2xl text-[11px] font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none shadow-premium-sm"
                                            placeholder="e.g. Industrial Sanitation Grid"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <button
                    onClick={addItem}
                    className="aspect-[4/3] border-2 border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-secondary-300 hover:bg-gray-50 hover:border-primary-900/20 hover:text-primary-900 transition-all group"
                >
                    <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all">
                        <Plus className="w-8 h-8 text-accent-500" />
                    </div>
                    <div className="space-y-1">
                        <span className="font-black text-[10px] uppercase tracking-[0.3em]">Deploy New Asset</span>
                        <p className="text-[8px] font-bold opacity-40 uppercase">Maximum Integrity Sync Enabled</p>
                    </div>
                </button>
            </div>

            {/* Empty State Illustration */}
            {items.length === 0 && (
                <div className="col-span-full py-40 bg-gray-50 border border-gray-100 rounded-[4rem] flex flex-col items-center justify-center">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl mb-10 border border-gray-100">
                        <LayoutGrid className="w-16 h-16 text-primary-900/10" />
                    </div>
                    <h3 className="text-2xl font-black text-primary-900 uppercase tracking-tight">Visual Repository Dormant</h3>
                    <p className="max-w-md text-center text-secondary-400 font-medium mt-4 text-[11px] uppercase tracking-widest leading-relaxed">The asset vault is currently empty. Initiate visual synchronization by deploying high-integrity media files to the global registry.</p>
                </div>
            )}
        </motion.div>
    )
}
