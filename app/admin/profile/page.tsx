'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Camera,
  Shield,
  Bell,
  Palette,
  Globe,
  Trash2,
  LogOut,
  AlertTriangle,
  Eye,
  EyeOff,
  Key
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { getAuth, updatePassword, updateProfile, reauthenticateWithCredential, EmailAuthProvider, signOut, type Auth } from 'firebase/auth'
import { doc, updateDoc, getDoc, setDoc, type Firestore } from 'firebase/firestore'
import { getDb } from '@/lib/firebase'


interface ProfileData {
  name: string
  email: string
  phone: string
  role: string
  avatar: string
  bio: string
  location: string
  timezone: string
  language: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    compactMode: boolean
    autoSave: boolean
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [auth, setAuth] = useState<Auth | null>(null)
  const [db, setDb] = useState<Firestore | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [activeTab, setActiveTab] = useState('profile')
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Admin User',
    email: 'admin@willsther.com',
    phone: '+233 594 850 005',
    role: 'Administrator',
    avatar: '/logo.jpg',
    bio: 'System Administrator at Willsther Professional Services',
    location: 'Accra, Ghana',
    timezone: 'Africa/Accra',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    preferences: {
      theme: 'light',
      compactMode: false,
      autoSave: true
    }
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })



  // Initialize Firebase services when component mounts
  useEffect(() => {
    try {
      const authInstance = getAuth()
      const dbInstance = getDb()
      setAuth(authInstance)
      setDb(dbInstance)
    } catch (error) {
      console.error('Failed to initialize Firebase services:', error)
    }
  }, [])

  // Check authentication and load user profile data
  useEffect(() => {
    if (!auth || !db) return

    const checkAuth = async () => {
      try {
        // Wait for auth state to be ready
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (auth.currentUser) {
          console.log('User authenticated:', auth.currentUser.email)
          setIsAuthenticated(true)
          await loadProfile()
        } else {
          console.log('No user authenticated, redirecting to login')
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/admin/login')
      }
    }

    const loadProfile = async () => {
      if (!auth.currentUser) return
      
      try {
        console.log('Loading profile for user:', auth.currentUser.uid)
        
        // Load profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          console.log('User data loaded:', userData)
          
          setProfileData(prev => ({
            ...prev,
            name: userData.name || auth.currentUser?.displayName || 'Admin User',
            email: auth.currentUser?.email || 'admin@willsther.com',
            phone: userData.phone || '+233 594 850 005',
            role: userData.role || 'Administrator',
            bio: userData.bio || 'System Administrator at Willsther Professional Services',
            location: userData.location || 'Accra, Ghana',
            timezone: userData.timezone || 'Africa/Accra',
            avatar: userData.avatar || '/logo.jpg',
            notifications: userData.notifications || prev.notifications,
            preferences: userData.preferences || prev.preferences
          }))
        } else {
          console.log('No user document found, creating one...')
          // Create user document if it doesn't exist
          const userData = {
            name: auth.currentUser?.displayName || 'Admin User',
            email: auth.currentUser?.email || 'admin@willsther.com',
            phone: '+233 594 850 005',
            role: 'admin',
            status: 'active',
            bio: 'System Administrator at Willsther Professional Services',
            location: 'Accra, Ghana',
            timezone: 'Africa/Accra',
            avatar: '/logo.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: null,
            permissions: ['read', 'write', 'delete', 'manage_users', 'manage_content'],
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            preferences: {
              theme: 'light',
              compactMode: false,
              autoSave: true
            }
          }
          
          await setDoc(doc(db, 'users', auth.currentUser.uid), userData)
          setProfileData(prev => ({
            ...prev,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            bio: userData.bio,
            location: userData.location,
            timezone: userData.timezone,
            avatar: userData.avatar,
            notifications: userData.notifications,
            preferences: {
              theme: userData.preferences.theme as 'light' | 'dark' | 'auto',
              compactMode: userData.preferences.compactMode,
              autoSave: userData.preferences.autoSave
            }
          }))
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        // Set basic data from auth user
        setProfileData(prev => ({
          ...prev,
          name: auth.currentUser?.displayName || 'Admin User',
          email: auth.currentUser?.email || 'admin@willsther.com',
          phone: '+233 594 850 005',
          role: 'Administrator',
          bio: 'System Administrator at Willsther Professional Services',
          location: 'Accra, Ghana',
          timezone: 'Africa/Accra'
        }))
      }
    }

    checkAuth()
  }, [auth, db, router])

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

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (type: keyof ProfileData['notifications']) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }))
  }

  const handlePreferenceChange = (field: keyof ProfileData['preferences'], value: any) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }))
  }

  const handleSaveProfile = async () => {
    if (!auth?.currentUser || !db) {
      toast.error('You must be logged in to update your profile')
      return
    }

    setIsSaving(true)
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: profileData.name,
        photoURL: profileData.avatar
      })

      // Update or create Firestore user document
      const userRef = doc(db, 'users', auth.currentUser.uid)
      const userDoc = await getDoc(userRef)
      
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        bio: profileData.bio,
        location: profileData.location,
        timezone: profileData.timezone,
        notifications: profileData.notifications,
        preferences: profileData.preferences,
        updatedAt: new Date()
      }

      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userRef, updateData)
      } else {
        // Create new document if it doesn't exist
        await setDoc(userRef, {
          ...updateData,
          email: auth.currentUser.email,
          role: 'admin',
          status: 'active',
          createdAt: new Date(),
          permissions: ['read', 'write', 'delete', 'manage_users', 'manage_content']
        })
      }

      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }



  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('Image size must be less than 2MB')
      return
    }

    try {
      // For now, we'll use a placeholder. In a real app, you'd upload to Firebase Storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfileData(prev => ({ ...prev, avatar: result }))
        toast.success('Avatar updated!')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Failed to upload avatar')
    }
  }

  const handleChangePassword = async () => {
    if (!auth?.currentUser) {
      toast.error('You must be logged in to change your password')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    if (!auth.currentUser.email) {
      toast.error('Email address is required to change password')
      return
    }

    setIsSaving(true)
    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwordData.currentPassword
      )
      
      await reauthenticateWithCredential(auth.currentUser, credential)
      
      // Change password
      await updatePassword(auth.currentUser, passwordData.newPassword)
      
      toast.success('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error: any) {
      console.error('Error changing password:', error)
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect')
      } else if (error.code === 'auth/weak-password') {
        toast.error('New password is too weak')
      } else {
        toast.error('Failed to change password')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    if (!auth) return
    
    try {
      await signOut(auth)
      toast.success('Logged out successfully!')
      router.push('/admin/login')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Failed to log out')
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Preferences', icon: Palette }
  ]

  // Show loading state while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/admin" 
                className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors text-sm sm:text-base w-fit group"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Admin</span>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-white/30"></div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Profile Settings</h1>
                <p className="text-white/80 mt-1 text-sm sm:text-base">Manage your account and preferences</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Avatar Section */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      Profile Picture
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={profileData.avatar}
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                        />
                        <label className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                          <Camera className="w-3 h-3" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Upload a new profile picture</p>
                        <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <input
                          type="text"
                          value={profileData.role}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location & Preferences */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Location & Preferences
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                        <select
                          value={profileData.timezone}
                          onChange={(e) => handleInputChange('timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="Africa/Accra">Africa/Accra (GMT+0)</option>
                          <option value="UTC">UTC (GMT+0)</option>
                          <option value="America/New_York">America/New_York (GMT-5)</option>
                          <option value="Europe/London">Europe/London (GMT+0)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Lock className="w-5 h-5 mr-2" />
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleChangePassword}
                          disabled={isSaving}
                          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-all duration-200"
                        >
                          {isSaving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Key className="w-4 h-4" />
                          )}
                          <span>{isSaving ? 'Changing...' : 'Change Password'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      Notification Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('email')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profileData.notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.notifications.email ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Push Notifications</h4>
                          <p className="text-sm text-gray-600">Receive browser push notifications</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('push')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profileData.notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.notifications.push ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                          <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('sms')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profileData.notifications.sms ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Palette className="w-5 h-5 mr-2" />
                      Display Preferences
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                        <select
                          value={profileData.preferences.theme}
                          onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto (System)</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Compact Mode</h4>
                          <p className="text-sm text-gray-600">Use compact layout for better space utilization</p>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('compactMode', !profileData.preferences.compactMode)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profileData.preferences.compactMode ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.preferences.compactMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Auto Save</h4>
                          <p className="text-sm text-gray-600">Automatically save changes while editing</p>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('autoSave', !profileData.preferences.autoSave)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profileData.preferences.autoSave ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.preferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
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
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                <p className="text-sm text-gray-600">Are you sure you want to log out?</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              You will be signed out of your account and redirected to the login page. Any unsaved changes will be lost.
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
    </div>
  )
}
