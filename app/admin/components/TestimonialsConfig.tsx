'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Star } from 'lucide-react'

interface TestimonialsConfigProps {
    config: any
    onChange: (next: any) => void
}

export const TestimonialsConfig = ({ config, onChange }: TestimonialsConfigProps) => {
    const items = config.testimonials || []

    const updateItem = (index: number, key: string, value: any) => {
        const next = { ...config }
        next.testimonials = [...items]
        next.testimonials[index] = { ...next.testimonials[index], [key]: value }
        onChange(next)
    }

    const addItem = () => onChange({ ...config, testimonials: [...items, { id: Date.now().toString(), name: '', role: '', content: '', rating: 5, avatarUrl: '' }] })
    const removeItem = (index: number) => onChange({ ...config, testimonials: items.filter((_: any, i: number) => i !== index) })

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
                <p className="text-gray-600 mt-1">Manage customer reviews and feedback</p>
            </div>

            <div className="space-y-4">
                {items.map((t: any, i: number) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input value={t.name} onChange={(e) => updateItem(i, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Customer name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role/Company</label>
                                <input value={t.role || ''} onChange={(e) => updateItem(i, 'role', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Homeowner" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button key={star} onClick={() => updateItem(i, 'rating', star)}>
                                            <Star className={`w-5 h-5 ${star <= (t.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Content</label>
                            <textarea value={t.content || ''} onChange={(e) => updateItem(i, 'content', e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="What the customer said..." />
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                            <div className="text-xs text-gray-400">ID: {t.id}</div>
                            <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center space-x-1">
                                <Trash2 className="w-4 h-4" />
                                <span>Remove</span>
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={addItem} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 flex items-center justify-center space-x-2 transition-colors">
                    <Plus className="w-5 h-5" />
                    <span className="font-bold">Add Testimonial</span>
                </button>
            </div>
        </motion.div>
    )
}
