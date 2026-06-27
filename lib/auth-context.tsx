'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback, ReactNode } from 'react'
import { getAuth, onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth'
import { getDb } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role: 'super_admin' | 'admin' | 'editor' | 'user'
  status: 'active' | 'inactive' | 'pending'
  permissions: string[]
  phone?: string
  bio?: string
  location?: string
  timezone?: string
  notifications?: {
    email: boolean
    push: boolean
    sms: boolean
  }
  preferences?: {
    theme: 'light' | 'dark' | 'auto'
    compactMode: boolean
    autoSave: boolean
  }
  lastLogin?: string
  createdAt?: string
  updatedAt?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
  hasPermission: (permission: string) => boolean
  hasRole: (role: 'super_admin' | 'admin' | 'editor' | 'user') => boolean
  refreshUser: () => Promise<AuthUser | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [firebaseReady, setFirebaseReady] = useState(false)
  const router = useRouter()

  // Initialize Firebase first
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        if (typeof window !== 'undefined') {
          // Import Firebase functions dynamically to ensure they're only called on client
          const { getAuth } = await import('firebase/auth')
          const { getDb } = await import('./firebase')

          // Test Firebase initialization
          const auth = getAuth()
          const db = getDb()

          setFirebaseReady(true)

          // Check if user is already authenticated
          if (auth.currentUser) {
            const userData = await loadUserData(auth.currentUser)
            setUser(userData)
          }
          setLoading(false)
        }
      } catch (error) {
        setFirebaseReady(false)
        setLoading(false)
      }
    }

    initializeFirebase()
  }, [])

  const loadUserData = async (firebaseUser: FirebaseUser): Promise<AuthUser | null> => {
    try {
      const db = getDb()
      const userRef = doc(db, 'users', firebaseUser.uid)

      // Add timeout for Firestore operations (reduced to 3 seconds to prevent conflicts)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Firestore operation timeout after 10 seconds')), 10000)
      })

      const userDocPromise = getDoc(userRef)
      const userDoc = await Promise.race([userDocPromise, timeoutPromise]) as any

      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || data.name || 'Admin User',
          photoURL: firebaseUser.photoURL || data.avatar || '/logo-v2.jpg',
          role: data.role || 'user',
          status: data.status || 'pending',
          permissions: data.permissions || ['read'],
          phone: data.phone || '',
          bio: data.bio || '',
          location: data.location || '',
          timezone: data.timezone || 'Africa/Accra',
          notifications: data.notifications || { email: true, push: true, sms: false },
          preferences: data.preferences || { theme: 'light', compactMode: false, autoSave: true },
          lastLogin: data.lastLogin || new Date().toISOString(),
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString()
        }
      } else {
        // Create user document if it doesn't exist
        const defaultUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Admin User',
          photoURL: firebaseUser.photoURL || '/logo-v2.jpg',
          role: 'user',
          status: 'pending',
          permissions: ['read'],
          phone: '',
          bio: '',
          location: '',
          timezone: 'Africa/Accra',
          notifications: { email: true, push: true, sms: false },
          preferences: { theme: 'light', compactMode: false, autoSave: true },
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        const setDocPromise = setDoc(userRef, {
          name: defaultUser.displayName,
          email: defaultUser.email,
          phone: defaultUser.phone,
          role: defaultUser.role,
          status: defaultUser.status,
          avatar: defaultUser.photoURL,
          permissions: defaultUser.permissions,
          bio: defaultUser.bio,
          location: defaultUser.location,
          timezone: defaultUser.timezone,
          notifications: defaultUser.notifications,
          preferences: defaultUser.preferences,
          lastLogin: defaultUser.lastLogin,
          createdAt: defaultUser.createdAt,
          updatedAt: defaultUser.updatedAt
        })

        await Promise.race([setDocPromise, timeoutPromise])

        return defaultUser
      }
    } catch (error) {
      // If it's a timeout or connection error, return a basic user object
      if (error instanceof Error && (error.message.includes('timeout') || error.message.includes('400'))) {
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Admin User',
          photoURL: firebaseUser.photoURL || '/logo-v2.jpg',
          role: 'user',
          status: 'pending',
          permissions: ['read'],
          phone: '',
          bio: '',
          location: '',
          timezone: 'Africa/Accra',
          notifications: { email: true, push: true, sms: false },
          preferences: { theme: 'light', compactMode: false, autoSave: true },
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }

      return null
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    if (!firebaseReady) return

    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await loadUserData(firebaseUser)
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [firebaseReady])

  const authSignOut = async () => {
    try {
      const auth = getAuth()
      await signOut(auth)
      setUser(null)
    } catch (error) {
    }
  }

  const hasPermission = useCallback((permission: string): boolean => {
    return user?.permissions?.includes(permission) || false
  }, [user])

  const hasRole = useCallback((role: 'super_admin' | 'admin' | 'editor' | 'user'): boolean => {
    // super_admin has all roles
    if (user?.role === 'super_admin') return true
    if (user?.role === 'admin' && role !== 'super_admin') return true
    return user?.role === role
  }, [user])

  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    if (!firebaseReady) {
      return null
    }

    try {
      const auth = getAuth()
      const currentUser = auth.currentUser

      if (currentUser) {
        const userData = await loadUserData(currentUser)
        setUser(userData)
        return userData
      } else {
        setUser(null)
        return null
      }
    } catch (error) {
      setUser(null)
      return null
    }
  }, [firebaseReady])

  const value: AuthContextType = useMemo(() => ({
    user,
    loading: loading || !firebaseReady,
    signOut: authSignOut,
    hasPermission,
    hasRole,
    refreshUser
  }), [user, loading, firebaseReady, authSignOut, hasPermission, hasRole, refreshUser])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
