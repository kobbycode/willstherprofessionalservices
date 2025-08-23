'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, UserPlus, Shield, Eye, Edit, Trash2, Settings, FileText, Users, Globe, MapPin, Phone, Mail } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { fetchUserById, updateUser, type User, type NewUserInput } from '@/lib/users'

const permissions = {
  admin: {
    name: 'Administrator',
    description: 'Full access to all features',
    permissions: ['all'],
    color: 'bg-red-100 text-red-800 border-red-200'
  },
  editor: {
    name: 'Content Editor',
    description: 'Manage blog posts, categories, and content',
    permissions: ['blog', 'content', 'categories', 'view'],
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  user: {
    name: 'Regular User',
    description: 'View-only access to dashboard',
    permissions: ['view'],
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const availablePermissions = [
  { id: 'all', name: 'All Permissions', description: 'Full system access' },
  { id: 'blog', name: 'Blog Management', description: 'Create, edit, delete blog posts' },
  { id: 'categories', name: 'Category Management', description: 'Manage blog categories' },
  { id: 'content', name: 'Content Management', description: 'Edit website content' },
  { id: 'users', name: 'User Management', description: 'Manage user accounts' },
  { id: 'analytics', name: 'Analytics Access', description: 'View analytics and reports' },
  { id: 'settings', name: 'Site Settings', description: 'Modify website configuration' },
  { id: 'view', name: 'View Access', description: 'Basic dashboard access' }
]

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<Partial<NewUserInput>>({
    name: '',
    email: '',
    role: 'user',
    status: 'pending',
    phone: '',
    department: '',
    permissions: ['view']
  })
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['view'])
  const [showCustomPermissions, setShowCustomPermissions] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) return
      
      try {
        const userData = await fetchUserById(userId)
        if (userData) {
          setUser(userData)
          setFormData({
            name: userData.name,
            email: userData.email,
            role: userData.role,
            status: userData.status,
            phone: userData.phone || '',
            department: userData.department || '',
            permissions: userData.permissions || ['view']
          })
          setSelectedPermissions(userData.permissions || ['view'])
        } else {
          toast.error('User not found')
          router.push('/admin')
        }
      } catch (error) {
        console.error('Error loading user:', error)
        toast.error('Failed to load user')
        router.push('/admin')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUser()
  }, [userId, router])

  const handleInputChange = (field: keyof NewUserInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRoleChange = (role: 'admin' | 'editor' | 'user') => {
    setFormData(prev => ({ ...prev, role }))
    
    // Auto-set permissions based on role
    if (role === 'admin') {
      setSelectedPermissions(['all'])
      setShowCustomPermissions(false)
    } else if (role === 'editor') {
      setSelectedPermissions(['blog', 'content', 'categories', 'view'])
      setShowCustomPermissions(false)
    } else {
      setSelectedPermissions(['view'])
      setShowCustomPermissions(false)
    }
  }

  const handlePermissionToggle = (permissionId: string) => {
    if (permissionId === 'all') {
      setSelectedPermissions(['all'])
      return
    }

    setSelectedPermissions(prev => {
      const newPermissions = prev.filter(p => p !== 'all')
      
      if (newPermissions.includes(permissionId)) {
        return newPermissions.filter(p => p !== permissionId)
      } else {
        return [...newPermissions, permissionId]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name?.trim() || !formData.email?.trim()) {
      toast.error('Name and email are required')
      return
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSaving(true)
    try {
      const userData: Partial<NewUserInput> = {
        ...formData,
        permissions: selectedPermissions
      }

      const success = await updateUser(userId, userData)
      
      if (success) {
        toast.success('User updated successfully!')
        router.push('/admin')
      } else {
        toast.error('Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    } finally {
      setIsSaving(false)
    }
  }

  const getRoleInfo = (role: string) => {
    return permissions[role as keyof typeof permissions] || permissions.user
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading user...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
          <Link href="/admin" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Back to Admin
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Admin</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
                <p className="text-gray-600 mt-1">Update user account and permissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="user@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+233 594 850 000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Marketing, IT, Support"
                  />
                </div>
              </div>
            </motion.div>

            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Role & Permissions
              </h2>

              {/* Role Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Select User Role
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(permissions).map(([role, info]) => (
                    <div
                      key={role}
                      onClick={() => handleRoleChange(role as 'admin' | 'editor' | 'user')}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.role === role
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{info.name}</h3>
                        {formData.role === role && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{info.description}</p>
                      <div className="mt-3">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${info.color}`}>
                          {info.permissions.length} permission{info.permissions.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Permissions */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Custom Permissions
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCustomPermissions(!showCustomPermissions)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showCustomPermissions ? 'Hide' : 'Customize'} Permissions
                  </button>
                </div>

                {showCustomPermissions && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availablePermissions.map((permission: any) => (
                        <div
                          key={permission.id}
                          className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200"
                        >
                          <input
                            type="checkbox"
                            id={permission.id}
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <label htmlFor={permission.id} className="block text-sm font-medium text-gray-900 cursor-pointer">
                              {permission.name}
                            </label>
                            <p className="text-xs text-gray-600 mt-1">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Permissions Summary */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Selected Permissions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPermissions.map((permissionId: string) => {
                      const permission = availablePermissions.find(p => p.id === permissionId)
                      return (
                        <span
                          key={permissionId}
                          className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {permission?.name || permissionId}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status
                </label>
                <select
                  value={formData.status || 'pending'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending (requires activation)</option>
                  <option value="active">Active (immediate access)</option>
                  <option value="inactive">Inactive (disabled)</option>
                </select>
                <p className="text-sm text-gray-600 mt-2">
                  {formData.status === 'pending' && 'User will need to be activated before they can access the system'}
                  {formData.status === 'active' && 'User will have immediate access to the system'}
                  {formData.status === 'inactive' && 'User account will be disabled and cannot access the system'}
                </p>
              </div>
            </motion.div>

            {/* User Info Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">User Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <UserPlus className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formData.name || 'Not specified'}</p>
                      <p className="text-sm text-gray-600">Full Name</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formData.email || 'Not specified'}</p>
                      <p className="text-sm text-gray-600">Email Address</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formData.phone || 'Not specified'}</p>
                      <p className="text-sm text-gray-600">Phone Number</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{getRoleInfo(formData.role || 'user').name}</p>
                      <p className="text-sm text-gray-600">Role</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formData.department || 'Not specified'}</p>
                      <p className="text-sm text-gray-600">Department</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">{formData.status || 'pending'}</p>
                      <p className="text-sm text-gray-600">Status</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">User ID:</span>
                    <span className="ml-2 font-mono text-gray-900">{user.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-2 text-gray-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="ml-2 text-gray-900">
                      {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-GB') : 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Login:</span>
                    <span className="ml-2 text-gray-900">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-GB') : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  )
}
