'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Shield } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface AdminAuthProps {
  children: React.ReactNode
}

const AdminAuth = ({ children }: AdminAuthProps) => {
  const { user, loading } = useAuth()
  const router = useRouter()

  console.log('AdminAuth: Current state:', { user, loading })

  useEffect(() => {
    console.log('AdminAuth: useEffect triggered:', { user, loading })
    if (!loading && !user) {
      console.log('AdminAuth: Redirecting to login - no user and not loading')
      router.push('/admin/login')
    }
  }, [user, loading, router])

  if (loading) {
    console.log('AdminAuth: Showing loading state')
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

  if (!user) {
    console.log('AdminAuth: No user, returning null')
    return null
  }

  console.log('AdminAuth: User authenticated, rendering children')
  return <>{children}</>
}

export default AdminAuth

