'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Trash2,
    X,
    Shield,
    Share2,
    Copyright,
    Camera,
    Layers,
    Link as LinkIcon,
    MousePointer2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadImage } from '@/lib/storage'

interface FooterConfigProps {
    config: any
    onChange: (next: any) => void
}

export const FooterConfig = ({ config, onChange }: FooterConfigProps) => {
    const footer = config.footer || { copyright: '', socialLinks: [] }
    const [isUploading, setIsUploading] = useState(false)
    const [newSocialLink, setNewSocialLink] = useState({ name: '', url: '', icon: '' })
    const [isAddSocialLinkModalOpen, setIsAddSocialLinkModalOpen] = useState(false)
    const [socialLinkToDelete, setSocialLinkToDelete] = useState<number | null>(null)

    const update = (key: string, value: any) => onChange({ ...config, footer: { ...footer, [key]: value } })

    const addSocialLink = () => {
        if (!newSocialLink.name || !newSocialLink.icon) {
            toast.error('Identity requirements incomplete')
            return
        }
        update('socialLinks', [...footer.socialLinks, newSocialLink])
        setNewSocialLink({ name: '', url: '', icon: '' })
        setIsAddSocialLinkModalOpen(false)
        toast.success('Social endpoint established')
    }

    const removeSocialLink = (index: number) => {
        update('socialLinks', footer.socialLinks.filter((_: any, i: number) => i !== index))
        toast.error('Identity segment purged')
    }

    const handleIconUpload = async (file: File) => {
        if (!file) return
        setIsUploading(true)
        try {
            const imageUrl = await uploadImage(file, `social-links/${Date.now()}`)
            setNewSocialLink({ ...newSocialLink, icon: imageUrl })
            toast.success('Branded icon synchronized')
        } catch (error) {
            toast.error('Synchronization failed')
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
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight uppercase">Base Configuration</h2>
                    <p className="text-secondary-500 font-medium tracking-widest text-[10px] uppercase">Management of global footer signatures and social ecosystem</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-premium">
                    <div className="w-10 h-10 bg-primary-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/20">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Global Footer</p>
                        <p className="text-xs font-black text-primary-900 mt-1 uppercase">Encrypted Assets</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Copyright Segment */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/20 flex items-center gap-3 text-primary-900">
                            <Copyright className="w-5 h-5" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Legal Signature</h3>
                        </div>
                        <div className="p-8 space-y-4">
                            <label className="text-[10px] font-black text-secondary-400 uppercase tracking-widest block px-1">Copyright Register</label>
                            <input
                                value={footer.copyright || ''}
                                onChange={(e) => update('copyright', e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[12px] font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                placeholder="e.g. © 2024 Willsther International"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Registry Segment */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary-900/5 rounded-2xl text-primary-900"><Share2 className="w-6 h-6" /></div>
                            <div>
                                <h3 className="text-xl font-black text-primary-900 uppercase tracking-tight">Social Ecosystem</h3>
                                <p className="text-[10px] font-bold text-secondary-300 uppercase tracking-widest">Connect your digital touchpoints</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAddSocialLinkModalOpen(true)}
                            className="group px-6 py-4 bg-primary-900 text-white rounded-2xl shadow-xl shadow-primary-900/10 hover:shadow-primary-900/20 active:scale-95 transition-all flex items-center gap-3"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">New Protocol</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence mode='popLayout'>
                            {footer.socialLinks.map((link: any, index: number) => (
                                <motion.div
                                    key={index}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group relative flex items-center justify-between p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-premium hover:border-primary-900/10 transition-all overflow-hidden"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary-900/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <img
                                                src={link.icon}
                                                alt=""
                                                className="relative w-14 h-14 rounded-2xl object-cover border border-gray-50 bg-gray-50 shadow-inner z-10"
                                                onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/64'}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-primary-900 uppercase tracking-tight">{link.name}</p>
                                            <p className="text-[10px] font-bold text-secondary-400 lowercase tracking-tight max-w-[120px] truncate italic">{link.url}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSocialLinkToDelete(index)}
                                        className="p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-95"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {footer.socialLinks.length === 0 && (
                            <div className="col-span-full py-20 bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center px-10">
                                <Share2 className="w-10 h-10 text-gray-200 mb-4" />
                                <h4 className="text-lg font-black text-secondary-300 uppercase">Ecosystem Inactive</h4>
                                <p className="text-xs font-medium text-secondary-300 max-w-[240px] mt-2">No social identity markers have been registered for this entity yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals - Established Pattern */}
            <AnimatePresence>
                {isAddSocialLinkModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary-900/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col"
                        >
                            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="text-2xl font-black text-primary-900 uppercase tracking-tight">Identity Injection</h3>
                                <button onClick={() => setIsAddSocialLinkModalOpen(false)} className="p-4 hover:bg-gray-100 rounded-2xl transition-all active:scale-95"><X className="w-6 h-6 text-secondary-400" /></button>
                            </div>

                            <div className="p-10 space-y-10">
                                {/* Visual Asset */}
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="relative group/camera w-24 h-24 shrink-0">
                                        <label className="cursor-pointer">
                                            <div className="absolute inset-0 bg-primary-900 rounded-[2rem] flex flex-col items-center justify-center gap-2 opacity-0 group-hover/camera:opacity-100 transition-all z-20">
                                                <Camera className="w-6 h-6 text-white" />
                                                <span className="text-[8px] font-black text-white uppercase tracking-widest text-center">Update<br />Icon</span>
                                            </div>
                                            <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2rem] flex items-center justify-center overflow-hidden relative">
                                                {newSocialLink.icon ? (
                                                    <img src={newSocialLink.icon} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <Camera className="w-8 h-8 text-gray-200" />
                                                )}
                                                {isUploading && (
                                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
                                                        <div className="w-6 h-6 border-2 border-primary-900/10 border-t-primary-900 rounded-full animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                            <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleIconUpload(e.target.files[0])} />
                                        </label>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="bg-primary-900 rounded-2xl p-4 text-white">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-accent-500 mb-1 leading-none">Pro Tip</p>
                                            <p className="text-[9px] font-medium leading-relaxed opacity-80 uppercase tracking-tight">Use high-contrast branding icons (PNG/SVG) with transparent backgrounds for maximum cinematic impact.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Identity Name</label>
                                        <div className="relative group/input">
                                            <MousePointer2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                            <input value={newSocialLink.name} onChange={e => setNewSocialLink({ ...newSocialLink, name: e.target.value })} placeholder="e.g. Instagram Elite" className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Endpoint URL</label>
                                        <div className="relative group/input">
                                            <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                            <input value={newSocialLink.url} onChange={e => setNewSocialLink({ ...newSocialLink, url: e.target.value })} placeholder="https://instagram.com/willsther..." className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 border-t border-gray-50 bg-gray-50/30 flex gap-4">
                                <button onClick={() => setIsAddSocialLinkModalOpen(false)} className="flex-1 py-5 text-[10px] font-black text-secondary-500 uppercase tracking-widest hover:text-primary-900 transition-all">Abort</button>
                                <button
                                    onClick={addSocialLink}
                                    disabled={!newSocialLink.name || isUploading}
                                    className="flex-[2] py-5 bg-primary-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary-900/20 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                                >
                                    <Layers className="w-4 h-4" />
                                    <span>Establish Connector</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {socialLinkToDelete !== null && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-primary-900/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] p-10 max-sm w-full shadow-2xl text-center space-y-8"
                        >
                            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm shadow-rose-500/10">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-primary-900 tracking-tight uppercase">Purge Protocol</h3>
                                <p className="text-secondary-500 font-medium">Are you certain you wish to purge this social identity endpoint? This operation is irreversible.</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setSocialLinkToDelete(null)} className="flex-1 py-4 text-[10px] font-black text-secondary-500 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
                                <button onClick={() => { removeSocialLink(socialLinkToDelete); setSocialLinkToDelete(null); }} className="flex-1 py-4 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-500/20 active:scale-95 transition-all">Execute Purge</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
