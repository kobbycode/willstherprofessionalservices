'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, Trash2 } from 'lucide-react'
import Skeleton from '@/components/Skeleton'
import toast from 'react-hot-toast'
import { fetchContactSubmissions, updateContactStatus, deleteContactSubmission, type ContactSubmission } from '@/lib/contacts'
import { formatDateHuman } from '@/lib/date'
import { useAuth } from '@/lib/auth-context'
import { X } from 'lucide-react'

export const ContactManagement = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
    const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'completed'>('all')
    const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
    const { user: currentUser } = useAuth()
    const isSuperAdmin = currentUser?.role === 'super_admin'

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
        if (!isSuperAdmin) {
            toast.error('Only super admins can delete submissions')
            return
        }
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
                                            <button onClick={() => setSelectedSubmission(s)} className="text-blue-600 hover:text-blue-800" title="View details"><Eye className="w-4 h-4" /></button>
                                            {isSuperAdmin && (
                                                <button onClick={() => remove(s.id)} className="text-red-600 hover:text-red-800" title="Delete submission"><Trash2 className="w-4 h-4" /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
                    >
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold text-gray-900">Submission Details</h3>
                            <button onClick={() => setSelectedSubmission(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Name</label>
                                    <p className="text-gray-900 font-medium">{selectedSubmission.firstName} {selectedSubmission.lastName}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Service</label>
                                    <p className="text-gray-900 font-medium">{selectedSubmission.service || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                                    <p className="text-gray-900 font-medium">{selectedSubmission.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
                                    <p className="text-gray-900 font-medium">{selectedSubmission.phone || 'N/A'}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Message</label>
                                <div className="mt-2 p-4 bg-gray-50 rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {selectedSubmission.message}
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Submitted On</label>
                                    <p className="text-sm text-gray-600">{formatDateHuman(selectedSubmission.createdAt || '')}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Status</label>
                                    <select
                                        value={selectedSubmission.status}
                                        onChange={(e) => {
                                            const nextStatus = e.target.value as any
                                            changeStatus(selectedSubmission.id, nextStatus)
                                            setSelectedSubmission({ ...selectedSubmission, status: nextStatus })
                                        }}
                                        className="px-3 py-1.5 text-sm font-semibold rounded-lg border focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="new">New</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    )
}
