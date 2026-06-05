'use client'

import { useState, useEffect, useCallback, useRef, Component, type ReactNode } from 'react'
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
  ShoppingBag,
  Building2
} from 'lucide-react'
import Link from 'next/link'
import { formatDateHuman } from '@/lib/date'
import { useRouter } from 'next/navigation'
import AdminAuth from '@/components/AdminAuth'
import { useSiteConfig } from '@/lib/site-config'
import toast from 'react-hot-toast'
import { fetchContactSubmissions, updateContactStatus, deleteContactSubmission, type ContactSubmission } from '@/lib/contacts'
import { BlogPost } from '@/lib/blog'
import { type User } from '@/lib/users'
import { useAuth } from '@/lib/auth-context'
import { uploadImage } from '@/lib/storage'
import { getDb } from '@/lib/firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import AdminHeader from '@/components/AdminHeader'
import dynamic from 'next/dynamic'

const BlogManagement = dynamic(() => import('./components/BlogManagement').then(m => m.BlogManagement))
const UserManagement = dynamic(() => import('./components/UserManagement').then(m => m.UserManagement))
const CategoriesManagement = dynamic(() => import('./components/CategoriesManagement').then(m => m.CategoriesManagement))
const OverviewTab = dynamic(() => import('./components/OverviewTab').then(m => m.OverviewTab))
const ContactManagement = dynamic(() => import('./components/ContactManagement').then(m => m.ContactManagement))
const WebsiteSettings = dynamic(() => import('./components/WebsiteSettings').then(m => m.WebsiteSettings))
const HeroConfig = dynamic(() => import('./components/HeroConfig'))
const ServicesConfig = dynamic(() => import('./components/ServicesConfig'))
const ShopManagement = dynamic(() => import('./components/ShopManagement'))
const NavigationConfig = dynamic(() => import('./components/NavigationConfig').then(m => m.NavigationConfig))
const FooterConfig = dynamic(() => import('./components/FooterConfig').then(m => m.FooterConfig))
const AboutConfig = dynamic(() => import('./components/AboutConfig').then(m => m.AboutConfig))
const SEOConfig = dynamic(() => import('./components/SEOConfig').then(m => m.SEOConfig))
const MapConfig = dynamic(() => import('./components/MapConfig').then(m => m.MapConfig))
const TestimonialsConfig = dynamic(() => import('./components/TestimonialsConfig').then(m => m.TestimonialsConfig))
const GalleryConfig = dynamic(() => import('./components/GalleryConfig').then(m => m.GalleryConfig))
const StatsConfig = dynamic(() => import('./components/StatsConfig').then(m => m.StatsConfig))
const ClientsConfig = dynamic(() => import('./components/ClientsConfig').then(m => m.ClientsConfig))

const ConfigHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
  </div>
)

class AdminErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: ReactNode }) {
        super(props)
        this.state = { hasError: false, error: null }
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50 p-8">
                    <div className="bg-white rounded-3xl shadow-premium max-w-lg w-full p-10 text-center space-y-6">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
                            <span className="text-2xl">!</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
                        <p className="text-gray-600 text-sm">{this.state.error?.message || 'An unexpected error occurred'}</p>
                        <button
                            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
                            className="px-8 py-3 bg-primary-900 text-white rounded-2xl font-bold text-sm hover:bg-primary-800 transition-all"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { config, setConfig, clearDirty } = useSiteConfig()
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

  const configRef = useRef(config)
  
  useEffect(() => {
    configRef.current = { ...config }
  }, [config])

  const handleConfigChange = (next: any) => {
    if (typeof next === 'function') {
      const resolved = next(configRef.current)
      configRef.current = resolved
      setConfig(resolved)
    } else {
      configRef.current = next
      setConfig(next)
    }
  }

  const handleSectionSave = useCallback(async (section: string) => {
    if (!configRef.current) {
      toast.error('Configuration not loaded yet.')
      return
    }
    try {
      setIsSaving(true)
      const payload: Record<string, any> = { _merge: true }
      if (section === 'settings') {
        const { siteName, siteDescription, contactEmail, contactPhone, maintenanceMode, footer } = configRef.current
        Object.assign(payload, { siteName, siteDescription, contactEmail, contactPhone, maintenanceMode, footer })
      } else {
        const sectionKey = section === 'hero' ? 'heroSlides' : section
        payload[sectionKey] = configRef.current[sectionKey as keyof typeof configRef.current]
      }
      const res = await fetch('/api/config/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        throw new Error((await res.json().catch(() => ({}))).error || `Failed to save ${section}`)
      }
      const result = await res.json()
      clearDirty()
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} saved successfully! ✓`)
    } catch (error: any) {
      console.error(`AdminPage: ${section} save failed:`, error)
      toast.error(error.message || `Failed to save ${section}`)
    } finally {
      setIsSaving(false)
    }
  }, [])

  return (
    <AdminAuth>
      <AdminErrorBoundary>
      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <AdminHeader
          title="Admin Dashboard"
          subtitle="Manage your website"
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
                <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 px-4">Navigation</h2>
                <div className="space-y-1.5">
                  {[
                    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
                    { id: 'shop', label: 'Shop', icon: ShoppingBag },
                    { id: 'blog', label: 'Blog', icon: FileText },
                    { id: 'categories', label: 'Categories', icon: Filter },
                    { id: 'users', label: 'Users', icon: Users, restricted: true },
                    { id: 'contact', label: 'Inquiries', icon: MessageSquare },
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
                      <span className="font-bold text-base tracking-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 px-4">Website Content</h2>
                <div className="space-y-1.5">
                  {[
                    { id: 'hero', label: 'Hero Section', icon: ImageIcon },
                    { id: 'services', label: 'Services', icon: Wrench },
                    { id: 'about', label: 'About Section', icon: Quote },
                    { id: 'testimonials', label: 'Testimonials', icon: Quote },
                    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
                    { id: 'stats', label: 'Stats', icon: BarChart3 },
                    { id: 'clients', label: 'Clients', icon: Building2 },
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
                      <span className="font-bold text-base tracking-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 px-4">Configuration</h2>
                <div className="space-y-1.5">
                  {[
                    { id: 'settings', label: 'General', icon: Settings },
                    { id: 'navigation', label: 'Menu', icon: MenuIcon },
                    { id: 'footer', label: 'Footer', icon: Globe },
                    { id: 'seo', label: 'SEO', icon: Globe },
                    { id: 'map', label: 'Map', icon: MapIcon },
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
                      <span className="font-bold text-base tracking-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 px-4">Analytics</h2>
                <div className="space-y-1.5">
                  <Link
                    href="/admin/analytics"
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group text-primary-100 hover:bg-white/10 hover:text-accent-500 hover:shadow-sm"
                  >
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent-500/10">
                      <TrendingUp className="w-5 h-5 text-accent-500" />
                    </div>
                    <span className="font-bold text-base tracking-tight">Analytics Dashboard</span>
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
              <WebsiteSettings config={config} onChange={handleConfigChange} onSave={() => handleSectionSave('settings')} />
            )}

            {activeTab === 'hero' && (
              <HeroConfig config={config} onChange={handleConfigChange} onSave={() => handleSectionSave('hero')} />
            )}

            {activeTab === 'services' && (
              <ServicesConfig config={config} onChange={handleConfigChange} onSave={() => handleSectionSave('services')} />
            )}

            {activeTab === 'about' && (
              <>
                <AboutConfig config={config} onChange={handleConfigChange} onSave={() => handleSectionSave('about')} />
                <div className="flex justify-end pt-6">
                  <button onClick={() => handleSectionSave('about')} disabled={isSaving} className="px-8 py-4 bg-primary-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-800 transition-all shadow-xl hover:shadow-primary-900/20 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </>
            )}

            {activeTab === 'navigation' && (
              <>
                <NavigationConfig config={config} onChange={handleConfigChange} onSave={() => handleSectionSave('navigation')} />
                <div className="flex justify-end pt-6">
                  <button onClick={() => handleSectionSave('navigation')} disabled={isSaving} className="px-8 py-4 bg-primary-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-800 transition-all shadow-xl hover:shadow-primary-900/20 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </>
            )}

            {activeTab === 'footer' && (
              <>
                <FooterConfig config={config} onChange={handleConfigChange} onSave={() => handleSectionSave('footer')} />
                <div className="flex justify-end pt-6">
                  <button onClick={() => handleSectionSave('footer')} disabled={isSaving} className="px-8 py-4 bg-primary-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-800 transition-all shadow-xl hover:shadow-primary-900/20 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </>
            )}

            {activeTab === 'seo' && (
              <>
                <SEOConfig config={config} onChange={handleConfigChange} onSave={() => handleSectionSave('seo')} />
                <div className="flex justify-end pt-6">
                  <button onClick={() => handleSectionSave('seo')} disabled={isSaving} className="px-8 py-4 bg-primary-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-800 transition-all shadow-xl hover:shadow-primary-900/20 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </>
            )}

            {activeTab === 'map' && (
              <>
                <MapConfig config={config} onChange={handleConfigChange} onSave={() => handleSectionSave('map')} />
                <div className="flex justify-end pt-6">
                  <button onClick={() => handleSectionSave('map')} disabled={isSaving} className="px-8 py-4 bg-primary-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-800 transition-all shadow-xl hover:shadow-primary-900/20 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </>
            )}

            {activeTab === 'testimonials' && (
              <>
                <TestimonialsConfig config={config} onChange={handleConfigChange} onSave={() => handleSectionSave('testimonials')} />
                <div className="flex justify-end pt-6">
                  <button onClick={() => handleSectionSave('testimonials')} disabled={isSaving} className="px-8 py-4 bg-primary-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-800 transition-all shadow-xl hover:shadow-primary-900/20 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </>
            )}

            {activeTab === 'gallery' && (
              <GalleryConfig config={config} onChange={handleConfigChange} onSave={() => handleSectionSave('gallery')} />
            )}

            {activeTab === 'stats' && (
              <StatsConfig config={config} onChange={handleConfigChange} onSave={() => handleSectionSave('stats')} />
            )}

            {activeTab === 'clients' && (
              <ClientsConfig config={config} onChange={handleConfigChange} onSave={() => handleSectionSave('clients')} />
            )}
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
                  <p className="text-base text-secondary-600">Are you sure you want to log out?</p>
                </div>
              </div>

              <p className="text-secondary-600 mb-8 leading-relaxed">
                You will be signed out of your account and redirected to the login page. Any unsaved changes may be lost.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutDialog(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-primary-900 rounded-xl hover:bg-gray-50 transition-all duration-200 font-bold text-base uppercase tracking-wider"
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
      </AdminErrorBoundary>
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
