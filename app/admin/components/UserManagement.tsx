'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Users, Search, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Skeleton from '@/components/Skeleton'
import toast from 'react-hot-toast'
import { fetchUsers, deleteUser, updateUser, type User } from '@/lib/users'
import { useAuth } from '@/lib/auth-context'

export const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [roleFilter, setRoleFilter] = useState('all')
    const [showDeleteDialog, setShowDeleteDialog] = useState<{ userId: string; userName: string } | null>(null)
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

    const { user: currentUser } = useAuth()
    const isSuperAdmin = currentUser?.role === 'super_admin'

    const load = async () => {
        setLoading(true)
        try {
            const list = await fetchUsers()
            setUsers(list)
        } catch (e) {
            console.error('Failed to load users:', e)
            toast.error('Failed to load users')
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const handleDeleteUser = async (userId: string, userName: string) => {
        setDeletingUserId(userId)
        try {
            const success = await deleteUser(userId)
            if (success) {
                setUsers(prev => prev.filter(user => user.id !== userId))
                toast.success('User deleted successfully')
                setShowDeleteDialog(null)
            } else {
                toast.error('Failed to delete user')
            }
        } catch (error) {
            toast.error('Failed to delete user')
        } finally {
            setDeletingUserId(null)
        }
    }

    const handleRoleChange = async (userId: string, newRole: 'super_admin' | 'admin' | 'editor' | 'user') => {
        if (!isSuperAdmin) {
            toast.error('Only super admins can change user roles')
            return
        }
        try {
            await updateUser(userId, { role: newRole })
            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ))
            toast.success('User role updated successfully')
        } catch (error) {
            toast.error('Failed to update user role')
        }
    }

    const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive' | 'pending') => {
        try {
            await updateUser(userId, { status: newStatus })
            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            ))
            toast.success('User status updated successfully')
        } catch (error) {
            toast.error('Failed to update user status')
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        return matchesSearch && matchesStatus && matchesRole
    })

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800'
            case 'editor': return 'bg-blue-100 text-blue-800'
            case 'user': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'inactive': return 'bg-red-100 text-red-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Never'
        try {
            return new Date(dateString).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
        } catch {
            return 'Invalid date'
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">User Management</h2>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage user accounts and permissions</p>
                </div>
                {isSuperAdmin && (
                    <Link href="/admin/users/new" className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center sm:justify-start space-x-2 w-full sm:w-auto">
                        <Plus className="w-4 h-4" />
                        <span>Add User</span>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">{users.length}</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-blue-500 rounded-lg"><Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Active Users</p>
                            <p className="text-xl sm:text-2xl font-bold text-green-600">{users.filter(user => user.status === 'active').length}</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-green-500 rounded-lg"><Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Admins</p>
                            <p className="text-xl sm:text-2xl font-bold text-red-600">{users.filter(user => user.role === 'admin').length}</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-red-500 rounded-lg"><Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600">Editors</p>
                            <p className="text-xl sm:text-2xl font-bold text-blue-600">{users.filter(user => user.role === 'editor').length}</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-blue-500 rounded-lg"><Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-4 sm:mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Search Users</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Status</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Role</label>
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg">
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-3 sm:px-6 py-4"><Skeleton className="h-10 w-32 rounded" /></td>
                                        <td className="px-3 sm:px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                                        <td className="px-3 sm:px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                                        <td className="px-3 sm:px-6 py-4"><Skeleton className="h-8 w-16" /></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={4} className="px-3 sm:px-6 py-8 text-center text-gray-500">No users found</td></tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-3 sm:px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-xs font-medium">{user.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                                            className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getRoleColor(user.role)}`}
                                            disabled={!isSuperAdmin || user.role === 'super_admin'}
                                        >
                                            <option value="super_admin">Super Admin</option>
                                            <option value="admin">Admin</option>
                                            <option value="editor">Editor</option>
                                            <option value="user">User</option>
                                        </select>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4">
                                        <select value={user.status} onChange={(e) => handleStatusChange(user.id, e.target.value as any)} className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(user.status)}`}>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <Link href={`/admin/users/edit/${user.id}`} className="text-blue-600 hover:text-blue-900"><Edit className="w-4 h-4" /></Link>
                                            {isSuperAdmin && user.role !== 'super_admin' && (
                                                <button onClick={() => setShowDeleteDialog({ userId: user.id, userName: user.name })} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4 text-red-600">Confirm Delete</h3>
                        <p className="mb-6">Delete user <strong>{showDeleteDialog.userName}</strong>? This cannot be undone.</p>
                        <div className="flex space-x-3">
                            <button onClick={() => setShowDeleteDialog(null)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                            <button onClick={() => handleDeleteUser(showDeleteDialog.userId, showDeleteDialog.userName)} disabled={deletingUserId === showDeleteDialog.userId} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg">
                                {deletingUserId ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
