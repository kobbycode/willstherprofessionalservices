'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getDb } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const [auth, setAuth] = useState<any>(null)

  // Initialize Firebase auth when component mounts
  useEffect(() => {
    try {
      console.log('Login page: Initializing Firebase auth...')
      const { getFirebaseApp } = require('@/lib/firebase')
      const firebaseApp = getFirebaseApp()
      const authInstance = getAuth(firebaseApp)
      console.log('Login page: Firebase auth initialized successfully')
      setAuth(authInstance)
    } catch (error) {
      console.error('Login page: Failed to initialize Firebase auth:', error)
      setError('Failed to initialize authentication system')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!auth) {
      setError('Authentication system not ready. Please refresh the page.')
      setIsLoading(false)
      return
    }

    try {
      // Sign in with Firebase
      const credential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      const user = credential.user
      try {
        const db = getDb()
        const userRef = doc(db, 'users', user.uid)
        const snap = await getDoc(userRef)
        if (!snap.exists()) {
          await setDoc(userRef, {
            name: user.displayName || 'Admin User',
            email: user.email || formData.email,
            phone: '',
            role: 'admin',
            status: 'active',
            avatar: '/logo.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            permissions: ['read', 'write', 'delete', 'manage_users', 'manage_content']
          }, { merge: true })
        } else {
          await setDoc(userRef, {
            updatedAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }, { merge: true })
        }
      } catch (docError) {
        console.error('Failed to ensure user document on login:', docError)
      }
      
      // Set admin token in localStorage
      localStorage.setItem('adminToken', 'authenticated')
      
      router.push('/admin')
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email')
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address')
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-gray-600 mt-2">Sign in to manage your website</p>
        </motion.div>

        {/* Login Form */}
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
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
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
                  placeholder="Enter your password"
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
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          )}

          {/* Demo Credentials */}
                          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Admin Access</h3>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p>Use your individual admin credentials</p>
                    <p className="mt-2 text-blue-600">Contact system administrator for access</p>
                  </div>
                </div>

          {/* Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Need an admin account?{' '}
              <Link 
                href="/admin/register" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Register here
              </Link>
            </p>
            <Link 
              href="/" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Website
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            Protected by secure authentication
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminLogin

