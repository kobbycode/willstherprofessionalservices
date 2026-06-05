'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Trash2,
    GripVertical,
    Link as LinkIcon,
    ExternalLink,
    Shield,
    Layout,
    MousePointer2,
    ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

import { SiteConfig, ConfigOnChange } from '@/lib/site-config'

interface NavigationConfigProps {
    config: SiteConfig
    onChange: ConfigOnChange
    onSave?: () => Promise<void>
}

export const NavigationConfig = ({ config, onChange, onSave }: NavigationConfigProps) => {
    const rawNav = config.navigation
    const navigation = Array.isArray(rawNav)
        ? { main: rawNav, legal: [] }
        : (rawNav || { main: [], legal: [] })
    const mainLinks = navigation.main || []
    const legalLinks = navigation.legal || []

    const update = (key: string, value: any) => onChange((prev: any) => ({ ...prev, navigation: { ...(prev.navigation || {}), [key]: value } }))

    const getLinks = (section: 'main' | 'legal') => section === 'main' ? mainLinks : legalLinks

    const updateLink = (section: 'main' | 'legal', index: number, field: string, value: string) => {
        const links = getLinks(section)
        const newLinks = [...links]
        newLinks[index] = { ...newLinks[index], [field]: value }
        update(section, newLinks)
    }

    const addLink = (section: 'main' | 'legal') => {
        const links = getLinks(section)
        const defaultName = section === 'main' ? 'New Navigation Link' : 'New Legal Setting'
        update(section, [...links, { name: defaultName, href: '#' }])
        toast.success(`${section === 'main' ? 'Interface' : 'Legal'} endpoint established`)
    }

    const removeLink = (section: 'main' | 'legal', index: number) => {
        const links = getLinks(section)
        update(section, links.filter((_: any, i: number) => i !== index))
        toast.error('Endpoint deleted')
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12 pb-20"
        >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight uppercase">Manager Map</h2>
                    <p className="text-secondary-500 font-medium tracking-widest text-[10px] uppercase">Management of global navigation hierarchies and legal Settings</p>
                </div>

                <div className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-3xl shadow-premium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-primary-900 uppercase tracking-widest">Master Routing Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Main Navigation Segment */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-900/5 rounded-xl text-primary-900"><Layout className="w-5 h-5" /></div>
                            <h3 className="text-xl font-black text-primary-900 uppercase tracking-tight">Interface Hierarchy</h3>
                        </div>
                        <button
                            onClick={() => addLink('main')}
                            className="p-3 bg-primary-900 text-white rounded-2xl shadow-lg shadow-primary-900/10 hover:shadow-primary-900/20 active:scale-95 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode='popLayout'>
                            {mainLinks.map((link: any, index: number) => (
                                <motion.div
                                    key={`main-${index}`}
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group relative bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-premium hover:border-primary-900/10 transition-all flex flex-col md:flex-row items-center gap-4"
                                >
                                    <div className="shrink-0 p-3 bg-gray-50 text-secondary-300 rounded-2xl group-hover:bg-primary-900/5 group-hover:text-primary-900 transition-colors">
                                        <GripVertical className="w-4 h-4" />
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        <div className="relative group/input">
                                            <MousePointer2 className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                            <input
                                                value={link.name}
                                                onChange={(e) => updateLink('main', index, 'name', e.target.value)}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border-none rounded-2xl text-[12px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                                placeholder="Label Master"
                                            />
                                        </div>
                                        <div className="relative group/input">
                                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                            <input
                                                value={link.href}
                                                onChange={(e) => updateLink('main', index, 'href', e.target.value)}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border-none rounded-2xl text-[12px] font-bold text-secondary-400 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                                placeholder="Redirect Path"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeLink('main', index)}
                                        className="shrink-0 p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-95"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Legal Navigation Segment */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-900/5 rounded-xl text-primary-900"><Shield className="w-5 h-5" /></div>
                            <h3 className="text-xl font-black text-primary-900 uppercase tracking-tight">Compliance Setting</h3>
                        </div>
                        <button
                            onClick={() => addLink('legal')}
                            className="p-3 bg-primary-900 text-white rounded-2xl shadow-lg shadow-primary-900/10 hover:shadow-primary-900/20 active:scale-95 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode='popLayout'>
                            {legalLinks.map((link: any, index: number) => (
                                <motion.div
                                    key={`legal-${index}`}
                                    layout
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group relative bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-premium hover:border-primary-900/10 transition-all flex flex-col md:flex-row items-center gap-4"
                                >
                                    <div className="shrink-0 p-3 bg-gray-50 text-secondary-300 rounded-2xl group-hover:bg-primary-900/5 group-hover:text-primary-900 transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        <input
                                            value={link.name}
                                            onChange={(e) => updateLink('legal', index, 'name', e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50/50 border-none rounded-2xl text-[12px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                            placeholder="Compliance Label"
                                        />
                                        <div className="relative group/input">
                                            <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                            <input
                                                value={link.href}
                                                onChange={(e) => updateLink('legal', index, 'href', e.target.value)}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border-none rounded-2xl text-[12px] font-bold text-secondary-400 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                                placeholder="Legal Endpoint"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeLink('legal', index)}
                                        className="shrink-0 p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-95"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
