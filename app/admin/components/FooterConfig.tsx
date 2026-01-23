'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadImage } from '@/lib/storage'

interface FooterConfigProps {
    config: any
    onChange: (next: any) => void
}

export const FooterConfig = ({ config, onChange }: FooterConfigProps) => {
    const footer = config.footer || { copyright: '', socialLinks: [] }
    const [isUploading, setIsUploading] = useState(false)
    const [newSocialLink, setNewSocialLink] = useState({ name: '', url: '', icon: '' })
    const [isAddSocialLinkModalOpen, setIsAddSocialLinkModalOpen] = useState(false)
    const [socialLinkToDelete, setSocialLinkToDelete] = useState<number | null>(null)

    const update = (key: string, value: any) => onChange({ ...config, footer: { ...footer, [key]: value } })

    const addSocialLink = () => {
        update('socialLinks', [...footer.socialLinks, newSocialLink])
        setNewSocialLink({ name: '', url: '', icon: '' })
        setIsAddSocialLinkModalOpen(false)
    }

    const removeSocialLink = (index: number) => {
        update('socialLinks', footer.socialLinks.filter((_: any, i: number) => i !== index))
    }

    const handleIconUpload = async (file: File) => {
        if (!file) return
        setIsUploading(true)
        try {
            const imageUrl = await uploadImage(file, `social-links/${Date.now()}`)
            setNewSocialLink({ ...newSocialLink, icon: imageUrl })
            toast.success('Icon uploaded')
        } catch (error) {
            toast.error('Upload failed')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Footer Settings</h2>
                <p className="text-gray-600 mt-1">Manage footer content and social links</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
                    <input value={footer.copyright || ''} onChange={(e) => update('copyright', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. © 2024 Willsther" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Social Links</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {footer.socialLinks.map((link: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-xl bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <img src={link.icon} alt="" className="w-8 h-8 rounded-full border bg-white" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/32'} />
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">{link.name}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{link.url}</div>
                                    </div>
                                </div>
                                <button onClick={() => setSocialLinkToDelete(index)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setIsAddSocialLinkModalOpen(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>Add Social Link</span>
                    </button>
                </div>
            </div>

            {isAddSocialLinkModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Add Social Link</h3>
                            <button onClick={() => setIsAddSocialLinkModalOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <input value={newSocialLink.name} onChange={e => setNewSocialLink({ ...newSocialLink, name: e.target.value })} placeholder="Name (e.g. Facebook)" className="w-full px-3 py-2 border rounded-lg" />
                            <input value={newSocialLink.url} onChange={e => setNewSocialLink({ ...newSocialLink, url: e.target.value })} placeholder="URL" className="w-full px-3 py-2 border rounded-lg" />
                            <div className="border-2 border-dashed rounded-lg p-4 text-center">
                                {newSocialLink.icon ? <img src={newSocialLink.icon} className="h-12 mx-auto mb-2" /> : null}
                                <label className="cursor-pointer text-blue-600 hover:underline">
                                    {isUploading ? 'Uploading...' : 'Upload Icon'}
                                    <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleIconUpload(e.target.files[0])} />
                                </label>
                            </div>
                        </div>
                        <div className="mt-6 flex space-x-3">
                            <button onClick={() => setIsAddSocialLinkModalOpen(false)} className="flex-1 py-2 border rounded-lg">Cancel</button>
                            <button onClick={addSocialLink} disabled={!newSocialLink.name} className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Add</button>
                        </div>
                    </div>
                </div>
            )}

            {socialLinkToDelete !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8" /></div>
                        <h3 className="text-lg font-bold mb-2">Delete Social Link?</h3>
                        <p className="text-gray-500 mb-6">Are you sure you want to remove this social link?</p>
                        <div className="flex space-x-3">
                            <button onClick={() => setSocialLinkToDelete(null)} className="flex-1 py-2 border rounded-lg">Cancel</button>
                            <button onClick={() => { removeSocialLink(socialLinkToDelete); setSocialLinkToDelete(null); }} className="flex-1 py-2 bg-red-600 text-white rounded-lg">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
