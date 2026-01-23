'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
    X
} from 'lucide-react'
import Skeleton from '@/components/Skeleton'
import toast from 'react-hot-toast'
import { formatDateHuman } from '@/lib/date'
import { BlogPost } from '@/lib/blog'
import { uploadImage } from '@/lib/storage'
import { useAuth } from '@/lib/auth-context'

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
            toast.error('Failed to load posts. Check console for details.')
            setPosts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    useEffect(() => {
        let unsubscribe: undefined | (() => void)
            ; (async () => {
                try {
                    const { getDb } = await import('@/lib/firebase')
                    const { collection, query, orderBy, onSnapshot, limit: fsLimit } = await import('firebase/firestore')
                    const db = getDb()
                    const colRef = collection(db, 'posts')
                    let q: any
                    try {
                        q = query(colRef, orderBy('createdAt', 'desc'), fsLimit(50))
                    } catch {
                        q = query(colRef, fsLimit(50))
                    }
                    unsubscribe = onSnapshot(q, (snap: any) => {
                        const list = snap.docs.map((d: any) => {
                            const data = d.data() || {}
                            return {
                                id: d.id,
                                title: data.title || '',
                                excerpt: data.excerpt || '',
                                content: data.content || '',
                                author: data.author || 'Willsther Team',
                                date: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                                readTime: data.readTime || '1 min read',
                                category: data.category || 'General',
                                image: data.image || '',
                                tags: Array.isArray(data.tags) ? data.tags : [],
                                status: data.status || 'draft',
                                views: data.views || 0,
                                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
                            } as BlogPost
                        })
                        setPosts(list)
                    })
                } catch (e) {
                    // ignore subscription errors
                }
            })()
        return () => { if (unsubscribe) unsubscribe() }
    }, [])

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
            status: post.status
        })
        setShowPostModal(true)
    }

    const withTimeout = async <T,>(promise: Promise<T>, ms = 10000): Promise<T> => {
        return new Promise<T>((resolve, reject) => {
            const t = setTimeout(() => reject(new Error('Request timed out')), ms)
            promise.then((v) => { clearTimeout(t); resolve(v) }).catch((e) => { clearTimeout(t); reject(e) })
        })
    }

    const savePost = async () => {
        if (!form.title.trim() || !form.content.trim()) {
            toast.error('Title and content are required')
            return
        }
        setSavingPost(true)
        try {
            const { createPost, updatePost } = await import('@/lib/blog')
            const payload = {
                title: form.title.trim(),
                excerpt: form.excerpt.trim(),
                content: form.content,
                category: form.category.trim() || 'General',
                image: form.image.trim(),
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                status: form.status
            }
            if (editingPost) {
                await withTimeout(updatePost(editingPost.id, payload))
                toast.success('Post updated')
            } else {
                await withTimeout(createPost(payload))
                await load()
                toast.success('Post created')
            }
            setShowPostModal(false)
        } catch (e) {
            console.error('Save post failed:', e)
            const msg = (e as any)?.message || 'Failed to save post'
            toast.error(msg)
        } finally {
            setSavingPost(false)
        }
    }

    const handleImagePick = async (file?: File | null) => {
        if (!file) return
        try {
            const url = await uploadImage(file, `posts/cover-${Date.now()}`)
            setForm(prev => ({ ...prev, image: url }))
            toast.success('Image uploaded')
        } catch (e) {
            toast.error('Image upload failed')
        }
    }

    const handleDeletePost = async (postId: string) => {
        if (!isSuperAdmin) {
            toast.error('Only super admins can delete posts')
            return
        }
        setDeletingPostId(postId)
        try {
            const { deletePost } = await import('@/lib/blog')
            await deletePost(postId)
            setPosts((prev) => prev.filter((p) => p.id !== postId))
            toast.success('Post deleted')
            setShowDeleteDialog(null)
        } catch (e) {
            toast.error('Failed to delete post')
        } finally {
            setDeletingPostId(null)
        }
    }

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || post.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const stats = {
        total: posts.length,
        published: posts.filter(p => p.status === 'published').length,
        draft: posts.filter(p => p.status === 'draft').length,
        scheduled: posts.filter(p => p.status === 'scheduled').length
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                    <div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Blog Management</h2>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your blog posts and categories</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Link
                                href="/admin/test-status-fix"
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                            >
                                Fix Post Status
                            </Link>
                            <button
                                onClick={async () => {
                                    if (confirm('Publish all draft posts? This will make all posts visible on the website.')) {
                                        try {
                                            const res = await fetch('/api/posts/publish-all', { method: 'POST' })
                                            const data = await res.json()
                                            if (data.success) {
                                                toast.success(data.message)
                                                load()
                                            } else {
                                                toast.error(data.error || 'Failed to publish posts')
                                            }
                                        } catch (error) {
                                            toast.error('Failed to publish posts')
                                        }
                                    }
                                }}
                                className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                            >
                                Publish All Posts
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center sm:justify-start space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>New Post</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 sm:p-4 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm opacity-90">Total Posts</p>
                                <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
                            </div>
                            <FileText className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 sm:p-4 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm opacity-90">Published</p>
                                <p className="text-xl sm:text-2xl font-bold">{stats.published}</p>
                            </div>
                            <Eye className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 sm:p-4 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm opacity-90">Drafts</p>
                                <p className="text-xl sm:text-2xl font-bold">{stats.draft}</p>
                            </div>
                            <EyeOff className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 sm:p-4 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm opacity-90">Scheduled</p>
                                <p className="text-xl sm:text-2xl font-bold">{stats.scheduled}</p>
                            </div>
                            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Filters & Search</h3>
                <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search posts by title or content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Blog Posts</h3>
                    <p className="text-gray-600 mt-1">Showing {filteredPosts.length} of {posts.length} posts</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Post</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Views</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton className="h-16 w-16 rounded-lg" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-full max-w-[200px]" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-8 w-24" /></td>
                                    </tr>
                                ))
                            ) : filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center space-y-4">
                                            <FileText className="w-12 h-12 text-gray-300" />
                                            <p className="text-gray-500 font-medium">No posts found</p>
                                            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                            {post.image ? (
                                                <div className="relative w-full h-full">
                                                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                            <div className="text-sm text-gray-500">ID: {post.id}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.views || 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateHuman(post.date, 'en-GB')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => openEdit(post)} className="text-blue-600 hover:text-blue-900" title="Edit post">
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            <button
                                                className={post.status === 'published' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                                                title={post.status === 'published' ? 'Set as draft' : 'Publish post'}
                                                onClick={async () => {
                                                    try {
                                                        const { updatePostStatus } = await import('@/lib/blog')
                                                        const nextStatus = post.status === 'published' ? 'draft' : 'published'
                                                        await updatePostStatus(post.id, nextStatus)
                                                        setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, status: nextStatus } : p))
                                                        toast.success(`Post ${nextStatus}`)
                                                    } catch (e) {
                                                        toast.error('Failed to update status')
                                                    }
                                                }}
                                            >
                                                {post.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>

                                            {isSuperAdmin && (
                                                <button className="text-red-600 hover:text-red-900" title="Delete post" onClick={() => setShowDeleteDialog(post.id)}>
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

            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-full"><Trash2 className="w-6 h-6 text-red-600" /></div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                                <p className="text-sm text-gray-600">Are you sure you want to delete this post?</p>
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button onClick={() => setShowDeleteDialog(null)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                            <button onClick={() => handleDeletePost(showDeleteDialog)} disabled={deletingPostId === showDeleteDialog} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg flex items-center justify-center space-x-2">
                                {deletingPostId === showDeleteDialog ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Trash2 className="w-4 h-4" />}
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPostModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{editingPost ? 'Edit Post' : 'New Post'}</h3>
                            <button onClick={() => setShowPostModal(false)} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                            <textarea placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} />
                            <textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 border rounded-lg h-64" />
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-full px-3 py-2 border rounded-lg">
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="scheduled">Scheduled</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3">
                                <input placeholder="Cover Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="flex-1 px-3 py-2 border rounded-lg" />
                                <label className="px-3 py-2 bg-blue-600 text-white rounded-lg cursor-pointer">
                                    Upload
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImagePick(e.target.files?.[0])} />
                                </label>
                            </div>
                            <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowPostModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                            <button onClick={savePost} disabled={savingPost} className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-60">
                                {savingPost ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
