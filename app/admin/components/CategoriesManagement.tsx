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
    Boxes,
    Download,
    RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchServiceCategories, addServiceCategory, updateServiceCategory, deleteServiceCategory, ServiceCategory } from '@/lib/categories'
import ConfirmDialog from '@/components/ConfirmDialog'

export const CategoriesManagement = () => {
    const [items, setItems] = useState<ServiceCategory[]>([])
    const [loading, setLoading] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newSubtitle, setNewSubtitle] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingTitle, setEditingTitle] = useState('')
    const [editingSubtitle, setEditingSubtitle] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; categoryId: string | null }>({ open: false, categoryId: null })

    const load = async () => {
        setLoading(true)
        try {
            const list = await fetchServiceCategories()
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
        const title = newTitle.trim()
        if (!title) {
            toast.error('Please enter a category title')
            return
        }
        setIsAdding(true)
        try {
            await addServiceCategory({ title, subtitle: newSubtitle.trim(), imageUrl: '' })
            setNewTitle('')
            setNewSubtitle('')
            toast.success('Category saved')
            load()
        } catch (e) {
            toast.error('Failed to add category')
        } finally {
            setIsAdding(false)
        }
    }

    const handleUpdate = async (id: string) => {
        if (!editingTitle.trim()) return
        setIsUpdating(true)
        try {
            await updateServiceCategory(id, { title: editingTitle.trim(), subtitle: editingSubtitle.trim() })
            toast.success('Category updated')
            setEditingId(null)
            load()
        } catch (e) {
            toast.error('Sync failure')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteConfirm.categoryId) return
        setIsDeleting(deleteConfirm.categoryId)
        try {
            await deleteServiceCategory(deleteConfirm.categoryId)
            toast.success('Category Deleted')
            setDeleteConfirm({ open: false, categoryId: null })
            load()
        } catch (e) {
            toast.error('Failed to delete')
        } finally {
            setIsDeleting(null)
        }
    }

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )



    return (
        <>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Header & Add Category */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight uppercase">What We Offer</h2>
                    <p className="text-secondary-500 font-medium tracking-widest text-[12px] uppercase">Manage "What We Offer" cards and Service Categories</p>

                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-[2rem] border border-gray-100 shadow-premium w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300" />
                        <input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Category Title..."
                            className="w-full pl-14 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-[14px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                        />
                    </div>
                    <div className="relative flex-1 sm:w-64">
                        <Layers className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300" />
                        <input
                            value={newSubtitle}
                            onChange={(e) => setNewSubtitle(e.target.value)}
                            placeholder="Subtitle (optional)..."
                            className="w-full pl-14 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-[14px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={isAdding}
                        className="group relative px-10 py-4 bg-primary-900 text-white rounded-2xl shadow-xl shadow-primary-900/20 hover:shadow-primary-900/40 transition-all active:scale-95 overflow-hidden disabled:opacity-30 disabled:grayscale w-full sm:w-auto shrink-0"
                    >
                        <div className="relative flex items-center justify-center gap-3">
                            {isAdding ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4 text-accent-500" />
                            )}
                            <span className="text-[12px] font-black uppercase tracking-[0.2em]">Add Category</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="relative group/search w-full max-w-md">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/search:text-primary-900 transition-colors" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full pl-14 pr-8 py-4 bg-white border border-gray-100 rounded-[2rem] text-[13px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 transition-all outline-none shadow-premium"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-premium overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-10 py-6 text-left text-[12px] font-black text-secondary-400 uppercase tracking-[0.3em] border-b border-gray-50">Category Details</th>
                                <th className="px-10 py-6 text-left text-[12px] font-black text-secondary-400 uppercase tracking-[0.3em] border-b border-gray-50">Subtitle</th>
                                <th className="px-10 py-6 text-right text-[12px] font-black text-secondary-400 uppercase tracking-[0.3em] border-b border-gray-50">Actions</th>
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
                                        <h3 className="text-xl font-black text-primary-900 uppercase tracking-tight">No Categories Found</h3>
                                        <p className="text-[12px] font-bold text-secondary-300 uppercase tracking-widest mt-2">{searchQuery ? 'No categories match your search' : 'No categories found in the system'}</p>
                                    </td>
                                </tr>
                            ) : filteredItems.map((c) => (
                                <motion.tr
                                    key={c.id}
                                    layout
                                    className="group hover:bg-gray-50/50 transition-colors"
                                >
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
                                                        value={editingTitle}
                                                        onChange={(e) => setEditingTitle(e.target.value)}
                                                        className="w-full max-w-sm px-6 py-3 bg-white border-2 border-primary-900 rounded-xl text-[14px] font-black text-primary-900 outline-none shadow-xl"
                                                        autoFocus
                                                    />
                                                </motion.div>
                                            ) : (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary-300 border border-gray-100 group-hover:bg-primary-900 group-hover:text-white transition-all">
                                                        <Hash className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <span className="block text-[15px] font-black text-primary-900 uppercase tracking-tight">{c.title}</span>
                                                        <span className="text-[12px] font-mono text-secondary-300 uppercase tracking-wider">{c.id.substring(0, 8)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </AnimatePresence>
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
                                                        value={editingSubtitle}
                                                        onChange={(e) => setEditingSubtitle(e.target.value)}
                                                        className="w-full max-w-sm px-6 py-3 bg-white border-2 border-primary-900 rounded-xl text-[14px] font-black text-primary-900 outline-none shadow-xl"
                                                    />
                                                </motion.div>
                                            ) : (
                                                <span className="text-[14px] font-medium text-secondary-500">
                                                    {c.subtitle || <span className="text-secondary-300 italic">No subtitle</span>}
                                                </span>
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
                                                        onClick={() => { setEditingId(c.id); setEditingTitle(c.title); setEditingSubtitle(c.subtitle) }}
                                                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        disabled={isDeleting === c.id}
                                                        onClick={() => setDeleteConfirm({ open: true, categoryId: c.id })}
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


            </div>
        </motion.div>

        <ConfirmDialog
            isOpen={deleteConfirm.open}
            onClose={() => setDeleteConfirm({ open: false, categoryId: null })}
            onConfirm={handleDelete}
            title="Delete Category"
            message="Are you sure you want to delete this category? It will also be removed from 'What We Offer'."
            confirmText="Delete"
            type="danger"
        />
        </>
    )
}
