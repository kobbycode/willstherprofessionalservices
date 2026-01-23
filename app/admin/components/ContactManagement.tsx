'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, Trash2 } from 'lucide-react'
import Skeleton from '@/components/Skeleton'
import toast from 'react-hot-toast'
import { fetchContactSubmissions, updateContactStatus, deleteContactSubmission, type ContactSubmission } from '@/lib/contacts'
import { formatDateHuman } from '@/lib/date'

export const ContactManagement = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
    const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'completed'>('all')

    useEffect(() => {
        let active = true
        const load = async () => {
            setIsLoading(true)
            try {
                const items = await fetchContactSubmissions()
                if (active) setSubmissions(items)
            } catch (e) {
                console.error('Failed to load submissions:', e)
                toast.error('Failed to load contact submissions')
                if (active) setSubmissions([])
            } finally {
                if (active) setIsLoading(false)
            }
        }
        load()
        return () => { active = false }
    }, [])

    const changeStatus = async (id: string, status: 'new' | 'in_progress' | 'completed') => {
        try {
            await updateContactStatus(id, status)
            setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s))
            toast.success('Status updated')
        } catch {
            toast.error('Failed to update status')
        }
    }

    const remove = async (id: string) => {
        if (!confirm('Are you sure you want to delete this submission?')) return
        try {
            await deleteContactSubmission(id)
            setSubmissions(prev => prev.filter(s => s.id !== id))
            toast.success('Submission deleted')
        } catch {
            toast.error('Failed to delete submission')
        }
    }

    const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter)

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Contact Form Management</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b space-y-3 sm:space-y-0 bg-gray-50/50">
                    <div className="flex flex-wrap items-center gap-2">
                        {(['all', 'new', 'in_progress', 'completed'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}>
                                {f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">{filtered.length} submissions</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Service</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Date</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <tr key={i}><td colSpan={5} className="px-6 py-4"><Skeleton className="h-10 w-full" /></td></tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No submissions found</td></tr>
                            ) : filtered.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50 align-top transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">{s.firstName} {s.lastName}</div>
                                        <div className="text-xs text-gray-500 mb-2">{s.email} {s.phone && `· ${s.phone}`}</div>
                                        <div className="text-xs text-gray-600 max-w-md line-clamp-2 italic">"{s.message}"</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 hidden sm:table-cell">{s.service || '—'}</td>
                                    <td className="px-6 py-4">
                                        <select value={s.status} onChange={(e) => changeStatus(s.id, e.target.value as any)} className="px-2 py-1 text-xs font-semibold rounded-lg border focus:ring-2 focus:ring-blue-500">
                                            <option value="new">New</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell whitespace-nowrap">{formatDateHuman(s.createdAt || '')}</td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex items-center space-x-3">
                                            <button className="text-blue-600 hover:text-blue-800"><Eye className="w-4 h-4" /></button>
                                            <button onClick={() => remove(s.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                                        </div>
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
