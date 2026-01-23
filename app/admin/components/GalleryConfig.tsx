'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react'

interface GalleryConfigProps {
    config: any
    onChange: (next: any) => void
}

export const GalleryConfig = ({ config, onChange }: GalleryConfigProps) => {
    const items = config.gallery || []

    const updateItem = (index: number, key: string, value: any) => {
        const next = { ...config }
        next.gallery = [...items]
        next.gallery[index] = { ...next.gallery[index], [key]: value }
        onChange(next)
    }

    const addItem = () => onChange({ ...config, gallery: [...items, { id: Date.now().toString(), imageUrl: '', caption: '' }] })
    const removeItem = (index: number) => onChange({ ...config, gallery: items.filter((_: any, i: number) => i !== index) })

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Gallery</h2>
                <p className="text-gray-600 mt-1">Manage gallery images and captions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((g: any, i: number) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                        <div className="aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden group">
                            {g.imageUrl ? (
                                <img src={g.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="w-12 h-12 text-gray-300" />
                            )}
                            <button onClick={() => removeItem(i)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <input value={g.imageUrl || ''} onChange={(e) => updateItem(i, 'imageUrl', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" placeholder="Image URL" />
                            <input value={g.caption || ''} onChange={(e) => updateItem(i, 'caption', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" placeholder="Caption" />
                        </div>
                    </div>
                ))}
                <button onClick={addItem} className="aspect-video border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-500 transition-all">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="font-bold text-sm">Add New Image</span>
                </button>
            </div>
        </motion.div>
    )
}
