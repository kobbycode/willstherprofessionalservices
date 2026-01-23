'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Trash2,
    Star,
    Camera,
    Quote,
    CheckCircle2,
    ShieldCheck,
    TrendingUp,
    User,
    Sparkles,
    Layers,
    X
} from 'lucide-react'
import { uploadImage } from '@/lib/storage'
import toast from 'react-hot-toast'

interface TestimonialsConfigProps {
    config: any
    onChange: (next: any) => void
}

export const TestimonialsConfig = ({ config, onChange }: TestimonialsConfigProps) => {
    const items = config.testimonials || []
    const [isUploading, setIsUploading] = useState<number | null>(null)
    const [testimonialToDelete, setTestimonialToDelete] = useState<number | null>(null)

    const updateItem = (index: number, key: string, value: any) => {
        const next = { ...config }
        next.testimonials = [...items]
        next.testimonials[index] = { ...next.testimonials[index], [key]: value }
        onChange(next)
    }

    const addItem = () => {
        const newItem = {
            id: Date.now().toString(),
            name: '',
            role: '',
            content: '',
            rating: 5,
            avatarUrl: ''
        }
        onChange({ ...config, testimonials: [newItem, ...items] })
        toast.success('Testimonial slot initialized')
    }

    const removeItem = (index: number) => {
        onChange({ ...config, testimonials: items.filter((_: any, i: number) => i !== index) })
        toast.error('Testimonial record Deleted')
    }

    const handleUpload = async (index: number, file: File) => {
        if (!file) return
        setIsUploading(index)
        try {
            const url = await uploadImage(file, `testimonials/avatar-${Date.now()}`)
            updateItem(index, 'avatarUrl', url)
            toast.success('Identity asset saved')
        } catch (error) {
            toast.error('Asset upload failure')
        } finally {
            setIsUploading(null)
        }
    }

    const averageRating = items.length > 0
        ? (items.reduce((acc: number, curr: any) => acc + (curr.rating || 5), 0) / items.length).toFixed(1)
        : '0.0'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight uppercase">Reputation Management</h2>
                    <p className="text-secondary-500 font-medium tracking-widest text-[10px] uppercase">Curation of client Testimonial and social proof metrics</p>
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
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Client Advocate</span>
                    </div>
                </button>
            </div>

            {/* Reputation Management Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-premium flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
                        <Star className="w-8 h-8 fill-blue-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Market Trust</p>
                        <p className="text-3xl font-black text-primary-900 mt-1">{averageRating}/5.0</p>
                        <p className="text-[9px] font-bold text-blue-600 uppercase mt-1">Average Integrity</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-premium flex items-center gap-6">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Global Advocates</p>
                        <p className="text-3xl font-black text-primary-900 mt-1">{items.length}</p>
                        <p className="text-[9px] font-bold text-green-600 uppercase mt-1">Verified Testimonials</p>
                    </div>
                </div>

                <div className="bg-primary-900 p-8 rounded-[2.5rem] shadow-2xl shadow-primary-900/20 flex items-center gap-6 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-all duration-700" />
                    <div className="relative z-10 w-16 h-16 bg-white/10 text-accent-500 rounded-3xl flex items-center justify-center">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">Vibe Index</p>
                        <p className="text-xl font-black text-white mt-1 uppercase tracking-tighter">Elite Sentiment</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-[9px] font-bold text-green-400 uppercase">Auto Automatic Active</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <AnimatePresence mode='popLayout'>
                    {items.map((t: any, i: number) => (
                        <motion.div
                            key={t.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-[3rem] border border-gray-100 shadow-premium p-10 group hover:border-primary-900/10 transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary-900/5 group-hover:bg-primary-900 transition-colors" />

                            <div className="flex flex-col xl:flex-row gap-12">
                                {/* Left Side: Avatar & Identity */}
                                <div className="xl:w-80 shrink-0 space-y-8">
                                    <div className="relative group/camera w-48 h-48 mx-auto xl:mx-0">
                                        <label className="cursor-pointer">
                                            <div className="absolute inset-0 bg-primary-900 rounded-[3rem] flex flex-col items-center justify-center gap-3 opacity-0 group-hover/camera:opacity-100 transition-all z-20">
                                                <Camera className="w-8 h-8 text-white" />
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest">Update<br />Avatar</span>
                                            </div>
                                            <div className="w-48 h-48 bg-gray-50 border-2 border-dashed border-gray-100 rounded-[3rem] flex items-center justify-center overflow-hidden relative shadow-inner">
                                                {t.avatarUrl ? (
                                                    <img src={t.avatarUrl} className="w-full h-full object-cover grayscale group-hover/camera:grayscale-0 transition-all duration-[1s]" alt="" />
                                                ) : (
                                                    <div className="text-center">
                                                        <User className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                                        <p className="text-[9px] font-black text-secondary-200 uppercase tracking-widest">Identity<br />Missing</p>
                                                    </div>
                                                )}
                                                {isUploading === i && (
                                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-30">
                                                        <div className="w-10 h-10 border-4 border-primary-900/10 border-t-primary-900 rounded-full animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(i, e.target.files[0])} disabled={isUploading !== null} />
                                        </label>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Advocate Name</label>
                                            <input
                                                value={t.name}
                                                onChange={(e) => updateItem(i, 'name', e.target.value)}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[12px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                                placeholder="Full Identity"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Designation / Entity</label>
                                            <input
                                                value={t.role || ''}
                                                onChange={(e) => updateItem(i, 'role', e.target.value)}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[12px] font-bold text-secondary-400 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                                placeholder="e.g. CEO, Legacy Group"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Rating & Content */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Integrity Score</label>
                                                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <button
                                                            key={star}
                                                            onClick={() => updateItem(i, 'rating', star)}
                                                            className="transition-all hover:scale-125 hover:rotate-12 active:scale-90"
                                                        >
                                                            <Star className={`w-6 h-6 ${star <= (t.rating || 5) ? 'fill-accent-500 text-accent-500' : 'text-gray-200'}`} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="h-10 w-px bg-gray-100 mt-6" />
                                            <div className="mt-6 flex items-center gap-3">
                                                <ShieldCheck className="w-5 h-5 text-green-500" />
                                                <span className="text-[10px] font-black text-secondary-300 uppercase tracking-widest">Verified Interaction</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setTestimonialToDelete(i)}
                                            className="p-5 text-rose-500 hover:bg-rose-50 rounded-3xl transition-all active:scale-95 group/del"
                                        >
                                            <Trash2 className="w-6 h-6 group-hover/del:rotate-6" />
                                        </button>
                                    </div>

                                    <div className="flex-1 space-y-4 relative">
                                        <div className="flex items-center justify-between px-2">
                                            <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest">Testimonial Narrative</label>
                                            <Quote className="w-5 h-5 text-primary-900/10" />
                                        </div>
                                        <textarea
                                            value={t.content || ''}
                                            onChange={(e) => updateItem(i, 'content', e.target.value)}
                                            rows={6}
                                            className="w-full px-8 py-6 bg-gray-50/50 border-none rounded-[2.5rem] text-[13px] font-medium text-secondary-600 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none resize-none leading-relaxed italic"
                                            placeholder="Document client feedback manuscript..."
                                        />
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-secondary-300">
                                        <div className="flex items-center gap-4">
                                            <span className="px-3 py-1 bg-gray-100 rounded-lg">ID: {t.id?.substring(0, 8)}</span>
                                            <span className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-accent-500" /> Sentiment Optimized</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-3 h-3" /> System saved
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {items.length === 0 && (
                    <div className="py-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[4rem] text-center flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-10 border border-gray-100">
                            <Quote className="w-10 h-10 text-primary-900" />
                        </div>
                        <h3 className="text-2xl font-black text-primary-900 uppercase tracking-tight">Testimonial Desk Dormant</h3>
                        <p className="text-secondary-400 font-medium max-w-[320px] mt-4 mb-10 leading-relaxed uppercase text-[10px] tracking-widest">No client testimonials have been registered. Initiate reputation building by adding your first advocate.</p>
                        <button
                            onClick={addItem}
                            className="px-8 py-5 bg-primary-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-900/40 active:scale-95 transition-all"
                        >
                            Establish Testimonial Slot
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {testimonialToDelete !== null && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-primary-900/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-12 text-center space-y-8">
                                <div className="relative mx-auto w-24 h-24">
                                    <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-2xl animate-pulse" />
                                    <div className="relative w-24 h-24 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center shadow-inner border border-rose-100">
                                        <Trash2 className="w-10 h-10" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-3xl font-black text-primary-900 tracking-tight uppercase">Delete Setting</h3>
                                    <p className="text-secondary-500 font-medium leading-relaxed uppercase text-[10px] tracking-widest px-4">
                                        Confirm deleting of this client Testimonial record. This operation is absolute and permanent.
                                    </p>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setTestimonialToDelete(null)}
                                        className="flex-1 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        onClick={() => { removeItem(testimonialToDelete); setTestimonialToDelete(null); }}
                                        className="flex-1 py-5 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/30 active:scale-95 transition-all"
                                    >
                                        Execute Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
