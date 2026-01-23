'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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

    const load = async () => {
        setLoading(true)
        try {
            const list = await fetchCategoriesWithIds()
            setItems(list)
        } catch (e) {
            console.error('Failed to load categories:', e)
            toast.error('Failed to load categories')
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
            toast.success('Category added')
            load()
        } catch (e) {
            toast.error('Failed to add category')
        } finally {
            setIsAdding(false)
        }
    }

    const handleUpdate = async (id: string) => {
        setIsUpdating(true)
        try {
            await updateCategory(id, editingName.trim())
            toast.success('Updated')
            setEditingId(null)
            load()
        } catch (e) {
            toast.error('Failed to update')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async (id: string) => {
        setIsDeleting(id)
        try {
            await deleteCategory(id)
            toast.success('Deleted')
            load()
        } catch (e) {
            toast.error('Failed to delete')
        } finally {
            setIsDeleting(null)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Categories</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New category name" className="px-3 py-2 text-sm border rounded-lg w-full sm:w-auto" />
                    <button onClick={handleAdd} disabled={isAdding} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
                        {isAdding ? 'Adding...' : 'Add'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                [...Array(3)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-3 sm:px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                        <td className="px-3 sm:px-6 py-4"><Skeleton className="h-8 w-24" /></td>
                                    </tr>
                                ))
                            ) : items.length === 0 ? (
                                <tr><td colSpan={2} className="px-3 sm:px-6 py-8 text-center text-gray-500">No categories</td></tr>
                            ) : items.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-3 sm:px-6 py-4">
                                        {editingId === c.id ? (
                                            <input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="px-2 py-1 text-sm border rounded w-full sm:w-auto" />
                                        ) : (
                                            <span className="text-sm text-gray-900">{c.name}</span>
                                        )}
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 text-sm font-medium flex gap-2">
                                        {editingId === c.id ? (
                                            <>
                                                <button className="text-green-600 disabled:opacity-50" disabled={isUpdating} onClick={() => handleUpdate(c.id)}>{isUpdating ? 'Saving...' : 'Save'}</button>
                                                <button className="text-gray-600" onClick={() => setEditingId(null)}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="text-blue-600" onClick={() => { setEditingId(c.id); setEditingName(c.name) }}>Edit</button>
                                                <button className="text-red-600 disabled:opacity-50" disabled={isDeleting === c.id} onClick={() => handleDelete(c.id)}>{isDeleting === c.id ? 'Deleting...' : 'Delete'}</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    )
}
