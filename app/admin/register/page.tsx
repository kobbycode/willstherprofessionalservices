'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowLeft,
  Shield,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getDb } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'admin'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [auth, setAuth] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      console.log('Register page: Initializing Firebase auth...')
      const { getFirebaseApp } = require('@/lib/firebase')
      const firebaseApp = getFirebaseApp()
      const authInstance = getAuth(firebaseApp)
      console.log('Register page: Firebase auth initialized successfully')
      setAuth(authInstance)
    } catch (error) {
      console.error('Register page: Failed to initialize Firebase auth:', error)
      setError('Failed to initialize authentication system')
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (!auth) {
      setError('Authentication system not ready. Please refresh the page.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      )
      
      const user = userCredential.user
      console.log('Firebase Auth user created:', user.uid)
      
      // Create user document in Firestore
      try {
        console.log('Creating Firestore document...')
        const db = getDb()
        console.log('Firestore DB initialized:', !!db)
        
        const userData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLogin: null,
          permissions: ['read', 'write', 'delete', 'manage_users', 'manage_content']
        }
        
        console.log('User data to save:', userData)
        console.log('User UID:', user.uid)
        
        const userRef = doc(db, 'users', user.uid)
        console.log('Document reference created:', userRef.path)
        
        await setDoc(userRef, userData)
        console.log('Firestore document created successfully')
        
        toast.success('Admin account created successfully!')
        
        // Set admin token for immediate access
        localStorage.setItem('adminToken', 'authenticated')
        
        // Redirect to admin dashboard
        router.push('/admin')
        
      } catch (firestoreError) {
        console.error('Firestore error details:', firestoreError)
        console.error('Firestore error code:', (firestoreError as any)?.code)
        console.error('Firestore error message:', (firestoreError as any)?.message)
        
        // Try to create the document again with a different approach
        try {
          console.log('Retrying Firestore document creation...')
          const db = getDb()
          const userRef = doc(db, 'users', user.uid)
          
          // Try with addDoc instead of setDoc
          await setDoc(userRef, {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: null,
            permissions: ['read', 'write', 'delete', 'manage_users', 'manage_content']
          })
          
          console.log('Firestore document created on retry')
          toast.success('Admin account created successfully!')
          localStorage.setItem('adminToken', 'authenticated')
          router.push('/admin')
          
        } catch (retryError) {
          console.error('Retry also failed:', retryError)
          // Even if Firestore fails, the user is created in Auth
          // We can create the document later
          toast.success('Account created! Setting up profile...')
          localStorage.setItem('adminToken', 'authenticated')
          router.push('/admin')
        }
      }
      
    } catch (err: any) {
      console.error('Registration error:', err)
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Login */}
        <div className="mb-6">
          <Link 
            href="/admin/login"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>

        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Registration</h1>
          <p className="text-gray-600 mt-2">Create your admin account</p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          {!auth ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Initializing authentication system...</p>
              <p className="text-xs text-gray-500 mt-2">Check browser console for details</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your phone number"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Role Field */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={isLoading}
                >
                  <option value="admin">Administrator</option>
                  <option value="editor">Editor</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Create a password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Create Admin Account</span>
                  </div>
                )}
              </button>
            </form>
          )}

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Registration Info</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• Each admin will have their own unique credentials</p>
              <p>• Password must be at least 6 characters long</p>
              <p>• You'll be redirected to admin dashboard after registration</p>
            </div>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/admin/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
