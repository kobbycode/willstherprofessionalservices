'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Skeleton from '@/components/Skeleton'
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
import AdminHeader from '@/components/AdminHeader'
import { BlogManagement } from './components/BlogManagement'
import { UserManagement } from './components/UserManagement'
import { CategoriesManagement } from './components/CategoriesManagement'
import { OverviewTab } from './components/OverviewTab'
import { ContactManagement } from './components/ContactManagement'
import { WebsiteSettings } from './components/WebsiteSettings'
import HeroConfig from './components/HeroConfig'
import ServicesConfig from './components/ServicesConfig'
import ShopManagement from './components/ShopManagement'
import { NavigationConfig } from './components/NavigationConfig'
import { FooterConfig } from './components/FooterConfig'
import { AboutConfig } from './components/AboutConfig'
import { SEOConfig } from './components/SEOConfig'
import { MapConfig } from './components/MapConfig'
import { TestimonialsConfig } from './components/TestimonialsConfig'
import { GalleryConfig } from './components/GalleryConfig'

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
      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <AdminHeader
          title="Admin Dashboard"
          subtitle="Professional Services Management"
          showBadge={true}
          showMobileMenuToggle={true}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onLogoutClick={() => setShowLogoutDialog(true)}
        />

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Sidebar Navigation */}
          <div className={`w-full lg:w-72 bg-primary-900 shadow-premium border-r border-white/10 lg:h-full overflow-y-auto transition-all duration-300 z-40 lg:z-auto custom-scrollbar ${isMobileMenuOpen ? 'flex' : 'hidden lg:flex'
            }`}>
            <nav className="p-4 sm:p-6 space-y-8">
              <div>
                <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 px-4">Navigation</h2>
                <div className="space-y-1.5">
                  {[
                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                    { id: 'shop', label: 'Shop Management', icon: ShoppingBag },
                    { id: 'blog', label: 'Blog Management', icon: FileText },
                    { id: 'categories', label: 'Categories', icon: Filter },
                    { id: 'users', label: 'User Management', icon: Users, restricted: true },
                    { id: 'contact', label: 'Contact Forms', icon: MessageSquare },
                  ].filter(item => !item.restricted || (user?.role === 'super_admin')).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${activeTab === item.id
                        ? 'bg-accent-500 text-primary-900 shadow-lg translate-x-1'
                        : 'text-primary-100 hover:bg-white/10 hover:text-accent-500 hover:shadow-sm'
                        }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${activeTab === item.id ? 'bg-primary-900/10' : 'bg-white/5 group-hover:bg-accent-500/10'}`}>
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-primary-900' : 'text-accent-500'}`} />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 px-4">Website Content</h2>
                <div className="space-y-1.5">
                  {[
                    { id: 'hero', label: 'Hero Section', icon: ImageIcon },
                    { id: 'services', label: 'Services', icon: Wrench },
                    { id: 'about', label: 'About Section', icon: Quote },
                    { id: 'testimonials', label: 'Testimonials', icon: Quote },
                    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${activeTab === item.id
                        ? 'bg-accent-500 text-primary-900 shadow-lg translate-x-1'
                        : 'text-primary-100 hover:bg-white/10 hover:text-accent-500 hover:shadow-sm'
                        }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${activeTab === item.id ? 'bg-primary-900/10' : 'bg-white/5 group-hover:bg-accent-500/10'}`}>
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-primary-900' : 'text-accent-500'}`} />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 px-4">Configuration</h2>
                <div className="space-y-1.5">
                  {[
                    { id: 'settings', label: 'Website Settings', icon: Settings },
                    { id: 'navigation', label: 'Navigation', icon: MenuIcon },
                    { id: 'footer', label: 'Footer Settings', icon: Globe },
                    { id: 'seo', label: 'SEO Settings', icon: Globe },
                    { id: 'map', label: 'Map Settings', icon: MapIcon },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${activeTab === item.id
                        ? 'bg-accent-500 text-primary-900 shadow-lg translate-x-1'
                        : 'text-primary-100 hover:bg-white/10 hover:text-accent-500 hover:shadow-sm'
                        }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${activeTab === item.id ? 'bg-primary-900/10' : 'bg-white/5 group-hover:bg-accent-500/10'}`}>
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-primary-900' : 'text-accent-500'}`} />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 px-4">Analytics</h2>
                <div className="space-y-1.5">
                  <Link
                    href="/admin/analytics"
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group text-primary-100 hover:bg-white/10 hover:text-accent-500 hover:shadow-sm"
                  >
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent-500/10">
                      <TrendingUp className="w-5 h-5 text-accent-500" />
                    </div>
                    <span className="font-bold text-sm tracking-tight">Analytics Dashboard</span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:h-full overflow-y-auto p-3 sm:p-4 lg:p-6 xl:p-8 custom-scrollbar">
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
      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-primary-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={handleBackdropClick}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-premium max-w-md w-full overflow-hidden border border-gray-100"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <LogOut className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-900">Confirm Logout</h3>
                  <p className="text-sm text-secondary-600">Are you sure you want to log out?</p>
                </div>
              </div>

              <p className="text-secondary-600 mb-8 leading-relaxed">
                You will be signed out of your account and redirected to the login page. Any unsaved changes may be lost.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutDialog(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-primary-900 rounded-xl hover:bg-gray-50 transition-all duration-200 font-bold text-sm uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 bg-primary-900 text-accent-500 rounded-xl hover:bg-primary-800 transition-all duration-200 font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary-900/20"
                >
                  Logout Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminAuth>
  )
}

// Fix the incomplete component declarations

// Components have been extracted to ./components/ directory

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

// Components have been extracted to ./components/ directory

// Sectional configuration components are imported from the components directory.

export default AdminDashboard
