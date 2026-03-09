'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    Shield,
    Share2,
    Copyright,
    Facebook,
    Instagram,
    Twitter,
    Linkedin
} from 'lucide-react'

interface FooterConfigProps {
    config: any
    onChange: (next: any) => void
}

export const FooterConfig = ({ config, onChange }: FooterConfigProps) => {
    const footer = config.footer || {}
    const social = footer.social || { facebook: '', instagram: '', twitter: '', linkedin: '' }

    const updateFooter = (key: string, value: any) => {
        onChange({
            ...config,
            footer: { ...footer, [key]: value }
        })
    }

    const updateSocial = (platform: string, url: string) => {
        onChange({
            ...config,
            footer: {
                ...footer,
                social: { ...social, [platform]: url }
            }
        })
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
                                onChange={(e) => updateFooter('copyright', e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[12px] font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                placeholder="e.g. © 2024 Willsther International"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Settings Segment */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary-900/5 rounded-2xl text-primary-900"><Share2 className="w-6 h-6" /></div>
                            <div>
                                <h3 className="text-xl font-black text-primary-900 uppercase tracking-tight">Social Ecosystem</h3>
                                <p className="text-[10px] font-bold text-secondary-300 uppercase tracking-widest">Connect your digital touchpoints</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Facebook URL</label>
                                <div className="relative group/input">
                                    <Facebook className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                    <input
                                        value={social.facebook || ''}
                                        onChange={(e) => updateSocial('facebook', e.target.value)}
                                        className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-[12px] font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Instagram URL</label>
                                <div className="relative group/input">
                                    <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                    <input
                                        value={social.instagram || ''}
                                        onChange={(e) => updateSocial('instagram', e.target.value)}
                                        className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-[12px] font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Twitter / X URL</label>
                                <div className="relative group/input">
                                    <Twitter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                    <input
                                        value={social.twitter || ''}
                                        onChange={(e) => updateSocial('twitter', e.target.value)}
                                        className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-[12px] font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                        placeholder="https://twitter.com/..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">LinkedIn URL</label>
                                <div className="relative group/input">
                                    <Linkedin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                    <input
                                        value={social.linkedin || ''}
                                        onChange={(e) => updateSocial('linkedin', e.target.value)}
                                        className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-[12px] font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
