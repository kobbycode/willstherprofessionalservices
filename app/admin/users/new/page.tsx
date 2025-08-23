'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, UserPlus, Shield, Eye, Edit, Trash2, Settings, FileText, Users, Globe, MapPin, Phone, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createUser, type NewUserInput } from '@/lib/users'

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

export default function AddUserPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<NewUserInput>({
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

  const getRoleInfo = (role: string | undefined) => {
    return permissions[role as keyof typeof permissions] || permissions.user
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required')
      return
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    try {
      const userData: NewUserInput = {
        ...formData,
        permissions: selectedPermissions
      }

      const userId = await createUser(userData)
      
      if (userId) {
        toast.success('User created successfully!')
        router.push('/admin')
      } else {
        toast.error('Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Failed to create user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/admin" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Back to Admin</span>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New User</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Create a new user account</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center justify-center sm:justify-start space-x-2 px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors text-sm"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Creating...' : 'Create User'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter full name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="Enter department"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Role & Permissions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Role & Permissions
                </h3>
                
                {/* Role Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">User Role</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(permissions).map(([role, info]) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleChange(role as 'admin' | 'editor' | 'user')}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          formData.role === role
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${info.color}`}>
                          {info.name}
                        </div>
                        <p className="text-sm text-gray-600">{info.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Permissions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Permissions</label>
                    <button
                      type="button"
                      onClick={() => setShowCustomPermissions(!showCustomPermissions)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {showCustomPermissions ? 'Hide' : 'Customize'} Permissions
                    </button>
                  </div>
                  
                  {showCustomPermissions && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availablePermissions.map((permission) => (
                        <button
                          key={permission.id}
                          type="button"
                          onClick={() => handlePermissionToggle(permission.id)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                            selectedPermissions.includes(permission.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{permission.name}</span>
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(permission.id)}
                              onChange={() => {}}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                          <p className="text-xs text-gray-600">{permission.description}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Preview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  User Preview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-600">
                        {formData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{formData.name || 'User Name'}</p>
                      <p className="text-sm text-gray-600">{formData.email || 'email@example.com'}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Role:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleInfo(formData.role || 'user').color}`}>
                        {getRoleInfo(formData.role || 'user').name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-600">Status:</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900">Create Admin</div>
                    <div className="text-xs text-gray-600">Full system access</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('editor')}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900">Create Editor</div>
                    <div className="text-xs text-gray-600">Content management access</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('user')}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900">Create User</div>
                    <div className="text-xs text-gray-600">Basic dashboard access</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
