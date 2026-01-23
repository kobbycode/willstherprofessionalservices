'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { uploadImage } from '@/lib/storage'

interface AboutConfigProps {
    config: any
    onChange: (next: any) => void
}

export const AboutConfig = ({ config, onChange }: AboutConfigProps) => {
    const about = config.about || { title: '', content: '', imageUrl: '' }
    const [isUploading, setIsUploading] = useState(false)

    const update = (key: string, value: string) => onChange({ ...config, about: { ...about, [key]: value } })

    const handleImageUpload = async (file: File) => {
        if (!file) return
        setIsUploading(true)
        try {
            const imageUrl = await uploadImage(file, `about/about-${Date.now()}`)
            update('imageUrl', imageUrl)
            toast.success('Image uploaded')
        } catch (error) {
            toast.error('Upload failed')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">About Section</h2>
                <p className="text-gray-600 mt-1">Manage the company bio and history</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                            <input value={about.title || ''} onChange={(e) => update('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. About Our Company" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                            <textarea value={about.content || ''} onChange={(e) => update('content', e.target.value)} rows={10} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter company description..." />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                        <div className="relative group rounded-xl overflow-hidden border-2 border-dashed border-gray-200 aspect-video bg-gray-50 flex items-center justify-center">
                            {about.imageUrl ? (
                                <img src={about.imageUrl} alt="About" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-400 text-center">
                                    <p>No image selected</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label className="cursor-pointer bg-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                                    {isUploading ? 'Uploading...' : 'Change Image'}
                                    <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} disabled={isUploading} />
                                </label>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Recommended size: 1200x800px. URL: <span className="break-all">{about.imageUrl || 'None'}</span></p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
