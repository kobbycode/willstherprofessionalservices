'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    MapPin,
    Compass,
    Globe,
    Navigation2,
    Maximize2,
    Target,
    Zap,
    ShieldCheck,
    ExternalLink,
    Map as MapIcon,
    Crosshair
} from 'lucide-react'

interface MapConfigProps {
    config: any
    onChange: (next: any) => void
}

export const MapConfig = ({ config, onChange }: MapConfigProps) => {
    const map = config.map || { embedUrl: '', lat: undefined, lng: undefined, zoom: 14 }
    const update = (key: string, value: any) => onChange({ ...config, map: { ...map, [key]: value } })

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight uppercase">Geospatial Intelligence</h2>
                    <p className="text-secondary-500 font-medium tracking-widest text-[10px] uppercase">Registry management for global HQ coordinates & reach protocols</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-premium">
                    <div className="w-10 h-10 bg-primary-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/20">
                        <Globe className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Global Sector</p>
                        <p className="text-xs font-black text-primary-900 mt-1 uppercase">HQ - Operational Base</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                {/* Coordinate Vectors */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center gap-3 bg-gray-50/20">
                            <Compass className="w-5 h-5 text-primary-900" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary-900">Vector Intelligence</h3>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Global Embed Protocol (URL)</label>
                                <div className="relative group/input">
                                    <Navigation2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                    <input
                                        value={map.embedUrl || ''}
                                        onChange={(e) => update('embedUrl', e.target.value)}
                                        className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-[12px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                        placeholder="https://www.google.com/maps/embed?..."
                                    />
                                </div>
                                <p className="px-2 text-[9px] font-bold text-secondary-300 uppercase tracking-tight">Acquire this token via Google Maps "Share" → "Embed a map"</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Latitude [X]</label>
                                    <div className="relative group/input">
                                        <Crosshair className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                        <input
                                            type="number"
                                            step="any"
                                            value={map.lat ?? ''}
                                            onChange={(e) => update('lat', parseFloat(e.target.value))}
                                            className="w-full pl-14 pr-4 py-5 bg-gray-50 border-none rounded-2xl text-[12px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Longitude [Y]</label>
                                    <div className="relative group/input">
                                        <Crosshair className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                        <input
                                            type="number"
                                            step="any"
                                            value={map.lng ?? ''}
                                            onChange={(e) => update('lng', parseFloat(e.target.value))}
                                            className="w-full pl-14 pr-4 py-5 bg-gray-50 border-none rounded-2xl text-[12px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Magnitude (Zoom Level)</label>
                                <div className="relative group/input">
                                    <Maximize2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300 group-focus-within/input:text-primary-900 transition-colors" />
                                    <input
                                        type="number"
                                        value={map.zoom ?? 14}
                                        onChange={(e) => update('zoom', parseInt(e.target.value))}
                                        className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-2xl text-[12px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-primary-900/40">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-all duration-[2s]" />
                        <div className="relative z-10 flex items-start gap-6">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-accent-500">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-black uppercase tracking-widest">Projection Protocol</h4>
                                <p className="text-[10px] font-medium leading-relaxed opacity-60 uppercase tracking-tight max-w-xs">Global coordinates are automatically projected through our neural GIS interface for high-frequency location clarity.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projection Preview */}
                <div className="xl:col-span-3 space-y-8">
                    <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden sticky top-8">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
                            <div className="flex items-center gap-3">
                                <MapIcon className="w-5 h-5 text-primary-900" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary-900">Reach Visualization</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span className="text-[10px] font-black text-secondary-300 uppercase tracking-widest">Encrypted Overlay</span>
                            </div>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="relative group/map aspect-video rounded-[2.5rem] overflow-hidden border border-gray-100 bg-gray-50 shadow-inner">
                                {map.embedUrl ? (
                                    <iframe
                                        src={map.embedUrl}
                                        className="w-full h-full border-none grayscale contrast-[1.2] invert-[0.05] group-hover/map:grayscale-0 transition-all duration-1000"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary-200">
                                        <MapPin className="w-16 h-16 mb-6 opacity-20" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Projection Data Offline</p>
                                    </div>
                                )}

                                <div className="absolute top-8 right-8 z-20">
                                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[9px] font-black text-primary-900 uppercase">System Active</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Target className="w-4 h-4 text-primary-900" />
                                            <span className="text-[9px] font-black text-primary-900 uppercase">Lock Status: Valid</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner space-y-4">
                                <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest flex items-center justify-between">
                                    Security Certificate Path
                                    <ExternalLink className="w-3 h-3" />
                                </p>
                                <div className="text-[11px] font-mono text-secondary-300 break-all leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                                    {map.embedUrl || 'Waiting for geospatial manifest initialization...'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
