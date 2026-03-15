'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Trash2,
    Type,
    FileText,
    Zap,
    LayoutGrid,
    Users,
    Building,
    Star,
    TrendingUp,
    Hash,
    Palette
} from 'lucide-react'
import toast from 'react-hot-toast'

interface StatsConfigProps {
    config: any
    onChange: (next: any) => void
}

const iconOptions = ['Users', 'Building', 'Star', 'TrendingUp']
const colorOptions = [
    { label: 'Primary', value: 'bg-primary-500' },
    { label: 'Accent', value: 'bg-accent-500' },
    { label: 'Green', value: 'bg-green-500' },
    { label: 'Purple', value: 'bg-purple-500' },
    { label: 'Blue', value: 'bg-blue-500' },
    { label: 'Rose', value: 'bg-rose-500' }
]

export const StatsConfig = ({ config, onChange }: StatsConfigProps) => {
    const stats = config.stats || { title: '', subtitle: '', items: [] }
    const items = stats.items || []

    const updateStats = (key: string, value: any) => {
        onChange({
            ...config,
            stats: { ...stats, [key]: value }
        })
    }

    const updateItem = (index: number, key: string, value: any) => {
        const nextItems = [...items]
        nextItems[index] = { ...nextItems[index], [key]: value }
        updateStats('items', nextItems)
    }

    const addItem = () => {
        const newItem = {
            icon: 'Building',
            number: '0',
            label: 'New Stat',
            color: 'bg-primary-500'
        }
        updateStats('items', [...items, newItem])
        toast.success('Stat metrics initialized')
    }

    const removeItem = (index: number) => {
        updateStats('items', items.filter((_: any, i: number) => i !== index))
        toast.error('Metric deleted')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight uppercase">Performance Metrics</h2>
                    <p className="text-secondary-500 font-medium tracking-widest text-[10px] uppercase">Management of global performance statistics and organizational impact</p>
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
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deploy New Metric</span>
                    </div>
                </button>
            </div>

            {/* Title & Subtitle Config */}
            <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
                    <div className="flex items-center gap-3">
                        <Type className="w-5 h-5 text-primary-900" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary-900">Section Identification</h3>
                    </div>
                </div>

                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Main Heading</label>
                        <div className="relative group/input">
                            <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                            <input
                                value={stats.title || ''}
                                onChange={(e) => updateStats('title', e.target.value)}
                                className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-[12px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                placeholder="e.g. Our Services in Numbers"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Supporting Narrative</label>
                        <div className="relative group/input">
                            <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                            <input
                                value={stats.subtitle || ''}
                                onChange={(e) => updateStats('subtitle', e.target.value)}
                                className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-[12px] font-medium text-secondary-600 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                placeholder="Delivering exceptional results..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <AnimatePresence mode='popLayout'>
                    {items.map((item: any, i: number) => (
                        <motion.div
                            key={i}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-premium overflow-hidden group hover:border-primary-900/10 transition-all flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                <div className={`w-10 h-10 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                                    <LayoutGrid className="w-5 h-5" />
                                </div>
                                <button
                                    onClick={() => removeItem(i)}
                                    className="w-8 h-8 rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-secondary-300 uppercase tracking-widest px-2">Metric Value</label>
                                    <input
                                        value={item.number || ''}
                                        onChange={(e) => updateItem(i, 'number', e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-2xl font-black text-primary-900 focus:ring-2 focus:ring-primary-900 transition-all outline-none"
                                        placeholder="e.g. 100%"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-secondary-300 uppercase tracking-widest px-2">Identifier Label</label>
                                    <input
                                        value={item.label || ''}
                                        onChange={(e) => updateItem(i, 'label', e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[11px] font-bold text-secondary-600 focus:ring-2 focus:ring-primary-900 transition-all outline-none"
                                        placeholder="Satisfied Customers"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-secondary-300 uppercase tracking-widest px-2 flex items-center gap-2">
                                            <Zap className="w-3 h-3" /> Icon
                                        </label>
                                        <select
                                            value={item.icon || 'Building'}
                                            onChange={(e) => updateItem(i, 'icon', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-[10px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 outline-none"
                                        >
                                            {iconOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-secondary-300 uppercase tracking-widest px-2 flex items-center gap-2">
                                            <Palette className="w-3 h-3" /> Aura
                                        </label>
                                        <select
                                            value={item.color || 'bg-primary-500'}
                                            onChange={(e) => updateItem(i, 'color', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-[10px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 outline-none"
                                        >
                                            {colorOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <button
                    onClick={addItem}
                    className="aspect-square border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-secondary-300 hover:bg-gray-50 hover:border-primary-900/20 hover:text-primary-900 transition-all group"
                >
                    <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all">
                        <Plus className="w-8 h-8 text-accent-500" />
                    </div>
                    <div className="space-y-1">
                        <span className="font-black text-[10px] uppercase tracking-[0.3em]">Sync New Metric</span>
                    </div>
                </button>
            </div>
        </motion.div>
    )
}
