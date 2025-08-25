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
  role: 'admin' | 'editor' | 'user'
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
  hasRole: (role: 'admin' | 'editor' | 'user') => boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadUserData = async (firebaseUser: FirebaseUser): Promise<AuthUser | null> => {
    try {
      const db = getDb()
      const userRef = doc(db, 'users', firebaseUser.uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || data.name || 'Admin User',
          photoURL: firebaseUser.photoURL || data.avatar || '/logo.jpg',
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
          photoURL: firebaseUser.photoURL || '/logo.jpg',
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

        await setDoc(userRef, {
          name: defaultUser.displayName,
          email: defaultUser.email,
          role: defaultUser.role,
          status: defaultUser.status,
          avatar: defaultUser.photoURL,
          phone: defaultUser.phone,
          bio: defaultUser.bio,
          location: defaultUser.location,
          timezone: defaultUser.timezone,
          notifications: defaultUser.notifications,
          preferences: defaultUser.preferences,
          permissions: defaultUser.permissions,
          lastLogin: defaultUser.lastLogin,
          createdAt: defaultUser.createdAt,
          updatedAt: defaultUser.updatedAt
        }, { merge: true })

        return defaultUser
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      return null
    }
  }

  const handleSignOut = async () => {
    try {
      const auth = getAuth()
      await signOut(auth)
      setUser(null)
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions.includes(permission) || user.permissions.includes('all') || user.role === 'admin'
  }

  const hasRole = (role: 'admin' | 'editor' | 'user'): boolean => {
    if (!user) return false
    const roleHierarchy = { admin: 3, editor: 2, user: 1 }
    return roleHierarchy[user.role] >= roleHierarchy[role]
  }

  const refreshUser = async () => {
    const auth = getAuth()
    if (auth.currentUser) {
      const userData = await loadUserData(auth.currentUser)
      setUser(userData)
    }
  }

  useEffect(() => {
    const auth = getAuth()
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('User authenticated:', firebaseUser.email)
        const userData = await loadUserData(firebaseUser)
        setUser(userData)
        localStorage.setItem('adminToken', 'authenticated')
      } else {
        console.log('No user authenticated')
        setUser(null)
        localStorage.removeItem('adminToken')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    signOut: handleSignOut,
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
