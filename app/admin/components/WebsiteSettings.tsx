'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Globe,
    Mail,
    Phone,
    AlertTriangle,
    Settings,
    ShieldCheck,
    Activity,
    Save,
    RotateCcw,
    Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

interface WebsiteSettingsProps {
    config: any
    onChange: (next: any) => void
}

export const WebsiteSettings = ({ config, onChange }: WebsiteSettingsProps) => {
    const [settings, setSettings] = useState({
        siteName: config.siteName || 'Willsther Professional Services',
        siteDescription: config.siteDescription || 'Professional cleaning and maintenance services',
        contactEmail: config.contactEmail || 'info@willsther.com',
        contactPhone: config.contactPhone || '+233 594 850 005',
        maintenanceMode: !!config.maintenanceMode
    })

    useEffect(() => {
        setSettings({
            siteName: config.siteName || 'Willsther Professional Services',
            siteDescription: config.siteDescription || 'Professional cleaning and maintenance services',
            contactEmail: config.contactEmail || 'info@willsther.com',
            contactPhone: config.contactPhone || '+233 594 850 005',
            maintenanceMode: !!config.maintenanceMode
        })
    }, [config])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onChange({ ...config, ...settings })
        toast.success('Core protocol parameters updated successfully')
    }

    const resetSettings = () => {
        setSettings({
            siteName: config.siteName || 'Willsther Professional Services',
            siteDescription: config.siteDescription || 'Professional cleaning and maintenance services',
            contactEmail: config.contactEmail || 'info@willsther.com',
            contactPhone: config.contactPhone || '+233 594 850 005',
            maintenanceMode: !!config.maintenanceMode
        })
        toast.error('Local settings reverted to global registry')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl space-y-12 pb-20"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight text-shadow-sm uppercase">Global Identity Registry</h2>
                    <p className="text-secondary-500 font-medium tracking-widest text-[10px] uppercase">Configure the master parameters of your digital ecosystem</p>
                </div>

                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <Activity className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">System Status</p>
                        <p className="text-xs font-black text-primary-900 mt-1 uppercase">Operational & Encrypted</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Brand Identity Intel */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
                        <div className="p-10 border-b border-gray-50 bg-gray-50/30 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary-900">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-primary-900 uppercase">Core Brand Matrix</h3>
                                <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Public-facing identity parameters</p>
                            </div>
                        </div>

                        <div className="p-10 space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Master Site Nomenclature</label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none shadow-inner"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Global Mission Statement (SEO Metadata)</label>
                                <textarea
                                    value={settings.siteDescription}
                                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                    rows={4}
                                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none shadow-inner resize-none"
                                />
                                <p className="text-[9px] font-medium text-secondary-400 italic block px-2">Optimized for semantic search indexing. Target: 150-160 characters.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
                        <div className="p-10 border-b border-gray-50 bg-gray-50/30 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary-900">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-primary-900 uppercase">Communication Grid</h3>
                                <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Global contact endpoints</p>
                            </div>
                        </div>

                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Support Liaison Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within:text-primary-900 transition-colors" />
                                    <input
                                        type="email"
                                        value={settings.contactEmail}
                                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                        className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Emergency Voice Protocol</label>
                                <div className="relative group">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within:text-primary-900 transition-colors" />
                                    <input
                                        type="text"
                                        value={settings.contactPhone}
                                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                        className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Security & Deployment Protocols */}
                <div className="space-y-8">
                    <div className="bg-primary-900 rounded-[2.5rem] p-10 shadow-2xl shadow-primary-900/40 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-all duration-700" />

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-accent-500" />
                                <h3 className="text-xl font-black uppercase tracking-tight">Security Matrix</h3>
                            </div>

                            <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Maintenance Lock</p>
                                        <p className="text-[9px] text-white/50 font-bold italic lowercase">Restrict public access</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                        className={`relative w-14 h-8 rounded-full transition-all duration-300 shadow-inner ${settings.maintenanceMode ? 'bg-rose-500' : 'bg-white/20'}`}
                                    >
                                        <motion.div
                                            animate={{ x: settings.maintenanceMode ? 28 : 4 }}
                                            className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                                        />
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {settings.maintenanceMode && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="pt-4 border-t border-white/10"
                                        >
                                            <div className="flex items-start gap-3 p-3 bg-rose-500/20 rounded-2xl border border-rose-500/30">
                                                <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                                                <p className="text-[9px] font-medium text-rose-100 leading-relaxed uppercase tracking-tighter">
                                                    Caution: Active maintenance protocol will display an intercept page to all external visitors.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="space-y-4 pt-10">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-accent-500 hover:bg-accent-400 text-primary-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <Save className="w-4 h-4" />
                                    Synchronize Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={resetSettings}
                                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Reset Protocol
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 text-primary-900">
                            <Zap className="w-5 h-5" />
                            <h4 className="text-sm font-black uppercase tracking-widest">Environment Intel</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                                <p className="text-[9px] font-black text-secondary-300 uppercase leading-none">Version</p>
                                <p className="text-xs font-black text-primary-900">v2.4.0-lux</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                                <p className="text-[9px] font-black text-secondary-300 uppercase leading-none">Zone</p>
                                <p className="text-xs font-black text-primary-900">GCP-EU-W2</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </motion.div>
    )
}
