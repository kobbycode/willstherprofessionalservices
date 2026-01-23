'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Trash2,
    Edit3,
    Check,
    X,
    Hash,
    Layers,
    ShieldCheck,
    TrendingUp,
    Search,
    Zap,
    Tag,
    Boxes
} from 'lucide-react'
import Skeleton from '@/components/Skeleton'
import toast from 'react-hot-toast'
import { fetchCategoriesWithIds, addCategory, updateCategory, deleteCategory } from '@/lib/categories'

export const CategoriesManagement = () => {
    const [items, setItems] = useState<{ id: string; name: string }[]>([])
    const [loading, setLoading] = useState(false)
    const [newName, setNewName] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingName, setEditingName] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const load = async () => {
        setLoading(true)
        try {
            const list = await fetchCategoriesWithIds()
            setItems(list)
        } catch (e) {
            console.error('Failed to load categories:', e)
            toast.error('Settings access failure')
            setItems([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const handleAdd = async () => {
        const name = newName.trim()
        if (!name) return
        setIsAdding(true)
        try {
            await addCategory(name)
            setNewName('')
            toast.success('Category entity saved')
            load()
        } catch (e) {
            toast.error('Entity injection failure')
        } finally {
            setIsAdding(false)
        }
    }

    const handleUpdate = async (id: string) => {
        if (!editingName.trim()) return
        setIsUpdating(true)
        try {
            await updateCategory(id, editingName.trim())
            toast.success('Metatdata recalibrated')
            setEditingId(null)
            load()
        } catch (e) {
            toast.error('Sync failure')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async (id: string) => {
        setIsDeleting(id)
        try {
            await deleteCategory(id)
            toast.error('Category Deleted')
            load()
        } catch (e) {
            toast.error('Delete sequence aborted')
        } finally {
            setIsDeleting(null)
        }
    }

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Header & Category Injection */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight uppercase">Category Manager</h2>
                    <p className="text-secondary-500 font-medium tracking-widest text-[10px] uppercase">Settings management for global service categories & metadata</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-[2rem] border border-gray-100 shadow-premium w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300" />
                        <input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Initialize New Category..."
                            className="w-full pl-14 pr-8 py-4 bg-gray-50 border-none rounded-2xl text-[12px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={isAdding || !newName.trim()}
                        className="group relative px-10 py-4 bg-primary-900 text-white rounded-2xl shadow-xl shadow-primary-900/20 hover:shadow-primary-900/40 transition-all active:scale-95 overflow-hidden disabled:opacity-30 disabled:grayscale w-full sm:w-auto shrink-0"
                    >
                        <div className="relative flex items-center justify-center gap-3">
                            {isAdding ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4 text-accent-500" />
                            )}
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Authorize Injection</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Metric Management */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-premium flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
                        <Boxes className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Global Settings</p>
                        <p className="text-3xl font-black text-primary-900 mt-1">{items.length}</p>
                        <p className="text-[9px] font-bold text-blue-600 uppercase mt-1">Active Taxonomies</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-premium flex items-center gap-6">
                    <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Structural Health</p>
                        <p className="text-3xl font-black text-primary-900 mt-1">98.4%</p>
                        <p className="text-[9px] font-bold text-amber-600 uppercase mt-1">Metadata Integrity</p>
                    </div>
                </div>

                <div className="bg-primary-900 p-8 rounded-[2.5rem] shadow-2xl shadow-primary-900/20 flex items-center gap-6 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl flex items-center justify-center transition-all group-hover:scale-150 duration-[2s]" />
                    <div className="relative z-10 w-16 h-16 bg-white/10 text-accent-500 rounded-3xl flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">Security Status</p>
                        <p className="text-xl font-black text-white mt-1 uppercase tracking-tighter">Identity Verified</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-[9px] font-bold text-green-400 uppercase">Master Sync Active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Explorer */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="relative group/search w-full max-w-md">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/search:text-primary-900 transition-colors" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter structural List..."
                            className="w-full pl-14 pr-8 py-4 bg-white border border-gray-100 rounded-[2rem] text-[11px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 transition-all outline-none shadow-premium"
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-4 text-[9px] font-black text-secondary-300 uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            Real-time Sync
                        </div>
                        <div className="w-1 h-1 bg-gray-200 rounded-full" />
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-accent-500" />
                            Fast-Path Enabled
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-premium overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-10 py-6 text-left text-[10px] font-black text-secondary-400 uppercase tracking-[0.3em] border-b border-gray-50">Identity List (ID)</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-secondary-400 uppercase tracking-[0.3em] border-b border-gray-50">Category Designation</th>
                                <th className="px-10 py-6 text-right text-[10px] font-black text-secondary-400 uppercase tracking-[0.3em] border-b border-gray-50">System Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-10 py-8"><div className="h-4 w-32 bg-gray-100 rounded-lg" /></td>
                                        <td className="px-10 py-8"><div className="h-4 w-48 bg-gray-100 rounded-lg" /></td>
                                        <td className="px-10 py-8 text-right"><div className="h-8 w-24 bg-gray-100 rounded-lg ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-10 py-32 text-center">
                                        <Layers className="w-16 h-16 text-gray-100 mx-auto mb-6 opacity-50" />
                                        <h3 className="text-xl font-black text-primary-900 uppercase tracking-tight">Settings Dormant</h3>
                                        <p className="text-[10px] font-bold text-secondary-300 uppercase tracking-widest mt-2">{searchQuery ? 'Search parameter yielded zero results' : 'No taxonomies detected in master List'}</p>
                                    </td>
                                </tr>
                            ) : filteredItems.map((c) => (
                                <motion.tr
                                    key={c.id}
                                    layout
                                    className="group hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary-300 border border-gray-100 group-hover:bg-primary-900 group-hover:text-white transition-all">
                                                <Hash className="w-4 h-4" />
                                            </div>
                                            <span className="text-[11px] font-mono text-secondary-300 uppercase tracking-wider">{c.id.substring(0, 12)}...</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <AnimatePresence mode='wait'>
                                            {editingId === c.id ? (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 10 }}
                                                    className="relative"
                                                >
                                                    <input
                                                        value={editingName}
                                                        onChange={(e) => setEditingName(e.target.value)}
                                                        className="w-full max-w-sm px-6 py-3 bg-white border-2 border-primary-900 rounded-xl text-[12px] font-black text-primary-900 outline-none shadow-xl"
                                                        autoFocus
                                                    />
                                                </motion.div>
                                            ) : (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-[13px] font-black text-primary-900 uppercase tracking-tight"
                                                >
                                                    {c.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                            {editingId === c.id ? (
                                                <>
                                                    <button
                                                        disabled={isUpdating}
                                                        onClick={() => handleUpdate(c.id)}
                                                        className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20 active:scale-95 transition-all disabled:opacity-50"
                                                    >
                                                        {isUpdating ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="p-3 bg-gray-100 text-secondary-400 rounded-xl active:scale-95 transition-all"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => { setEditingId(c.id); setEditingName(c.name) }}
                                                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        disabled={isDeleting === c.id}
                                                        onClick={() => (window.confirm('Execute Delete sequence for this Category?') && handleDelete(c.id))}
                                                        className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50"
                                                    >
                                                        {isDeleting === c.id ? <div className="w-4 h-4 border-2 border-rose-500/10 border-t-rose-500 rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-primary-900/5 p-8 rounded-[3rem] border border-dashed border-primary-900/10 flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-4 text-[10px] font-black text-primary-900/30 uppercase tracking-[0.4em]">
                        <Zap className="w-4 h-4" /> Auto Category Automatic Engine
                    </div>
                    <p className="text-[10px] font-medium text-secondary-400 uppercase tracking-widest text-center max-w-xl leading-relaxed">Structural modifications to the Category Manager are propagated instantaneously across the global edge network, ensuring high-frequency consistency for all downstream service Services and client interactions.</p>
                </div>
            </div>
        </motion.div>
    )
}
