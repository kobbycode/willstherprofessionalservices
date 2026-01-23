'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'

interface NavigationConfigProps {
    config: any
    onChange: (next: any) => void
}

export const NavigationConfig = ({ config, onChange }: NavigationConfigProps) => {
    const navigation = config.navigation || {
        main: [
            { name: 'Services', href: '/services' },
            { name: 'About', href: '/about' },
            { name: 'Contact', href: '/contact' },
            { name: 'Gallery', href: '/gallery' },
            { name: 'Blog', href: '/blog' }
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy-policy' },
            { name: 'Terms of Service', href: '/terms-of-service' }
        ]
    }

    const update = (key: string, value: any) => onChange({ ...config, navigation: { ...navigation, [key]: value } })

    const updateMainLink = (index: number, field: string, value: string) => {
        const newMain = [...navigation.main]
        newMain[index] = { ...newMain[index], [field]: value }
        update('main', newMain)
    }

    const updateLegalLink = (index: number, field: string, value: string) => {
        const newLegal = [...navigation.legal]
        newLegal[index] = { ...newLegal[index], [field]: value }
        update('legal', newLegal)
    }

    const addMainLink = () => update('main', [...navigation.main, { name: 'New Link', href: '#' }])
    const addLegalLink = () => update('legal', [...navigation.legal, { name: 'New Legal Link', href: '#' }])
    const removeMainLink = (index: number) => update('main', navigation.main.filter((_: any, i: number) => i !== index))
    const removeLegalLink = (index: number) => update('legal', navigation.legal.filter((_: any, i: number) => i !== index))

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Navigation</h2>
                <p className="text-gray-600 mt-1">Manage website navigation links</p>
            </div>

            <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Navigation</h3>
                    <div className="space-y-3">
                        {navigation.main.map((link: any, index: number) => (
                            <div key={index} className="flex items-center space-x-3">
                                <input value={link.name} onChange={(e) => updateMainLink(index, 'name', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Link name" />
                                <input value={link.href} onChange={(e) => updateMainLink(index, 'href', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Link URL" />
                                <button onClick={() => removeMainLink(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                        <button onClick={addMainLink} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors">
                            <Plus className="w-4 h-4" />
                            <span>Add Link</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Navigation</h3>
                    <div className="space-y-3">
                        {navigation.legal.map((link: any, index: number) => (
                            <div key={index} className="flex items-center space-x-3">
                                <input value={link.name} onChange={(e) => updateLegalLink(index, 'name', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Link name" />
                                <input value={link.href} onChange={(e) => updateLegalLink(index, 'href', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Link URL" />
                                <button onClick={() => removeLegalLink(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                        <button onClick={addLegalLink} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors">
                            <Plus className="w-4 h-4" />
                            <span>Add Legal Link</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
