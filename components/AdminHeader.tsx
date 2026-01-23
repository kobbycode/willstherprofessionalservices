'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    Settings,
    Menu as MenuIcon,
    X,
    User as UserIcon,
    LogOut,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'

interface AdminHeaderProps {
    title: string
    subtitle?: string
    backLink?: string
    backLabel?: string
    showMobileMenuToggle?: boolean
    isMobileMenuOpen?: boolean
    onMobileMenuToggle?: () => void
    onLogoutClick?: () => void
    showBadge?: boolean
    badgeLabel?: string
    actions?: React.ReactNode
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
    title,
    subtitle,
    backLink,
    backLabel = 'Back',
    showMobileMenuToggle = false,
    isMobileMenuOpen = false,
    onMobileMenuToggle,
    onLogoutClick,
    showBadge = false,
    badgeLabel = 'Live System',
    actions
}) => {
    const { user } = useAuth()

    return (
        <div className="bg-primary-900 shadow-premium border-b border-white/10 sticky top-0 z-50">
            <div className="px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-6">
                        {backLink ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={backLink}
                                    className="flex items-center space-x-2 text-primary-100 hover:text-accent-500 transition-colors text-sm sm:text-base group"
                                >
                                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                                    <span>{backLabel}</span>
                                </Link>
                                <div className="hidden sm:block h-6 w-px bg-white/20"></div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-accent-500">{title}</h1>
                                    {subtitle && <p className="text-primary-100/70 mt-1 text-sm sm:text-base">{subtitle}</p>}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <Link href="/" className="relative overflow-hidden rounded-lg border border-white/10 shadow-lg group hidden sm:block">
                                    <Image
                                        src="/logo-v2.jpg"
                                        alt="Willsther Logo"
                                        width={120}
                                        height={48}
                                        priority
                                        className="w-20 h-10 sm:w-24 sm:h-12 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </Link>
                                <div className="sm:hidden w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <Settings className="w-5 h-5 text-primary-900" />
                                </div>
                                <div>
                                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-accent-500">
                                        {title}
                                    </h1>
                                    {subtitle && <p className="text-[10px] sm:text-xs text-primary-100/70 uppercase tracking-widest font-bold hidden sm:block">{subtitle}</p>}
                                </div>
                            </div>
                        )}

                        {showBadge && (
                            <div className="hidden lg:flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="px-3 py-1 bg-white/5 text-accent-500 text-xs font-bold rounded-full border border-white/10 backdrop-blur-md uppercase tracking-wider">
                                    {badgeLabel}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {showMobileMenuToggle && (
                            <button
                                onClick={onMobileMenuToggle}
                                className="lg:hidden p-2 text-primary-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                                title="Toggle Menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <MenuIcon className="w-5 h-5" />
                                )}
                            </button>
                        )}

                        <Link
                            href="/admin/profile"
                            className="p-2 sm:p-3 text-primary-100 hover:text-accent-500 hover:bg-white/10 rounded-xl transition-all duration-200 group"
                            title="Profile"
                        >
                            <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                        </Link>

                        <div className="flex items-center space-x-2 sm:space-x-3 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 sm:px-4 sm:py-2 backdrop-blur-md">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-accent-500 rounded-full flex items-center justify-center shadow-md">
                                {user?.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-primary-900 text-xs sm:text-sm font-bold">
                                        {user?.displayName?.charAt(0) || 'A'}
                                    </span>
                                )}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-bold text-white leading-tight">{user?.displayName || 'Admin User'}</p>
                                <p className="text-[10px] text-primary-200 font-bold uppercase tracking-wider">{user?.role || 'Administrator'}</p>
                            </div>
                        </div>

                        {actions}

                        {onLogoutClick && (
                            <button
                                onClick={onLogoutClick}
                                className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-all duration-200 border border-red-500/20"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-bold hidden sm:block">Logout</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminHeader
