'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface WebsiteSettingsProps {
    config: any
    onChange: (next: any) => void
}

export const WebsiteSettings = ({ config, onChange }: WebsiteSettingsProps) => {
    const [settings, setSettings] = useState({
        siteName: config.siteName || 'Willsther Professional Services',
        siteDescription: config.siteDescription || 'Professional cleaning and maintenance services',
        contactEmail: config.contactEmail || 'info@willsther.com',
        contactPhone: config.contactPhone || '+233 594 850 005',
        maintenanceMode: !!config.maintenanceMode
    })

    useEffect(() => {
        setSettings({
            siteName: config.siteName || 'Willsther Professional Services',
            siteDescription: config.siteDescription || 'Professional cleaning and maintenance services',
            contactEmail: config.contactEmail || 'info@willsther.com',
            contactPhone: config.contactPhone || '+233 594 850 005',
            maintenanceMode: !!config.maintenanceMode
        })
    }, [config])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onChange({ ...config, ...settings })
        toast.success('Website settings saved')
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Website Settings</h2>
                <p className="text-gray-600 mt-1">Configure global website parameters</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                        <input type="text" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                        <textarea value={settings.siteDescription} onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                            <input type="email" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                            <input type="text" value={settings.contactPhone} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input type="checkbox" id="maintenanceMode" checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">Enable Maintenance Mode</label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50" onClick={() => setSettings({
                            siteName: config.siteName || 'Willsther Professional Services',
                            siteDescription: config.siteDescription || 'Professional cleaning and maintenance services',
                            contactEmail: config.contactEmail || 'info@willsther.com',
                            contactPhone: config.contactPhone || '+233 594 850 005',
                            maintenanceMode: !!config.maintenanceMode
                        })}>Reset</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Changes</button>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}
