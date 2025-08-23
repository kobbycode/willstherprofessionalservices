'use client'

import { getDb } from './firebase'
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp, type DocumentData } from 'firebase/firestore'

export type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'user'
  status: 'active' | 'inactive' | 'pending'
  lastLogin?: string
  createdAt?: string
  updatedAt?: string
  avatarUrl?: string
  phone?: string
  department?: string
  permissions?: string[]
}

export type NewUserInput = {
  name: string
  email: string
  role?: 'admin' | 'editor' | 'user'
  status?: 'active' | 'inactive' | 'pending'
  phone?: string
  department?: string
  permissions?: string[]
}

// Fetch all users
export async function fetchUsers(): Promise<User[]> {
  try {
    const db = getDb()
    const usersRef = collection(db, 'users')
    const q = query(usersRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        role: data.role || 'user',
        status: data.status || 'pending',
        lastLogin: data.lastLogin || '',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || '',
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || '',
        avatarUrl: data.avatarUrl || '',
        phone: data.phone || '',
        department: data.department || '',
        permissions: data.permissions || []
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

// Fetch user by ID
export async function fetchUserById(id: string): Promise<User | null> {
  try {
    const db = getDb()
    const userRef = doc(db, 'users', id)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) return null
    
    const data = userDoc.data()
    return {
      id: userDoc.id,
      name: data.name || '',
      email: data.email || '',
      role: data.role || 'user',
      status: data.status || 'pending',
      lastLogin: data.lastLogin || '',
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || '',
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || '',
      avatarUrl: data.avatarUrl || '',
      phone: data.phone || '',
      department: data.department || '',
      permissions: data.permissions || []
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

// Create new user
export async function createUser(userData: NewUserInput): Promise<string | null> {
  try {
    const db = getDb()
    const usersRef = collection(db, 'users')
    const docRef = await addDoc(usersRef, {
      ...userData,
      role: userData.role || 'user',
      status: userData.status || 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: null
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

// Update user
export async function updateUser(id: string, userData: Partial<NewUserInput>): Promise<boolean> {
  try {
    const db = getDb()
    const userRef = doc(db, 'users', id)
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error updating user:', error)
    return false
  }
}

// Delete user
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const db = getDb()
    const userRef = doc(db, 'users', id)
    await deleteDoc(userRef)
    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    return false
  }
}

// Update user status
export async function updateUserStatus(id: string, status: 'active' | 'inactive' | 'pending'): Promise<boolean> {
  try {
    const db = getDb()
    const userRef = doc(db, 'users', id)
    await updateDoc(userRef, {
      status,
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error updating user status:', error)
    return false
  }
}

// Update user role
export async function updateUserRole(id: string, role: 'admin' | 'editor' | 'user'): Promise<boolean> {
  try {
    const db = getDb()
    const userRef = doc(db, 'users', id)
    await updateDoc(userRef, {
      role,
      updatedAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error updating user role:', error)
    return false
  }
}

// Get user statistics
export async function getUserStats(): Promise<{
  total: number
  active: number
  inactive: number
  pending: number
  admins: number
  editors: number
  users: number
}> {
  try {
    const users = await fetchUsers()
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      pending: users.filter(u => u.status === 'pending').length,
      admins: users.filter(u => u.role === 'admin').length,
      editors: users.filter(u => u.role === 'editor').length,
      users: users.filter(u => u.role === 'user').length
    }
  } catch (error) {
    console.error('Error getting user stats:', error)
    return {
      total: 0,
      active: 0,
      inactive: 0,
      pending: 0,
      admins: 0,
      editors: 0,
      users: 0
    }
  }
}

// Seed initial users if none exist
export async function seedInitialUsers(): Promise<void> {
  try {
    const users = await fetchUsers()
    if (users.length === 0) {
      const initialUsers: NewUserInput[] = [
        {
          name: 'Admin User',
          email: 'admin@willsther.com',
          role: 'admin',
          status: 'active',
          phone: '(233) 594 850 005',
          department: 'Management',
          permissions: ['all']
        },
        {
          name: 'Content Editor',
          email: 'editor@willsther.com',
          role: 'editor',
          status: 'active',
          phone: '(233) 594 850 006',
          department: 'Content',
          permissions: ['blog', 'content', 'categories', 'view']
        },
        {
          name: 'Support User',
          email: 'support@willsther.com',
          role: 'user',
          status: 'active',
          phone: '(233) 594 850 007',
          department: 'Support',
          permissions: ['view']
        }
      ]

      for (const userData of initialUsers) {
        await createUser(userData)
      }
    }
  } catch (error) {
    console.error('Error seeding initial users:', error)
  }
}
