'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
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

          console.log('Firebase initialized successfully in AuthContext')
          console.log('Current Firebase user on init:', auth.currentUser?.email)
          setFirebaseReady(true)

          // Check if user is already authenticated
          if (auth.currentUser) {
            console.log('User already authenticated, loading user data...')
            const userData = await loadUserData(auth.currentUser)
            setUser(userData)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to initialize Firebase in AuthContext:', error)
        setFirebaseReady(false)
        setLoading(false)
      }
    }

    initializeFirebase()
  }, [])

  const loadUserData = async (firebaseUser: FirebaseUser): Promise<AuthUser | null> => {
    try {
      console.log('Loading user data for UID:', firebaseUser.uid)
      const db = getDb()
      const userRef = doc(db, 'users', firebaseUser.uid)
      console.log('User document reference:', userRef.path)

      // Add timeout for Firestore operations (reduced to 3 seconds to prevent conflicts)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Firestore operation timeout after 10 seconds')), 10000)
      })

      const userDocPromise = getDoc(userRef)
      const userDoc = await Promise.race([userDocPromise, timeoutPromise]) as any

      console.log('User document exists:', userDoc.exists())

      if (userDoc.exists()) {
        const data = userDoc.data()
        console.log('User document data:', data)
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
        console.log('User document does not exist, creating new one...')
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

        console.log('Creating user document with data:', defaultUser)
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
        console.log('User document created successfully')

        return defaultUser
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      console.error('Error details:', {
        code: error instanceof Error ? error.message : 'Unknown error',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      })

      // If it's a timeout or connection error, return a basic user object
      if (error instanceof Error && (error.message.includes('timeout') || error.message.includes('400'))) {
        console.log('Firestore connection issue, creating basic user object')
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
          console.log('AuthContext: User authenticated:', firebaseUser.email)
          const userData = await loadUserData(firebaseUser)
          console.log('AuthContext: User data loaded:', userData)
          setUser(userData)
          console.log('AuthContext: User state updated to:', userData)
        } else {
          console.log('AuthContext: User signed out')
          setUser(null)
        }
      } catch (error) {
        console.error('AuthContext: Error in auth state change:', error)
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
      console.error('Error signing out:', error)
    }
  }

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false
  }

  const hasRole = (role: 'super_admin' | 'admin' | 'editor' | 'user'): boolean => {
    // super_admin has all roles
    if (user?.role === 'super_admin') return true
    if (user?.role === 'admin' && role !== 'super_admin') return true
    return user?.role === role
  }

  const refreshUser = async (): Promise<AuthUser | null> => {
    if (!firebaseReady) {
      console.log('Firebase not ready yet, skipping refresh')
      return null
    }

    try {
      console.log('Refreshing user data...')
      const auth = getAuth()
      const currentUser = auth.currentUser

      if (currentUser) {
        console.log('Current Firebase user found:', currentUser.email)
        const userData = await loadUserData(currentUser)
        console.log('User data loaded:', userData)
        setUser(userData)
        return userData
      } else {
        console.log('No current Firebase user found')
        setUser(null)
        return null
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
      return null
    }
  }

  const value: AuthContextType = {
    user,
    loading: loading || !firebaseReady,
    signOut: authSignOut,
    hasPermission,
    hasRole,
    refreshUser
  }

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
