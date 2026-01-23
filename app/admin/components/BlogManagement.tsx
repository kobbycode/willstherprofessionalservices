'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
    Plus,
    FileText,
    Eye,
    EyeOff,
    Calendar,
    Search,
    Edit,
    Trash2,
    X,
    TrendingUp,
    BarChart2,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    CheckCircle,
    Clock
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts'
import Skeleton from '@/components/Skeleton'
import toast from 'react-hot-toast'
import { formatDateHuman } from '@/lib/date'
import { BlogPost } from '@/lib/blog'
import { uploadImage } from '@/lib/storage'
import { useAuth } from '@/lib/auth-context'

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899']

export const BlogManagement = () => {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null)
    const [deletingPostId, setDeletingPostId] = useState<string | null>(null)
    const { user: currentUser } = useAuth()
    const isSuperAdmin = currentUser?.role === 'super_admin'
    const [showPostModal, setShowPostModal] = useState(false)
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
    const [savingPost, setSavingPost] = useState(false)
    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        image: '',
        tags: '' as string,
        status: 'draft' as 'draft' | 'published' | 'scheduled'
    })

    const load = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/posts', { cache: 'no-store' })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const { posts: list } = await res.json()
            setPosts(list)
        } catch (e) {
            console.error('Failed to load posts:', e)
            toast.error('Failed to load posts.')
            setPosts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    // Real-time subscription for updates
    useEffect(() => {
        let unsubscribe: undefined | (() => void)
            ; (async () => {
                try {
                    const { getDb } = await import('@/lib/firebase')
                    const { collection, query, orderBy, onSnapshot, limit: fsLimit } = await import('firebase/firestore')
                    const db = getDb()
                    const colRef = collection(db, 'posts')
                    let q = query(colRef, orderBy('createdAt', 'desc'), fsLimit(100))

                    unsubscribe = onSnapshot(q, (snap: any) => {
                        const list = snap.docs.map((d: any) => {
                            const data = d.data() || {}
                            return {
                                id: d.id,
                                ...data,
                                date: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
                            } as BlogPost
                        })
                        setPosts(list)
                    })
                } catch (e) {
                    console.error('Subscription error:', e)
                }
            })()
        return () => { if (unsubscribe) unsubscribe() }
    }, [])

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.category?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === 'all' || post.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [posts, searchTerm, statusFilter])

    const stats = useMemo(() => ({
        total: posts.length,
        published: posts.filter(p => p.status === 'published').length,
        draft: posts.filter(p => p.status === 'draft').length,
        views: posts.reduce((sum, p) => sum + (p.views || 0), 0)
    }), [posts])

    const categoryData = useMemo(() => {
        const counts: Record<string, number> = {}
        posts.forEach(p => {
            const cat = p.category || 'Uncategorized'
            counts[cat] = (counts[cat] || 0) + 1
        })
        return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }, [posts])

    const viewData = useMemo(() => {
        return [...posts]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5)
            .map(p => ({
                name: p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title,
                views: p.views || 0
            }))
    }, [posts])

    const openCreate = () => {
        setEditingPost(null)
        setForm({ title: '', excerpt: '', content: '', category: '', image: '', tags: '', status: 'draft' })
        setShowPostModal(true)
    }

    const openEdit = (post: BlogPost) => {
        setEditingPost(post)
        setForm({
            title: post.title || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            category: post.category || '',
            image: post.image || '',
            tags: (post.tags || []).join(', '),
            status: post.status as any
        })
        setShowPostModal(true)
    }

    const savePost = async () => {
        if (!form.title.trim()) {
            toast.error('Title is required')
            return
        }
        setSavingPost(true)
        try {
            const { createPost, updatePost } = await import('@/lib/blog')
            const payload = {
                ...form,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
            }
            if (editingPost) {
                await updatePost(editingPost.id, payload)
                toast.success('Post updated')
            } else {
                await createPost(payload)
                toast.success('Post created')
            }
            setShowPostModal(false)
        } catch (e) {
            toast.error('Failed to save post')
        } finally {
            setSavingPost(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight">Blog Management</h2>
                    <p className="text-secondary-600 font-medium mt-1">Editorial control and audience engagement analytics</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-white rounded-2xl shadow-premium border border-gray-100 p-1">
                        {['all', 'published', 'draft'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${statusFilter === f
                                        ? 'bg-primary-900 text-white shadow-lg'
                                        : 'text-secondary-400 hover:text-primary-900'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-primary-900 font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-accent-500/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Post</span>
                    </button>
                </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Posts', value: stats.total, icon: FileText, color: 'blue', trend: '+4 this month' },
                    { label: 'Published', value: stats.published, icon: CheckCircle, color: 'emerald', trend: '92% Rate' },
                    { label: 'Pending Drafts', value: stats.draft, icon: Clock, color: 'amber', trend: 'Needs review' },
                    { label: 'Total Views', value: stats.views.toLocaleString(), icon: TrendingUp, color: 'purple', trend: '+18% Growth' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-3xl shadow-premium p-6 border border-gray-100 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-20 h-20 bg-${stat.color}-500/5 -mr-6 -mt-6 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black text-primary-900 leading-none">{stat.value}</h3>
                                <p className="text-[9px] font-bold text-secondary-500 mt-2 flex items-center gap-1 uppercase tracking-wider">
                                    <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                                    {stat.trend}
                                </p>
                            </div>
                            <div className={`p-4 bg-${stat.color}-500 rounded-2xl shadow-lg shadow-${stat.color}-500/20`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-premium p-8 border border-gray-100 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-primary-900">Article Reach</h3>
                            <p className="text-xs text-secondary-500 font-bold uppercase tracking-widest mt-1">Engagement per top post</p>
                        </div>
                        <BarChart2 className="w-5 h-5 text-secondary-300" />
                    </div>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={viewData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="views" fill="#3B82F6" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-premium p-8 border border-gray-100 flex flex-col h-[400px]">
                    <div className="mb-6">
                        <h3 className="text-xl font-black text-primary-900">Category Mix</h3>
                        <p className="text-xs text-secondary-500 font-bold uppercase tracking-widest mt-1">Content Distribution</p>
                    </div>
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black text-primary-900">{categoryData.length}</span>
                            <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">topics</span>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {categoryData.slice(0, 4).map((cat, i) => (
                            <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                                <span className="text-[10px] font-black text-secondary-500 uppercase">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-900 transition-colors w-4 h-4" />
                        <input
                            type="text"
                            placeholder="SEARCH ARTICLES..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-gray-50/50 border-none rounded-2xl text-[11px] font-black tracking-widest uppercase focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none text-primary-900"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Post Info</th>
                                <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Reach</th>
                                <th className="px-6 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}><td colSpan={6} className="px-8 py-6"><Skeleton className="h-12 w-full rounded-2xl" /></td></tr>
                                ))
                            ) : filteredPosts.length === 0 ? (
                                <tr><td colSpan={6} className="px-8 py-20 text-center font-black text-secondary-300 uppercase tracking-widest">No articles found</td></tr>
                            ) : filteredPosts.map((post) => (
                                <tr key={post.id} className="group hover:bg-gray-50/80 transition-all duration-300">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-inner">
                                                {post.image ? (
                                                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : <FileText className="w-5 h-5 m-auto text-secondary-300" />}
                                            </div>
                                            <div className="max-w-[180px]">
                                                <p className="text-sm font-black text-primary-900 truncate tracking-tight">{post.title}</p>
                                                <p className="text-[10px] font-bold text-secondary-400 uppercase mt-0.5 truncate">{post.excerpt}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className="px-4 py-1 bg-primary-100/50 text-primary-900 text-[10px] font-black uppercase tracking-widest rounded-full">{post.category}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${post.status === 'published' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${post.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-black text-primary-900">{(post.views || 0).toLocaleString()}</span>
                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${Math.min(100, (post.views || 0) / (stats.views / posts.length || 1) * 50)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <p className="text-[10px] font-black text-secondary-500 uppercase tracking-tighter">{formatDateHuman(post.date)}</p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                            <button onClick={() => openEdit(post)} className="p-2.5 bg-white border border-gray-100 text-blue-500 rounded-xl shadow-sm hover:bg-blue-500 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                                            {isSuperAdmin && (
                                                <button onClick={() => setShowDeleteDialog(post.id)} className="p-2.5 bg-white border border-gray-100 text-rose-500 rounded-xl shadow-sm hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal & Dialog */}
            <AnimatePresence>
                {showPostModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-primary-900/40 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-primary-900">{editingPost ? 'Edit Article' : 'Draft New Article'}</h3>
                                    <p className="text-secondary-500 text-xs font-bold uppercase tracking-widest mt-1">Configure your content properties</p>
                                </div>
                                <button onClick={() => setShowPostModal(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"><X className="w-6 h-6 text-secondary-400" /></button>
                            </div>

                            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                    <div className="space-y-6 text-left">
                                        <div>
                                            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-2 ml-1">Title</label>
                                            <input
                                                value={form.title}
                                                onChange={e => setForm({ ...form, title: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-900 outline-none transition-all"
                                                placeholder="ENTER HEADLINE..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-2 ml-1">Excerpt</label>
                                            <textarea
                                                rows={3}
                                                value={form.excerpt}
                                                onChange={e => setForm({ ...form, excerpt: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-900 outline-none transition-all resize-none"
                                                placeholder="BRIEF SUMMARY..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                                                <input
                                                    value={form.category}
                                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                                    className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-[11px] font-black uppercase focus:ring-2 focus:ring-primary-900 outline-none"
                                                    placeholder="TOPIC..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-2 ml-1">Status</label>
                                                <select
                                                    value={form.status}
                                                    onChange={e => setForm({ ...form, status: e.target.value as any })}
                                                    className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-[11px] font-black uppercase focus:ring-2 focus:ring-primary-900 outline-none"
                                                >
                                                    <option value="draft">DRAFT</option>
                                                    <option value="published">PUBLISHED</option>
                                                    <option value="scheduled">SCHEDULED</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-2 ml-1">Cover Asset</label>
                                            <div className="relative aspect-video bg-gray-50 rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 group">
                                                {form.image ? (
                                                    <Image src={form.image} alt="Preview" fill className="object-cover" />
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                                        <BarChart2 className="w-8 h-8 text-secondary-200" />
                                                        <span className="text-[10px] font-black text-secondary-300 uppercase tracking-widest">No preview available</span>
                                                    </div>
                                                )}
                                                <label className="absolute inset-0 flex items-center justify-center bg-primary-900/80 opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                                                    <span className="text-white text-xs font-black uppercase tracking-widest">Replace Image</span>
                                                    <input type="file" className="hidden" onChange={e => {
                                                        const file = e.target.files?.[0]
                                                        if (file) {
                                                            uploadImage(file, 'posts').then(url => setForm({ ...form, image: url }))
                                                        }
                                                    }} />
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-2 ml-1">Tags (Comma Separated)</label>
                                            <input
                                                value={form.tags}
                                                onChange={e => setForm({ ...form, tags: e.target.value })}
                                                className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-[11px] font-black uppercase focus:ring-2 focus:ring-primary-900 outline-none"
                                                placeholder="NEXTJS, CLEANING, TIPS..."
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-2 ml-1">Full Article Content</label>
                                        <textarea
                                            rows={8}
                                            value={form.content}
                                            onChange={e => setForm({ ...form, content: e.target.value })}
                                            className="w-full px-6 py-6 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-900 outline-none transition-all leading-relaxed"
                                            placeholder="WRITE SOMETHING OUTSTANDING..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50 flex justify-end gap-4">
                                <button onClick={() => setShowPostModal(false)} className="px-8 py-3.5 text-[10px] font-black text-secondary-500 uppercase tracking-widest hover:text-primary-900 transition-colors">Abort Changes</button>
                                <button
                                    onClick={savePost}
                                    disabled={savingPost}
                                    className="px-10 py-3.5 bg-primary-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-900/20 active:scale-95 disabled:opacity-50 flex items-center gap-3"
                                >
                                    {savingPost && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                    <span>Deploy Article</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showDeleteDialog && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-primary-900/60 backdrop-blur-lg">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] p-10 max-w-sm w-full text-center shadow-2xl">
                            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Trash2 className="w-8 h-8 text-rose-500" />
                            </div>
                            <h3 className="text-xl font-black text-primary-900 mb-2">Eliminate Content?</h3>
                            <p className="text-secondary-500 text-sm font-medium mb-8">This action is permanent and will remove the article from all public feeds.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setShowDeleteDialog(null)} className="py-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-secondary-500 rounded-2xl hover:bg-gray-100 transition-colors">Cancel</button>
                                <button
                                    onClick={async () => {
                                        const { deletePost } = await import('@/lib/blog')
                                        await deletePost(showDeleteDialog)
                                        setShowDeleteDialog(null)
                                        toast.success('Post eliminated')
                                    }}
                                    className="py-4 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-500/30 active:scale-95"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
