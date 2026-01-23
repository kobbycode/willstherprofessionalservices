'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Calendar,
  TrendingUp,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  LogOut,
  Image as ImageIcon,
  Map as MapIcon,
  LayoutGrid,
  Quote,
  Globe,
  Menu as MenuIcon,
  Wrench,
  Mail,
  Phone,
  X,
  User as UserIcon,
  ShoppingBag
} from 'lucide-react'
import Link from 'next/link'
import { formatDateHuman } from '@/lib/date'
import { useRouter } from 'next/navigation'
import AdminAuth from '@/components/AdminAuth'
import { useSiteConfig, defaultSiteConfig } from '@/lib/site-config'
import toast from 'react-hot-toast'
import { fetchContactSubmissions, updateContactStatus, deleteContactSubmission, type ContactSubmission } from '@/lib/contacts'
import { BlogPost } from '@/lib/blog'
import { type User } from '@/lib/users'
import { useAuth } from '@/lib/auth-context'
import { uploadImage } from '@/lib/storage'
import { getDb } from '@/lib/firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import HeroConfig from './HeroConfig'
import ServicesConfig from './ServicesConfig'
import ShopManagement from './ShopManagement'

const ConfigHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
  </div>
)

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const router = useRouter()
  const { config, setConfig } = useSiteConfig()
  const { user, signOut: authSignOut } = useAuth()

  const handleLogout = async () => {
    await authSignOut()
    toast.success('Logged out successfully')
  }

  // Handle escape key to close logout dialog
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLogoutDialog) {
        setShowLogoutDialog(false)
      }
    }

    if (showLogoutDialog) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [showLogoutDialog])

  // Handle click outside to close dialog
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowLogoutDialog(false)
    }
  }

  const saveConfig = (next: any) => setConfig(next)
  const resetConfig = () => setConfig(defaultSiteConfig)

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Admin Header */}
        <div className="bg-white shadow-lg border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Settings className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Admin Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">Manage your website content and settings</p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-semibold rounded-full border border-green-200">
                    Live System
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  title="Toggle Menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <MenuIcon className="w-5 h-5" />
                  )}
                </button>
                <Link
                  href="/admin/profile"
                  className="p-2 sm:p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                  title="Profile"
                >
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                </Link>
                <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 rounded-xl px-3 py-2 sm:px-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xs sm:text-sm font-bold">
                        {user?.displayName?.charAt(0) || 'A'}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">{user?.displayName || 'Admin User'}</p>
                    <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrator' : user?.role === 'editor' ? 'Editor' : 'User'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="flex items-center space-x-2 px-2 sm:px-3 py-2 sm:px-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:block">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Navigation */}
          <div className={`w-full lg:w-72 bg-white shadow-xl border-r border-gray-200 min-h-screen lg:min-h-0 transition-all duration-300 z-40 lg:z-auto ${isMobileMenuOpen ? 'block' : 'hidden lg:block'
            }`}>
            <nav className="p-4 sm:p-6">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Navigation</h2>
                <div className="space-y-1">
                  {[
                    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'from-blue-500 to-blue-600' },
                    { id: 'shop', label: 'Shop Management', icon: ShoppingBag, color: 'from-purple-600 to-pink-600' },
                    { id: 'blog', label: 'Blog Management', icon: FileText, color: 'from-green-500 to-green-600' },
                    { id: 'categories', label: 'Categories', icon: Filter, color: 'from-purple-500 to-purple-600' },
                    { id: 'users', label: 'User Management', icon: Users, color: 'from-orange-500 to-orange-600' },
                    { id: 'contact', label: 'Contact Forms', icon: MessageSquare, color: 'from-pink-500 to-pink-600' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsMobileMenuOpen(false) // Close mobile menu when tab is selected
                      }}
                      className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-left transition-all duration-200 group ${activeTab === item.id
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                          : 'text-gray-600 hover:bg-gray-50 hover:shadow-md'
                        }`}
                    >
                      <div className={`p-1.5 sm:p-2 rounded-lg ${activeTab === item.id ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <span className="font-semibold text-sm sm:text-base">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Website Content</h2>
                <div className="space-y-1">
                  {[
                    { id: 'hero', label: 'Hero Section', icon: ImageIcon, color: 'from-indigo-500 to-indigo-600' },
                    { id: 'services', label: 'Services', icon: Wrench, color: 'from-teal-500 to-teal-600' },
                    { id: 'about', label: 'About Section', icon: Quote, color: 'from-amber-500 to-amber-600' },
                    { id: 'testimonials', label: 'Testimonials', icon: Quote, color: 'from-rose-500 to-rose-600' },
                    { id: 'gallery', label: 'Gallery', icon: ImageIcon, color: 'from-cyan-500 to-cyan-600' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsMobileMenuOpen(false) // Close mobile menu when tab is selected
                      }}
                      className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-left transition-all duration-200 group ${activeTab === item.id
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                          : 'text-gray-600 hover:bg-gray-50 hover:shadow-md'
                        }`}
                    >
                      <div className={`p-1.5 sm:p-2 rounded-lg ${activeTab === item.id ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <span className="font-semibold text-sm sm:text-base">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Configuration</h2>
                <div className="space-y-1">
                  {[
                    { id: 'settings', label: 'Website Settings', icon: Settings, color: 'from-gray-600 to-gray-700' },
                    { id: 'navigation', label: 'Navigation', icon: MenuIcon, color: 'from-slate-500 to-slate-600' },
                    { id: 'footer', label: 'Footer Settings', icon: Globe, color: 'from-zinc-500 to-zinc-600' },
                    { id: 'seo', label: 'SEO Settings', icon: Globe, color: 'from-neutral-500 to-neutral-600' },
                    { id: 'map', label: 'Map Settings', icon: MapIcon, color: 'from-stone-500 to-stone-600' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsMobileMenuOpen(false) // Close mobile menu when tab is selected
                      }}
                      className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-left transition-all duration-200 group ${activeTab === item.id
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                          : 'text-gray-600 hover:bg-gray-50 hover:shadow-md'
                        }`}
                    >
                      <div className={`p-1.5 sm:p-2 rounded-lg ${activeTab === item.id ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <span className="font-semibold text-sm sm:text-base">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Analytics</h2>
                <div className="space-y-1">
                  <Link
                    href="/admin/analytics"
                    className="w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-left transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:shadow-md"
                  >
                    <div className="p-1.5 sm:p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </div>
                    <span className="font-semibold text-sm sm:text-base">Analytics Dashboard</span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8">
            {activeTab === 'overview' && (
              <OverviewTab setActiveTab={setActiveTab} />
            )}

            {activeTab === 'shop' && (
              <ShopManagement />
            )}

            {activeTab === 'blog' && (
              <BlogManagement />
            )}

            {activeTab === 'categories' && (
              <CategoriesManagement />
            )}

            {activeTab === 'users' && (
              <UserManagement />
            )}

            {activeTab === 'analytics' && (
              <OverviewTab setActiveTab={setActiveTab} />
            )}

            {activeTab === 'contact' && (
              <ContactManagement />
            )}

            {activeTab === 'settings' && (
              <WebsiteSettings config={config} onChange={saveConfig} />
            )}

            {activeTab === 'hero' && (
              <HeroConfig config={config} onChange={saveConfig} />
            )}

            {activeTab === 'services' && (
              <ServicesConfig config={config} onChange={saveConfig} />
            )}

            {activeTab === 'about' && (
              <AboutConfig config={config} onChange={saveConfig} />
            )}

            {activeTab === 'navigation' && (
              <NavigationConfig config={config} onChange={saveConfig} />
            )}

            {activeTab === 'footer' && (
              <FooterConfig config={config} onChange={saveConfig} />
            )}

            {activeTab === 'seo' && (
              <SEOConfig config={config} onChange={saveConfig} />
            )}

            {activeTab === 'map' && (
              <MapConfig config={config} onChange={saveConfig} />
            )}

            {activeTab === 'testimonials' && (
              <TestimonialsConfig config={config} onChange={saveConfig} />
            )}

            {activeTab === 'gallery' && (
              <GalleryConfig config={config} onChange={saveConfig} />
            )}

            <div className="mt-8 flex items-center justify-end space-x-4">
              <button
                onClick={resetConfig}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
              >
                🔄 Reset to Default
              </button>
              <button
                onClick={() => {
                  console.log('Saving all config:', config)
                  console.log('Hero slides:', config.heroSlides)
                  saveConfig(config)
                  toast.success('All website settings saved successfully! 🎉')
                }}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-xl transform hover:scale-105"
              >
                💾 Save All Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                <p className="text-sm text-gray-600">Are you sure you want to log out?</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              You will be signed out of your account and redirected to the login page. You will need to log in again to access the admin dashboard.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AdminAuth>
  )
}

// Fix the incomplete component declarations

// Blog Management Component
const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null)
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)
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
      // Prefer API to avoid client-side Firestore issues in some environments
      const res = await fetch('/api/posts', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { posts: list } = await res.json()
      setPosts(list)
    } catch (e) {
      console.error('Failed to load posts:', e)
      toast.error('Failed to load posts. Check console for details.')
      setPosts([]) // Set empty array to prevent blocking
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Realtime subscription to posts so UI updates immediately
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
          unsubscribe = onSnapshot(q, (snap: import('firebase/firestore').QuerySnapshot<import('firebase/firestore').DocumentData>) => {
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
        setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, ...payload } as any : p))
        toast.success('Post updated')
      } else {
        const id = await withTimeout(createPost(payload))
        // Reload to ensure we get server timestamps and correct mapping
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
                        load() // Reload posts
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

        {/* Stats Cards */}
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

      {/* Filters */}
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

      {/* Blog Posts Table */}
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
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="text-gray-500 font-medium">Loading posts...</p>
                    </div>
                  </td>
                </tr>
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
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=1200&h=600&fit=crop&crop=center'
                          }}
                        />
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
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${post.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.views || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateHuman(post.date, 'en-GB')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEdit(post)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit post"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {post.status === 'published' ? (
                        <button
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Set as draft"
                          onClick={async () => {
                            try {
                              const { updatePostStatus } = await import('@/lib/blog')
                              await updatePostStatus(post.id, 'draft')
                              setPosts((prev) => prev.map((p) =>
                                p.id === post.id ? { ...p, status: 'draft' } : p
                              ))
                              toast.success('Post set as draft')
                            } catch (e) {
                              toast.error('Failed to update status')
                            }
                          }}
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Publish post"
                          onClick={async () => {
                            try {
                              const { updatePostStatus } = await import('@/lib/blog')
                              await updatePostStatus(post.id, 'published')
                              setPosts((prev) => prev.map((p) =>
                                p.id === post.id ? { ...p, status: 'published' } : p
                              ))
                              toast.success('Post published')
                            } catch (e) {
                              toast.error('Failed to publish')
                            }
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Delete post"
                        onClick={() => setShowDeleteDialog(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                <p className="text-sm text-gray-600">Are you sure you want to delete this post?</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              This action cannot be undone. The post will be permanently removed from the system.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteDialog(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePost(showDeleteDialog)}
                disabled={deletingPostId === showDeleteDialog}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
              >
                {deletingPostId === showDeleteDialog ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{deletingPostId === showDeleteDialog ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{editingPost ? 'Edit Post' : 'New Post'}</h3>
              <button onClick={() => setShowPostModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={2} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 border rounded-lg h-64" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-full px-3 py-2 border rounded-lg">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                <div className="mt-2 flex items-center gap-3">
                  <label className="px-3 py-2 bg-blue-600 text-white rounded-lg cursor-pointer">
                    Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImagePick(e.target.files?.[0])} />
                  </label>
                  {form.image && <img src={form.image} alt="cover" className="h-12 w-20 object-cover rounded border" />}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowPostModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={savePost} disabled={savingPost} className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-60">
                {savingPost ? 'Saving...' : editingPost ? 'Save Changes' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

const CategoriesManagement = () => {
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
      const { fetchCategoriesWithIds } = await import('@/lib/categories')
      const list = await fetchCategoriesWithIds()
      setItems(list)
    } catch (e) {
      console.error('Failed to load categories:', e)
      toast.error('Failed to load categories. Check console for details.')
      setItems([]) // Set empty array to prevent blocking
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Categories</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name"
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
          />
          <button
            type="button"
            onClick={async () => {
              const name = newName.trim()
              if (!name) return
              setIsAdding(true)
              try {
                const { addCategory } = await import('@/lib/categories')
                await addCategory(name)
                setNewName('')
                toast.success('Category added')
                load()
              } catch (e) {
                toast.error((e as any)?.message || 'Failed to add')
              } finally {
                setIsAdding(false)
              }
            }}
            disabled={isAdding}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
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
                <tr><td colSpan={2} className="px-3 sm:px-6 py-8 text-center text-gray-500 text-sm">Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={2} className="px-3 sm:px-6 py-8 text-center text-gray-500 text-sm">No categories</td></tr>
              ) : items.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    {editingId === c.id ? (
                      <input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="px-2 py-1 text-sm border rounded w-full sm:w-auto" />
                    ) : (
                      <span className="text-sm text-gray-900">{c.name}</span>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    {editingId === c.id ? (
                      <>
                        <button
                          className="text-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          disabled={isUpdating}
                          onClick={async () => {
                            setIsUpdating(true)
                            try {
                              const { updateCategory } = await import('@/lib/categories')
                              await updateCategory(c.id, editingName.trim())
                              toast.success('Updated')
                              setEditingId(null)
                              load()
                            } catch (e) {
                              toast.error((e as any)?.message || 'Failed to update')
                            } finally {
                              setIsUpdating(false)
                            }
                          }}
                        >
                          {isUpdating ? 'Saving...' : 'Save'}
                        </button>
                        <button className="text-gray-600 text-sm" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="text-blue-600 text-sm" onClick={() => { setEditingId(c.id); setEditingName(c.name) }}>Edit</button>
                        <button
                          className="text-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          disabled={isDeleting === c.id}
                          onClick={async () => {
                            setIsDeleting(c.id)
                            try {
                              const { deleteCategory } = await import('@/lib/categories')
                              await deleteCategory(c.id)
                              toast.success('Deleted')
                              load()
                            } catch (e) {
                              toast.error((e as any)?.message || 'Failed to delete')
                            } finally {
                              setIsDeleting(null)
                            }
                          }}
                        >
                          {isDeleting === c.id ? 'Deleting...' : 'Delete'}
                        </button>
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

// User Management Component
const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showDeleteDialog, setShowDeleteDialog] = useState<{ userId: string; userName: string } | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const { fetchUsers } = await import('@/lib/users')
      const list = await fetchUsers()
      setUsers(list)
    } catch (e) {
      console.error('Failed to load users:', e)
      toast.error('Failed to load users. Check console for details.')
      setUsers([]) // Set empty array to prevent blocking
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDeleteUser = async (userId: string, userName: string) => {
    setDeletingUserId(userId)
    try {
      const { deleteUser } = await import('@/lib/users')
      const success = await deleteUser(userId)

      if (success) {
        setUsers(prev => prev.filter(user => user.id !== userId))
        toast.success('User deleted successfully')
        setShowDeleteDialog(null)
      } else {
        toast.error('Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    } finally {
      setDeletingUserId(null)
    }
  }

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'editor' | 'user') => {
    try {
      const { updateUser } = await import('@/lib/users')
      await updateUser(userId, { role: newRole })
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ))
      toast.success('User role updated successfully')
    } catch (error) {
      console.error('Error updating user role:', error)
      toast.error('Failed to update user role')
    }
  }

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive' | 'pending') => {
    try {
      const { updateUser } = await import('@/lib/users')
      await updateUser(userId, { status: newStatus })
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      ))
      toast.success('User status updated successfully')
    } catch (error) {
      console.error('Error updating user status:', error)
      toast.error('Failed to update user status')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'editor': return 'bg-blue-100 text-blue-800'
      case 'user': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never'
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage user accounts and permissions</p>
        </div>
        <Link
          href="/admin/users/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center sm:justify-start space-x-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-500 rounded-lg">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{users.filter(user => user.status === 'active').length}</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-500 rounded-lg">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Admins</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{users.filter(user => user.role === 'admin').length}</p>
            </div>
            <div className="p-2 sm:p-3 bg-red-500 rounded-lg">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Editors</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{users.filter(user => user.role === 'editor').length}</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-500 rounded-lg">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Search Users</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter by Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2 text-sm">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Department</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Permissions</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Login</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 sm:px-6 py-8 text-center text-gray-500 text-sm">
                      {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                        ? 'No users match your filters'
                        : 'No users found'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                            <span className="text-xs sm:text-sm font-medium text-gray-600">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</div>
                            {user.phone && (
                              <div className="text-xs text-gray-400 truncate">{user.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'editor' | 'user')}
                          className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getRoleColor(user.role)}`}
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="user">User</option>
                        </select>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value as 'active' | 'inactive' | 'pending')}
                          className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(user.status)}`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {user.department || '—'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden xl:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(user.permissions || []).map((permission: string, index: number) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                            >
                              {permission === 'all' ? 'All' : permission}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Link
                            href={`/admin/users/edit/${user.id}`}
                            className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setShowDeleteDialog({ userId: user.id, userName: user.name })}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                <p className="text-sm text-gray-600">Are you sure you want to delete this user?</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{showDeleteDialog.userName}</strong>? This action cannot be undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteDialog(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteDialog.userId, showDeleteDialog.userName)}
                disabled={deletingUserId === showDeleteDialog.userId}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
              >
                {deletingUserId === showDeleteDialog.userId ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{deletingUserId === showDeleteDialog.userId ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Config tabs (Hero, Services, About, Navigation, Footer, SEO, Map, Testimonials, Gallery)

const RecentActivityTab = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold">Recent Activity</h3>
        <p className="text-sm text-gray-500">View recent activity on your site</p>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold">Recent Activity</h3>
        <p className="text-sm text-gray-500">View recent activity on your site</p>
      </div>
    </div>
  )
}

// Fix the incorrectly defined Analytics component

// OverviewTab component
const OverviewTab = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [analytics, setAnalytics] = useState({
    blogStats: {
      totalPosts: 0,
      totalViews: 0,
      publishedPosts: 0,
      draftPosts: 0
    },
    popularPosts: [] as BlogPost[],
    userStats: {
      total: 0,
      active: 0,
      admins: 0
    },
    siteStats: {
      services: 0,
      heroSlides: 0,
      categories: 0
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    const loadAnalytics = async () => {
      setIsLoading(true)
      try {
        // Load blog statistics
        const { fetchPosts } = await import('@/lib/blog')
        const { fetchCategories } = await import('@/lib/categories')
        const { getUserStats } = await import('@/lib/users')
        const { useSiteConfig } = await import('@/lib/site-config')

        const [posts, categories, userStats] = await Promise.all([
          fetchPosts(false), // Get all posts including drafts
          fetchCategories(),
          getUserStats()
        ])

        // Get site config for services and hero slides
        const { config } = useSiteConfig()

        // Calculate blog statistics
        const publishedPosts = posts.filter(p => p.status === 'published')
        const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0)

        // Get popular posts (top 5 by views)
        const popularPosts = posts
          .filter(p => p.status === 'published')
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)

        if (active) {
          setAnalytics({
            blogStats: {
              totalPosts: posts.length,
              totalViews,
              publishedPosts: publishedPosts.length,
              draftPosts: posts.length - publishedPosts.length
            },
            popularPosts,
            userStats: {
              total: userStats.total,
              active: userStats.active,
              admins: userStats.admins
            },
            siteStats: {
              services: config.services?.length || 0,
              heroSlides: config.heroSlides?.length || 0,
              categories: categories.length
            }
          })
        }
      } catch (error) {
        console.error('Failed to load analytics:', error)
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadAnalytics()
    return () => { active = false }
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Real-time insights and statistics</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString('en-GB')}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Blog Views</p>
                  <p className="text-2xl font-bold text-blue-600">{formatNumber(analytics.blogStats.totalViews)}</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published Posts</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.blogStats.publishedPosts}</p>
                </div>
                <div className="p-3 bg-green-500 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-purple-600">{analytics.userStats.active}</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-2xl font-bold text-orange-600">{analytics.siteStats.services}</p>
                </div>
                <div className="p-3 bg-orange-500 rounded-lg">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blog Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Posts</span>
                  <span className="text-lg font-bold text-gray-900">{analytics.blogStats.totalPosts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Published Posts</span>
                  <span className="text-lg font-bold text-green-600">{analytics.blogStats.publishedPosts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Draft Posts</span>
                  <span className="text-lg font-bold text-yellow-600">{analytics.blogStats.draftPosts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Categories</span>
                  <span className="text-lg font-bold text-blue-600">{analytics.siteStats.categories}</span>
                </div>
              </div>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Posts</h3>
              <div className="space-y-3">
                {analytics.popularPosts.length === 0 ? (
                  <p className="text-gray-500 text-sm">No published posts yet</p>
                ) : (
                  analytics.popularPosts.map((post, index) => (
                    <div key={post.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 truncate">{post.title}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900 ml-2">
                        {formatNumber(post.views || 0)} views
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="text-sm font-medium text-gray-900">{analytics.userStats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="text-sm font-medium text-green-600">{analytics.userStats.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Administrators</span>
                  <span className="text-sm font-medium text-red-600">{analytics.userStats.admins}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Content</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hero Slides</span>
                  <span className="text-sm font-medium text-gray-900">{analytics.siteStats.heroSlides}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Services</span>
                  <span className="text-sm font-medium text-gray-900">{analytics.siteStats.services}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Categories</span>
                  <span className="text-sm font-medium text-gray-900">{analytics.siteStats.categories}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Views per Post</span>
                  <span className="text-sm font-medium text-gray-900">
                    {analytics.blogStats.publishedPosts > 0
                      ? Math.round(analytics.blogStats.totalViews / analytics.blogStats.publishedPosts)
                      : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Publish Rate</span>
                  <span className="text-sm font-medium text-gray-900">
                    {analytics.blogStats.totalPosts > 0
                      ? Math.round((analytics.blogStats.publishedPosts / analytics.blogStats.totalPosts) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">User Activity</span>
                  <span className="text-sm font-medium text-gray-900">
                    {analytics.userStats.total > 0
                      ? Math.round((analytics.userStats.active / analytics.userStats.total) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

// Contact Management Component
const ContactManagement = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'completed'>('all')

  useEffect(() => {
    let active = true
    const load = async () => {
      setIsLoading(true)
      try {
        const items = await fetchContactSubmissions()
        if (!active) return
        setSubmissions(items)
      } catch (e) {
        console.error('Failed to load contact submissions:', e)
        toast.error('Failed to load contact submissions. Check console for details.')
        setSubmissions([]) // Set empty array to prevent blocking
      } finally {
        setIsLoading(false)
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Contact Form Management</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3 sm:px-4 py-3 border-b space-y-3 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setFilter('all')} className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>All</button>
            <button onClick={() => setFilter('new')} className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm ${filter === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>New</button>
            <button onClick={() => setFilter('in_progress')} className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm ${filter === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>In Progress</button>
            <button onClick={() => setFilter('completed')} className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Completed</button>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">{filtered.length} submissions</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Service</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td className="px-3 sm:px-6 py-6 text-sm text-gray-500" colSpan={5}>Loading submissions...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td className="px-3 sm:px-6 py-6 text-sm text-gray-500" colSpan={5}>No submissions found</td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 align-top">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{s.firstName} {s.lastName}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{s.email}{s.phone ? ` · ${s.phone}` : ''}</div>
                        <div className="text-xs text-gray-500 mt-2 max-w-md line-clamp-2">{s.message}</div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">{s.service || '—'}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <select
                        value={s.status}
                        onChange={(e) => changeStatus(s.id, e.target.value as any)}
                        className="px-2 py-1 text-xs font-medium rounded-lg border"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{formatDateHuman(s.createdAt || '')}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button title="View" className="text-blue-600 hover:text-blue-900 p-1">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button title="Delete" onClick={() => remove(s.id)} className="text-red-600 hover:text-red-800 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

// Website Settings Component
const WebsiteSettings = ({ config, onChange }: { config: any; onChange: (next: any) => void }) => {
  const [settings, setSettings] = useState({
    siteName: config.siteName || 'Willsther Professional Services',
    siteDescription: config.siteDescription || 'Professional cleaning and maintenance services',
    contactEmail: config.contactEmail || 'info@willsther.com',
    contactPhone: config.contactPhone || '+233 594 850 005',
    maintenanceMode: !!config.maintenanceMode
  })

  useEffect(() => {
    setSettings({
      siteName: config.siteName || 'Willsther Professional Services',
      siteDescription: config.siteDescription || 'Professional cleaning and maintenance services',
      contactEmail: config.contactEmail || 'info@willsther.com',
      contactPhone: config.contactPhone || '+233 594 850 005',
      maintenanceMode: !!config.maintenanceMode
    })
  }, [config])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next = { ...config, ...settings }
    onChange(next)
    toast.success('Website settings saved')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Website Settings</h2>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Description
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
              Enable Maintenance Mode
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setSettings({
                siteName: config.siteName || 'Willsther Professional Services',
                siteDescription: config.siteDescription || 'Professional cleaning and maintenance services',
                contactEmail: config.contactEmail || 'info@willsther.com',
                contactPhone: config.contactPhone || '+233 594 850 005',
                maintenanceMode: !!config.maintenanceMode
              })}
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

// Config tabs (Hero, Services, About, Navigation, Footer, SEO, Map, Testimonials, Gallery)

const NavigationConfig = ({ config, onChange }: any) => {
  const navigation = config.navigation || {
    main: [
      { name: 'Services', href: '/services' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Gallery', href: '/gallery' },
      { name: 'Blog', href: '/blog' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' }
    ]
  }

  const update = (key: string, value: any) => onChange({ ...config, navigation: { ...navigation, [key]: value } })

  const updateMainLink = (index: number, field: string, value: string) => {
    const newMain = [...navigation.main]
    newMain[index] = { ...newMain[index], [field]: value }
    update('main', newMain)
  }

  const updateLegalLink = (index: number, field: string, value: string) => {
    const newLegal = [...navigation.legal]
    newLegal[index] = { ...newLegal[index], [field]: value }
    update('legal', newLegal)
  }

  const addMainLink = () => {
    update('main', [...navigation.main, { name: 'New Link', href: '#' }])
  }

  const addLegalLink = () => {
    update('legal', [...navigation.legal, { name: 'New Legal Link', href: '#' }])
  }

  const removeMainLink = (index: number) => {
    update('main', navigation.main.filter((_: any, i: number) => i !== index))
  }

  const removeLegalLink = (index: number) => {
    update('legal', navigation.legal.filter((_: any, i: number) => i !== index))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <ConfigHeader title="Navigation" subtitle="Manage website navigation links" />
      <div className="space-y-6">
        {/* Main Navigation */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Navigation</h3>
          <div className="space-y-3">
            {navigation.main.map((link: any, index: number) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  value={link.name}
                  onChange={(e) => updateMainLink(index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Link name"
                />
                <input
                  value={link.href}
                  onChange={(e) => updateMainLink(index, 'href', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Link URL"
                />
                <button
                  onClick={() => removeMainLink(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addMainLink}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Link</span>
            </button>
          </div>
        </div>

        {/* Legal Navigation */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Navigation</h3>
          <div className="space-y-3">
            {navigation.legal.map((link: any, index: number) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  value={link.name}
                  onChange={(e) => updateLegalLink(index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Legal link name"
                />
                <input
                  value={link.href}
                  onChange={(e) => updateLegalLink(index, 'href', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Legal link URL"
                />
                <button
                  onClick={() => removeLegalLink(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addLegalLink}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Legal Link</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const FooterConfig = ({ config, onChange }: any) => {
  const footer = config.footer || { copyright: '', socialLinks: [] }
  const [isUploading, setIsUploading] = useState(false)
  const [newSocialLink, setNewSocialLink] = useState({ name: '', url: '', icon: '' })
  const [isAddSocialLinkModalOpen, setIsAddSocialLinkModalOpen] = useState(false)
  const [socialLinkToDelete, setSocialLinkToDelete] = useState<number | null>(null)

  const update = (key: string, value: any) => onChange({ ...config, footer: { ...footer, [key]: value } })
  const updateSocialLink = (index: number, field: string, value: string) => {
    const newSocialLinks = [...footer.socialLinks]
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value }
    update('socialLinks', newSocialLinks)
  }
  const addSocialLink = () => {
    update('socialLinks', [...footer.socialLinks, newSocialLink])
    setIsAddSocialLinkModalOpen(false)
  }
  const removeSocialLink = (index: number) => {
    update('socialLinks', footer.socialLinks.filter((_: any, i: number) => i !== index))
  }
  const handleNewSocialLinkImageUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)

    try {
      const { uploadImage } = await import('@/lib/storage')
      const imageUrl = await uploadImage(file, `social-links/${Date.now()}`)
      setNewSocialLink({ ...newSocialLink, icon: imageUrl })
      toast.success('Social link icon uploaded successfully!')
    } catch (error) {
      console.error('Failed to upload social link icon:', error)
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <ConfigHeader title="Footer" subtitle="Manage footer settings" />
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Copyright Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copyright</label>
              <input
                value={footer.copyright}
                onChange={(e) => update('copyright', e.target.value)}
                placeholder="Enter copyright text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Social Links Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
              {footer.socialLinks.map((link: any, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <img
                    src={link.icon}
                    alt={link.name}
                    className="w-8 h-8 object-cover rounded-full border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?q=80&w=1974&auto=format&fit=crop'
                    }}
                  />
                  <span className="font-medium text-gray-700">{link.name}</span>
                  <span className="text-gray-500">{link.url}</span>
                  <button
                    onClick={() => setSocialLinkToDelete(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setIsAddSocialLinkModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Social Link Modal */}
      {isAddSocialLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add New Social Link</h3>
                <button
                  onClick={() => setIsAddSocialLinkModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Link Name *</label>
                  <input
                    value={newSocialLink.name}
                    onChange={(e) => setNewSocialLink({ ...newSocialLink, name: e.target.value })}
                    placeholder="Enter social link name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Link URL</label>
                  <input
                    value={newSocialLink.url}
                    onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                    placeholder="Enter social link URL"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Link Icon</label>

                  {/* Image Preview */}
                  {newSocialLink.icon && (
                    <div className="mb-3">
                      <img
                        src={newSocialLink.icon}
                        alt="Social link preview"
                        className="w-full h-12 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?q=80&w=1974&auto=format&fit=crop'
                        }}
                      />
                    </div>
                  )}

                  {/* Upload Section */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <label className="relative cursor-pointer bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                        <span className="text-sm font-medium">
                          {isUploading ? 'Uploading...' : 'Upload Image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleNewSocialLinkImageUpload(file)
                          }}
                          disabled={isUploading}
                        />
                      </label>
                      {newSocialLink.icon && (
                        <button
                          onClick={() => setNewSocialLink({ ...newSocialLink, icon: '' })}
                          className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          disabled={isUploading}
                        >
                          Clear Image
                        </button>
                      )}
                    </div>

                    {/* URL Input as fallback */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Or enter image URL:</label>
                      <input
                        value={newSocialLink.icon || ''}
                        onChange={(e) => setNewSocialLink({ ...newSocialLink, icon: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        disabled={isUploading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => setIsAddSocialLinkModalOpen(false)}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addSocialLink}
                  disabled={!newSocialLink.name.trim()}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${!newSocialLink.name.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Social Link</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {socialLinkToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg mb-4">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Social Link</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this social link? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSocialLinkToDelete(null)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    removeSocialLink(socialLinkToDelete)
                    setSocialLinkToDelete(null)
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

const AboutConfig = ({ config, onChange }: any) => {
  const about = config.about || { title: '', content: '', imageUrl: '' }
  const [isUploading, setIsUploading] = useState(false)

  const update = (key: string, value: string) => onChange({ ...config, about: { ...about, [key]: value } })

  const handleAboutImageUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)

    try {
      const { uploadImage } = await import('@/lib/storage')
      const imageUrl = await uploadImage(file, `about/about-${Date.now()}`)
      update('imageUrl', imageUrl)
      toast.success('About image uploaded successfully!')
    } catch (error) {
      console.error('Failed to upload about image:', error)
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <ConfigHeader title="About Section" subtitle="Add and update about section" />
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                value={about.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Enter about section title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={about.content}
                onChange={(e) => update('content', e.target.value)}
                placeholder="Enter about section content"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Image Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Image</label>

              {/* Image Preview */}
              {about.imageUrl && (
                <div className="mb-3">
                  <img
                    src={about.imageUrl}
                    alt="About"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?q=80&w=1974&auto=format&fit=crop'
                    }}
                  />
                </div>
              )}

              {/* Upload Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <label className="relative cursor-pointer bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                    <span className="text-sm font-medium">
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleAboutImageUpload(file)
                      }}
                      disabled={isUploading}
                    />
                  </label>
                  {about.imageUrl && (
                    <button
                      onClick={() => update('imageUrl', '')}
                      className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      disabled={isUploading}
                    >
                      Clear Image
                    </button>
                  )}
                </div>

                {/* URL Input as fallback */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Or enter image URL:</label>
                  <input
                    value={about.imageUrl || ''}
                    onChange={(e) => update('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={isUploading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Blog Management Component
const SEOConfig = ({ config, onChange }: any) => {
  const seo = config.seo || { defaultTitle: '', defaultDescription: '', keywords: [] as string[] }
  const update = (key: string, value: any) => onChange({ ...config, seo: { ...seo, [key]: value } })
  const setKeywords = (value: string) => update('keywords', value.split(',').map((k) => k.trim()).filter(Boolean))
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <ConfigHeader title="SEO" subtitle="Default SEO metadata" />
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <div>
          <label className="text-sm text-gray-700">Default Title</label>
          <input value={seo.defaultTitle} onChange={(e) => update('defaultTitle', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="text-sm text-gray-700">Default Description</label>
          <textarea value={seo.defaultDescription} onChange={(e) => update('defaultDescription', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" rows={4} />
        </div>
        <div>
          <label className="text-sm text-gray-700">Keywords (comma separated)</label>
          <input value={(seo.keywords || []).join(', ')} onChange={(e) => setKeywords(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" />
        </div>
      </div>
    </motion.div>
  )
}

// Blog Management Component
const MapConfig = ({ config, onChange }: any) => {
  const map = config.map || { embedUrl: '', lat: undefined, lng: undefined, zoom: 14 }
  const update = (key: string, value: any) => onChange({ ...config, map: { ...map, [key]: value } })
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <ConfigHeader title="Map" subtitle="Google Maps embed or coordinates" />
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <div>
          <label className="text-sm text-gray-700">Embed URL</label>
          <input value={map.embedUrl || ''} onChange={(e) => update('embedUrl', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-700">Latitude</label>
            <input type="number" value={map.lat ?? ''} onChange={(e) => update('lat', parseFloat(e.target.value))} className="mt-1 w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Longitude</label>
            <input type="number" value={map.lng ?? ''} onChange={(e) => update('lng', parseFloat(e.target.value))} className="mt-1 w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Zoom</label>
            <input type="number" value={map.zoom ?? 14} onChange={(e) => update('zoom', parseInt(e.target.value))} className="mt-1 w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const TestimonialsConfig = ({ config, onChange }: any) => {
  const items = config.testimonials || []
  const updateItem = (index: number, key: string, value: any) => {
    const next = { ...config }
    next.testimonials = [...items]
    next.testimonials[index] = { ...next.testimonials[index], [key]: value }
    onChange(next)
  }
  const addItem = () => onChange({ ...config, testimonials: [...items, { id: Date.now().toString(), name: '', role: '', content: '', rating: 5, avatarUrl: '' }] })
  const removeItem = (index: number) => onChange({ ...config, testimonials: items.filter((_: any, i: number) => i !== index) })
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <ConfigHeader title="Testimonials" subtitle="Manage customer reviews" />
      <div className="space-y-4">
        {items.map((t: any, i: number) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-700">Name</label>
              <input value={t.name} onChange={(e) => updateItem(i, 'name', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Role/Title</label>
              <input value={t.role || ''} onChange={(e) => updateItem(i, 'role', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Rating (1-5)</label>
              <input type="number" min={1} max={5} value={t.rating ?? 5} onChange={(e) => updateItem(i, 'rating', parseInt(e.target.value))} className="mt-1 w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="md:col-span-3">
              <label className="text-sm text-gray-700">Comment</label>
              <textarea value={t.content || ''} onChange={(e) => updateItem(i, 'content', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" rows={3} />
            </div>
            <div className="md:col-span-3">
              <label className="text-sm text-gray-700">Avatar URL (optional)</label>
              <input value={t.avatarUrl || ''} onChange={(e) => updateItem(i, 'avatarUrl', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button onClick={() => removeItem(i)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">Remove</button>
            </div>
          </div>
        ))}
        <button onClick={addItem} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Testimonial</button>
      </div>
    </motion.div>
  )
}

const GalleryConfig = ({ config, onChange }: any) => {
  const items = config.gallery || []
  const updateItem = (index: number, key: string, value: any) => {
    const next = { ...config }
    next.gallery = [...items]
    next.gallery[index] = { ...next.gallery[index], [key]: value }
    onChange(next)
  }
  const addItem = () => onChange({ ...config, gallery: [...items, { id: Date.now().toString(), imageUrl: '', caption: '' }] })
  const removeItem = (index: number) => onChange({ ...config, gallery: items.filter((_: any, i: number) => i !== index) })
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <ConfigHeader title="Gallery" subtitle="Manage gallery images" />
      <div className="space-y-4">
        {items.map((g: any, i: number) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700">Image URL</label>
              <input value={g.imageUrl} onChange={(e) => updateItem(i, 'imageUrl', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Caption</label>
              <input value={g.caption || ''} onChange={(e) => updateItem(i, 'caption', e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button onClick={() => removeItem(i)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">Remove</button>
            </div>
          </div>
        ))}
        <button onClick={addItem} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Image</button>
      </div>
    </motion.div>
  )
}

export default AdminDashboard
