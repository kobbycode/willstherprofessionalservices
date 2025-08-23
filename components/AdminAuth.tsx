'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Shield } from 'lucide-react'

interface AdminAuthProps {
  children: React.ReactNode
}

const AdminAuth = ({ children }: AdminAuthProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    // Check for admin token in localStorage
    const adminToken = localStorage.getItem('adminToken')
    
    if (adminToken) {
      setIsAuthenticated(true)
      setIsLoading(false)
    } else {
      // Try to initialize Firebase auth
      const initFirebase = async () => {
        try {
          const { getAuth, onAuthStateChanged } = await import('firebase/auth')
          const { getFirebaseApp } = await import('@/lib/firebase')
          
          // Initialize Firebase app first
          const firebaseApp = getFirebaseApp()
          const auth = getAuth(firebaseApp)
          
          // Add a timeout to prevent infinite loading
          const timeoutId = setTimeout(() => {
            console.warn('Firebase auth timeout - redirecting to login')
            setIsLoading(false)
            setIsAuthenticated(false)
            router.push('/admin/login')
          }, 5000) // 5 second timeout

          // Listen for Firebase auth state changes
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            clearTimeout(timeoutId)
            if (user) {
              console.log('User authenticated:', user.email)
              setIsAuthenticated(true)
              localStorage.setItem('adminToken', 'authenticated')
            } else {
              console.log('No user authenticated')
              setIsAuthenticated(false)
              localStorage.removeItem('adminToken')
              router.push('/admin/login')
            }
            setIsLoading(false)
          })

          return () => {
            clearTimeout(timeoutId)
            unsubscribe()
          }
        } catch (error) {
          console.error('Failed to initialize Firebase auth:', error)
          setIsLoading(false)
          setIsAuthenticated(false)
          router.push('/admin/login')
        }
      }

      initFirebase()
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-gray-600">Verifying access...</span>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Loading admin authentication...</p>
            <p>Check browser console for details</p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default AdminAuth

