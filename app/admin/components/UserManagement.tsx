'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Users,
    Search,
    Edit,
    Trash2,
    Shield,
    UserCheck,
    UserMinus,
    UserPlus,
    Filter,
    MoreHorizontal,
    Mail,
    Calendar,
    Activity,
    PieChart as PieIcon,
    BarChart2,
    X as CloseIcon
} from 'lucide-react'
import Link from 'next/link'
import Skeleton from '@/components/Skeleton'
import toast from 'react-hot-toast'
import { fetchUsers, deleteUser, updateUser, type User } from '@/lib/users'
import { useAuth } from '@/lib/auth-context'
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444']

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

    const handleDeleteUser = async (userId: string) => {
        setDeletingUserId(userId)
        try {
            const success = await deleteUser(userId)
            if (success) {
                setUsers(prev => prev.filter(user => user.id !== userId))
                toast.success('User deleted')
                setShowDeleteDialog(null)
            }
        } catch (error) {
            toast.error('Setting failure: Could not delete user')
        } finally {
            setDeletingUserId(null)
        }
    }

    const handleRoleChange = async (userId: string, newRole: 'super_admin' | 'admin' | 'editor' | 'user') => {
        if (!isSuperAdmin) {
            toast.error('Only Super Admins can do this')
            return
        }
        try {
            await updateUser(userId, { role: newRole })
            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ))
            toast.success('Role changed')
        } catch (error) {
            toast.error('Failed to change role')
        }
    }

    const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive' | 'pending') => {
        try {
            await updateUser(userId, { status: newStatus })
            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            ))
            toast.success('Status updated')
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter
            const matchesRole = roleFilter === 'all' || user.role === roleFilter
            return matchesSearch && matchesStatus && matchesRole
        })
    }, [users, searchTerm, statusFilter, roleFilter])

    const stats = useMemo(() => {
        const roleData: Record<string, number> = {}
        const statusData: Record<string, number> = {}

        users.forEach(u => {
            roleData[u.role] = (roleData[u.role] || 0) + 1
            statusData[u.status] = (statusData[u.status] || 0) + 1
        })

        return {
            total: users.length,
            active: statusData['active'] || 0,
            pending: statusData['pending'] || 0,
            roles: Object.entries(roleData).map(([name, value]) => ({ name, value }))
        }
    }, [users])

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
            {/* Top Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight">User Management</h2>
                    <p className="text-secondary-600 font-medium mt-1">Manage user roles and permissions</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
                        <button
                            onClick={() => setRoleFilter('all')}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${roleFilter === 'all' ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/20' : 'text-secondary-400 hover:text-primary-900'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setRoleFilter('admin')}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${roleFilter === 'admin' ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/20' : 'text-secondary-400 hover:text-primary-900'}`}
                        >
                            Admins
                        </button>
                    </div>
                    {isSuperAdmin && (
                        <Link href="/admin/users/new" className="flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-primary-900 font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-accent-500/20 active:scale-95">
                            <UserPlus className="w-4 h-4" />
                            <span>Commission User</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Settings', value: stats.total, icon: Users, color: 'blue' },
                    { label: 'Authorized Access', value: stats.active, icon: UserCheck, color: 'emerald' },
                    { label: 'Credentials Pending', value: stats.pending, icon: Activity, color: 'rose' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-3xl shadow-premium p-6 border border-gray-100 flex items-center gap-6">
                        <div className={`p-4 bg-${stat.color}-500 rounded-[1.25rem] shadow-lg shadow-${stat.color}-500/20`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-primary-900 leading-none">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] shadow-premium p-8 border border-gray-100 flex flex-col h-[350px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-primary-900 uppercase tracking-tight">Privilege distribution</h3>
                        <Shield className="w-5 h-5 text-secondary-300" />
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.roles} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} width={80} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                                    {stats.roles.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-premium p-8 border border-gray-100 flex flex-col h-[350px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-primary-900 uppercase tracking-tight">Access Demographics</h3>
                        <PieIcon className="w-5 h-5 text-secondary-300" />
                    </div>
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.roles}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {stats.roles.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-primary-900 leading-none">{stats.total}</span>
                            <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mt-1">Entities</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Table */}
            <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-900 transition-colors w-4 h-4" />
                        <input
                            type="text"
                            placeholder="QUERY Settings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border-none rounded-2xl text-[11px] font-black tracking-widest uppercase focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none text-primary-900"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                            <Filter className="w-4 h-4 text-secondary-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none text-secondary-600 focus:ring-0"
                            >
                                <option value="all">Any Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Identity</th>
                                <th className="px-8 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Clearance Level</th>
                                <th className="px-8 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">System Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Engagement</th>
                                <th className="px-8 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}><td colSpan={5} className="px-8 py-4"><Skeleton className="h-12 w-full rounded-2xl" /></td></tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={5} className="px-8 py-20 text-center text-sm font-bold text-secondary-300 uppercase tracking-[0.3em]">No matching entities in Settings</td></tr>
                            ) : filteredUsers.map((u) => (
                                <tr key={u.id} className="group hover:bg-gray-50/80 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary-900/10">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-primary-900 tracking-tight">{u.name}</h4>
                                                <div className="flex items-center gap-2 text-secondary-400 mt-1">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="text-[11px] font-bold lowercase tracking-normal">{u.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                                            disabled={!isSuperAdmin || u.role === 'super_admin'}
                                            className="bg-white border-none text-[10px] font-black uppercase tracking-widest text-primary-900 focus:ring-0 cursor-pointer disabled:opacity-50"
                                        >
                                            <option value="super_admin">SUPER ADMIN</option>
                                            <option value="admin">ADMIN</option>
                                            <option value="editor">EDITOR</option>
                                            <option value="user">USER</option>
                                        </select>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : u.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                                            <select
                                                value={u.status}
                                                onChange={(e) => handleStatusChange(u.id, e.target.value as any)}
                                                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-primary-900 focus:ring-0 cursor-pointer"
                                            >
                                                <option value="active">ACTIVE</option>
                                                <option value="inactive">INACTIVE</option>
                                                <option value="pending">PENDING</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-secondary-400">
                                            <Calendar className="w-3 h-3" />
                                            <span className="text-[11px] font-bold">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'LEGACY'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <Link href={`/admin/users/edit/${u.id}`} className="p-2.5 bg-white text-primary-900 rounded-xl shadow-sm border border-gray-100 hover:bg-primary-900 hover:text-white transition-all">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            {isSuperAdmin && u.role !== 'super_admin' && (
                                                <button onClick={() => setShowDeleteDialog({ userId: u.id, userName: u.name })} className="p-2.5 bg-white text-rose-500 rounded-xl shadow-sm border border-gray-100 hover:bg-rose-500 hover:text-white transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Delete Confirmation */}
            <AnimatePresence>
                {showDeleteDialog && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary-900/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setShowDeleteDialog(null)}><CloseIcon className="w-6 h-6 text-secondary-300 hover:text-primary-900 transition-colors" /></button>
                            </div>
                            <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center mb-6">
                                <UserMinus className="w-10 h-10 text-rose-500" />
                            </div>
                            <h3 className="text-2xl font-black text-primary-900 tracking-tight leading-tight">Delete user?</h3>
                            <p className="text-secondary-500 font-medium mt-3 leading-relaxed">
                                You are about to remove <span className="text-primary-900 font-black">@{showDeleteDialog.userName}</span> from the system. This action cannot be undone.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-10">
                                <button
                                    onClick={() => setShowDeleteDialog(null)}
                                    className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-secondary-400 hover:text-primary-900 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                                >
                                    Abort
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(showDeleteDialog.userId)}
                                    disabled={!!deletingUserId}
                                    className="px-6 py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deletingUserId ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                                    <span>Confirm Delete</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
