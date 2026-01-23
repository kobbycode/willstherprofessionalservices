'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Eye,
    Trash2,
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    Filter,
    Search,
    Calendar,
    Mail,
    Phone,
    User,
    TrendingUp,
    BarChart2,
    X as CloseIcon,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts'
import Skeleton from '@/components/Skeleton'
import toast from 'react-hot-toast'
import { fetchContactSubmissions, updateContactStatus, deleteContactSubmission, type ContactSubmission } from '@/lib/contacts'
import { formatDateHuman } from '@/lib/date'
import { useAuth } from '@/lib/auth-context'

const STATUS_COLORS = {
    new: '#3B82F6',
    in_progress: '#F59E0B',
    completed: '#10B981'
}

export const ContactManagement = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
    const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'completed'>('all')
    const [searchTerm, setSearchTerm] = useState('')
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
                toast.error('Failed to load contact records')
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
            toast.success(`Protocol updated to ${status.replace('_', ' ')}`)
        } catch {
            toast.error('Status synchronization failed')
        }
    }

    const remove = async (id: string) => {
        if (!isSuperAdmin) {
            toast.error('Administrative override required for deletion')
            return
        }
        if (!confirm('Permanent deletion will purge this record. Proceed?')) return
        try {
            await deleteContactSubmission(id)
            setSubmissions(prev => prev.filter(s => s.id !== id))
            toast.success('Record purged from registry')
        } catch {
            toast.error('Registry deletion failed')
        }
    }

    const filtered = useMemo(() => {
        return submissions.filter(s => {
            const matchesFilter = filter === 'all' || s.status === filter
            const matchesSearch =
                `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.service || '').toLowerCase().includes(searchTerm.toLowerCase())
            return matchesFilter && matchesSearch
        })
    }, [submissions, filter, searchTerm])

    const stats = useMemo(() => {
        const counts = { new: 0, in_progress: 0, completed: 0 }
        submissions.forEach(s => { if (s.status in counts) counts[s.status as keyof typeof counts]++ })

        // Simplified trend data - daily counts for last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dateStr = d.toISOString().split('T')[0]
            const count = submissions.filter(s => s.createdAt?.startsWith(dateStr)).length
            return { date: d.toLocaleDateString('en-US', { weekday: 'short' }), count }
        }).reverse()

        return { counts, trend: last7Days, totalValue: submissions.length }
    }, [submissions])

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight text-shadow-sm">Inquiry Intelligence</h2>
                    <p className="text-secondary-600 font-medium mt-1 uppercase tracking-[0.1em] text-[10px]">Registry of client engagements and service requests</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 flex">
                        {(['all', 'new', 'in_progress', 'completed'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary-900 text-white shadow-lg' : 'text-secondary-400 hover:text-primary-900'}`}
                            >
                                {f === 'all' ? 'Every' : f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Unprocessed', value: stats.counts.new, icon: AlertCircle, color: 'blue' },
                    { label: 'Active Pipeline', value: stats.counts.in_progress, icon: Clock, color: 'amber' },
                    { label: 'Resolved Cases', value: stats.counts.completed, icon: CheckCircle2, color: 'emerald' },
                    { label: 'Total Volume', value: stats.totalValue, icon: MessageSquare, color: 'purple' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-3xl shadow-premium p-6 border border-gray-100 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className={`p-3 bg-${stat.color}-500/10 rounded-xl`}>
                                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                            </div>
                            <span className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Status</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-primary-900 leading-none">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-premium p-8 border border-gray-100 flex flex-col h-[350px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-primary-900 tracking-tight">Lead generation velocity</h3>
                            <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">Inquiry trends over last 7 cycles</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-secondary-300" />
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.trend}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-premium p-8 border border-gray-100 flex flex-col h-[350px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-primary-900 tracking-tight">Volume Split</h3>
                        <BarChart2 className="w-5 h-5 text-secondary-300" />
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'New', count: stats.counts.new, color: '#3B82F6' },
                                { name: 'Active', count: stats.counts.in_progress, color: '#F59E0B' },
                                { name: 'Done', count: stats.counts.completed, color: '#10B981' }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none' }} />
                                <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={40}>
                                    {[0, 1, 2].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#F59E0B', '#10B981'][index]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Registry List */}
            <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-900 transition-colors w-4 h-4" />
                        <input
                            type="text"
                            placeholder="SEARCH INQUIRY REGISTRY..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border-none rounded-2xl text-[11px] font-black tracking-widest uppercase focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none text-primary-900"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Principal</th>
                                <th className="px-8 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Service Intent</th>
                                <th className="px-8 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Protocol Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}><td colSpan={5} className="px-8 py-4"><Skeleton className="h-14 w-full rounded-2xl" /></td></tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="px-8 py-20 text-center text-sm font-bold text-secondary-300 uppercase tracking-[0.3em]">No records found in active segment</td></tr>
                            ) : filtered.map((s) => (
                                <tr key={s.id} className="group hover:bg-gray-50/80 transition-colors">
                                    <td className="px-8 py-6">
                                        <div>
                                            <h4 className="font-black text-primary-900 tracking-tight">{s.firstName} {s.lastName}</h4>
                                            <p className="text-[11px] font-bold text-secondary-400 lowercase mt-1">{s.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-primary-900 uppercase tracking-widest">{s.service || 'General'}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${s.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : s.status === 'new' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                                            <select
                                                value={s.status}
                                                onChange={(e) => changeStatus(s.id, e.target.value as any)}
                                                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-primary-900 focus:ring-0 cursor-pointer"
                                            >
                                                <option value="new">NEW INQUIRY</option>
                                                <option value="in_progress">ENGAGED</option>
                                                <option value="completed">RESOLVED</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-secondary-400">
                                            <Calendar className="w-3 h-3" />
                                            <span className="text-[11px] font-bold">{formatDateHuman(s.createdAt || '')}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() => setSelectedSubmission(s)}
                                                className="p-2.5 bg-white text-primary-900 rounded-xl shadow-sm border border-gray-100 hover:bg-primary-900 hover:text-white transition-all"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {isSuperAdmin && (
                                                <button
                                                    onClick={() => remove(s.id)}
                                                    className="p-2.5 bg-white text-rose-500 rounded-xl shadow-sm border border-gray-100 hover:bg-rose-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Portal Modal */}
            <AnimatePresence>
                {selectedSubmission && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary-900/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-10 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-3xl font-black text-primary-900 tracking-tight">Luxury Detail Portal</h3>
                                    <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-[0.2em] mt-2">Intelligence Briefing #{selectedSubmission.id?.slice(-6)}</p>
                                </div>
                                <button onClick={() => setSelectedSubmission(null)} className="p-4 hover:bg-gray-100 rounded-2xl transition-colors"><CloseIcon className="w-6 h-6 text-secondary-400" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div className="flex items-start gap-5">
                                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600 font-black"><User className="w-6 h-6" /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest mb-1">Principal Identity</p>
                                                <h4 className="text-xl font-black text-primary-900">{selectedSubmission.firstName} {selectedSubmission.lastName}</h4>
                                                <div className="flex items-center gap-2 text-secondary-500 text-sm mt-1">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    <span>{selectedSubmission.email}</span>
                                                </div>
                                                {selectedSubmission.phone && (
                                                    <div className="flex items-center gap-2 text-secondary-500 text-sm mt-1">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        <span>{selectedSubmission.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-5">
                                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-purple-600 font-black"><CheckCircle2 className="w-6 h-6" /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest mb-1">Service Classification</p>
                                                <h4 className="text-xl font-black text-primary-900 group flex items-center gap-2 cursor-pointer">
                                                    {selectedSubmission.service || 'General Inquiry'}
                                                    <ArrowUpRight className="w-4 h-4 text-purple-300 group-hover:text-purple-600 transition-colors" />
                                                </h4>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8 p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100">
                                        <div>
                                            <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest mb-2">Engaged Status</p>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full ${STATUS_COLORS[selectedSubmission.status as keyof typeof STATUS_COLORS] || '#ccc'}`}></div>
                                                <span className="text-lg font-black text-primary-900 uppercase tracking-tighter">{selectedSubmission.status.replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest mb-2">Submission Cycle</p>
                                            <p className="text-sm font-bold text-primary-900 leading-relaxed">{formatDateHuman(selectedSubmission.createdAt || '')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest">Inquiry Manifesto</p>
                                    <div className="p-8 bg-primary-900 text-white rounded-[2rem] shadow-2xl shadow-primary-900/10 leading-relaxed font-medium italic text-lg">
                                        "{selectedSubmission.message}"
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                                <div className="flex items-center gap-4">
                                    <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Modify Engagement Lifecycle</p>
                                    <select
                                        value={selectedSubmission.status}
                                        onChange={(e) => {
                                            const s = e.target.value as any
                                            changeStatus(selectedSubmission.id, s)
                                            setSelectedSubmission({ ...selectedSubmission, status: s })
                                        }}
                                        className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary-900 focus:ring-2 focus:ring-primary-900 outline-none transition-all cursor-pointer shadow-sm"
                                    >
                                        <option value="new">Mark as New Inquiry</option>
                                        <option value="in_progress">Commence Engagement</option>
                                        <option value="completed">Archive Resolution</option>
                                    </select>
                                </div>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="px-10 py-4 bg-primary-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary-900/20 active:scale-95 transition-all"
                                >
                                    Dismiss Briefing
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
