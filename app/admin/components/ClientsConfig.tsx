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
    Check
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ClientsConfigProps {
    config: any
    onChange: (next: any) => void
    onSave?: () => Promise<void>
}

export const ClientsConfig = ({ config, onChange, onSave }: ClientsConfigProps) => {
    const clients: string[] = config.clients || []
    const [editingIndex, setEditingIndex] = React.useState<number | null>(null)
    const [editValue, setEditValue] = React.useState('')

    const addClient = () => {
        onChange((prev: any) => ({
            ...prev,
            clients: [...(prev.clients || []), '']
        }))
        setEditingIndex(clients.length)
        setEditValue('')
    }

    const startEdit = (index: number) => {
        setEditingIndex(index)
        setEditValue(clients[index] || '')
    }

    const confirmEdit = (index: number) => {
        const trimmed = editValue.trim()
        if (!trimmed) {
            toast.error('Client name cannot be empty')
            return
        }
        onChange((prev: any) => {
            const updated = [...(prev.clients || [])]
            updated[index] = trimmed
            return { ...prev, clients: updated }
        })
        setEditingIndex(null)
        setEditValue('')
    }

    const removeClient = (index: number) => {
        onChange((prev: any) => ({
            ...prev,
            clients: (prev.clients || []).filter((_: any, i: number) => i !== index)
        }))
        toast.success('Client removed')
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
                    <p className="text-secondary-500 font-medium tracking-widest text-[10px] uppercase">Manage your featured client list</p>
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
                    {clients.map((name, index) => (
                        <motion.div
                            key={`${index}-${name}`}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:border-primary-900/10 transition-all"
                        >
                            <div className="flex items-center gap-4 p-5">
                                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Building2 className="w-6 h-6 text-primary-600" />
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
                                        <span className="flex-1 text-sm font-bold text-primary-900 uppercase tracking-wider">
                                            {name}
                                        </span>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEdit(index)}
                                                className="w-10 h-10 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center hover:bg-primary-100 hover:text-primary-600 transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => removeClient(index)}
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
