'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface MapConfigProps {
    config: any
    onChange: (next: any) => void
}

export const MapConfig = ({ config, onChange }: MapConfigProps) => {
    const map = config.map || { embedUrl: '', lat: undefined, lng: undefined, zoom: 14 }
    const update = (key: string, value: any) => onChange({ ...config, map: { ...map, [key]: value } })

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Map Settings</h2>
                <p className="text-gray-600 mt-1">Configure your location on the map</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
                    <input value={map.embedUrl || ''} onChange={(e) => update('embedUrl', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="https://www.google.com/maps/embed?..." />
                    <p className="text-xs text-gray-500 mt-1">Get this from Google Maps "Share" -&gt; "Embed a map"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                        <input type="number" step="any" value={map.lat ?? ''} onChange={(e) => update('lat', parseFloat(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                        <input type="number" step="any" value={map.lng ?? ''} onChange={(e) => update('lng', parseFloat(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zoom Level</label>
                        <input type="number" value={map.zoom ?? 14} onChange={(e) => update('zoom', parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
