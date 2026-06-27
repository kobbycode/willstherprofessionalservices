'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Trash2,
    Building2,
    Building,
    Pencil,
    X,
    Check,
    Upload
} from 'lucide-react'
import { uploadImage } from '@/lib/storage'
import toast from 'react-hot-toast'
import Image from 'next/image'

import { SiteConfig, ConfigOnChange } from '@/lib/site-config'

interface ClientsConfigProps {
    config: SiteConfig
    onChange: ConfigOnChange
    onSave?: () => Promise<void>
}

export const ClientsConfig = ({ config, onChange, onSave }: ClientsConfigProps) => {
    const clients: { id: string; name: string; logoUrl: string }[] = config.clients || []
    const [editingIndex, setEditingIndex] = React.useState<number | null>(null)
    const [editValue, setEditValue] = React.useState('')
    const [isUploading, setIsUploading] = React.useState<string | null>(null)

    const addClient = () => {
        const id = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        onChange((prev: any) => ({
            ...prev,
            clients: [...(prev.clients || []), { id, name: '', logoUrl: '' }]
        }))
        const newIndex = clients.length
        setEditingIndex(newIndex)
        setEditValue('')
    }

    const updateClient = (id: string, key: string, value: any) => {
        onChange((prev: any) => ({
            ...prev,
            clients: (prev.clients || []).map((c: any) =>
                c.id === id ? { ...c, [key]: value } : c
            )
        }))
    }

    const startEdit = (index: number) => {
        setEditingIndex(index)
        setEditValue(clients[index]?.name || '')
    }

    const confirmEdit = (index: number) => {
        const trimmed = editValue.trim()
        if (!trimmed) {
            toast.error('Client name cannot be empty')
            return
        }
        const client = clients[index]
        if (client) {
            updateClient(client.id, 'name', trimmed)
        }
        setEditingIndex(null)
        setEditValue('')
    }

    const removeClient = (id: string) => {
        onChange((prev: any) => ({
            ...prev,
            clients: (prev.clients || []).filter((c: any) => c.id !== id)
        }))
        toast.success('Client removed')
    }

    const handleUpload = async (id: string, file: File) => {
        if (!file || isUploading) return
        setIsUploading(id)
        const toastId = toast.loading('Uploading logo...')
        try {
            const url = await uploadImage(file, `clients/logo-${id}`)
            if (url) {
                updateClient(id, 'logoUrl', url)
                toast.success('Logo uploaded successfully', { id: toastId })
            } else {
                throw new Error('Upload returned empty URL')
            }
        } catch (error) {
            toast.error('Upload failed. Please try again.', { id: toastId })
        } finally {
            setIsUploading(null)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight uppercase">Our Clients</h2>
                    <p className="text-secondary-500 font-medium tracking-widest text-[10px] uppercase">Manage your featured client list with logos</p>
                </div>
                <button
                    onClick={addClient}
                    className="group relative px-8 py-5 bg-primary-900 text-white rounded-[2rem] shadow-2xl shadow-primary-900/20 hover:shadow-primary-900/40 transition-all active:scale-95 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-4">
                        <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                            <Plus className="w-5 h-5 text-accent-500" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Client</span>
                    </div>
                </button>
            </div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {clients.map((client, index) => (
                        <motion.div
                            key={client.id || index}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:border-primary-900/10 transition-all"
                        >
                            <div className="flex items-center gap-4 p-5">
                                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                                    {client.logoUrl ? (
                                        <Image
                                            src={client.logoUrl}
                                            alt={client.name || 'Client logo'}
                                            width={56}
                                            height={56}
                                            className="object-contain w-full h-full"
                                        />
                                    ) : (
                                        <Building2 className="w-7 h-7 text-primary-600" />
                                    )}
                                </div>

                                {editingIndex === index ? (
                                    <div className="flex-1 flex items-center gap-2">
                                        <input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') confirmEdit(index)
                                                if (e.key === 'Escape') setEditingIndex(null)
                                            }}
                                            className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-primary-900 focus:ring-2 focus:ring-primary-900 outline-none"
                                            placeholder="Client name"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => confirmEdit(index)}
                                            className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setEditingIndex(null)}
                                            className="w-10 h-10 bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-300 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-primary-900 uppercase tracking-wider truncate">
                                                {client.name || 'Untitled'}
                                            </p>
                                            {client.logoUrl && (
                                                <p className="text-[10px] text-secondary-400 mt-0.5 font-medium tracking-wider">
                                                    Logo uploaded
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <label className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) handleUpload(client.id, file)
                                                        e.target.value = ''
                                                    }}
                                                    disabled={isUploading !== null}
                                                />
                                                {isUploading === client.id ? (
                                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Upload className="w-4 h-4" />
                                                )}
                                            </label>
                                            <button
                                                onClick={() => startEdit(index)}
                                                className="w-10 h-10 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center hover:bg-primary-100 hover:text-primary-600 transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => removeClient(client.id)}
                                                className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {clients.length === 0 && (
                    <div className="text-center py-16 text-secondary-400">
                        <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm font-bold uppercase tracking-widest">No clients added yet</p>
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={onSave}
                    className="px-8 py-4 bg-primary-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-800 transition-all shadow-xl hover:shadow-primary-900/20"
                >
                    Save Clients
                </button>
            </div>
        </motion.div>
    )
}
