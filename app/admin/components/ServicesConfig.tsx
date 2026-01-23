'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench,
  Plus,
  Trash2,
  X,
  AlertCircle,
  LayoutGrid,
  TrendingUp,
  ShieldCheck,
  Zap,
  Camera,
  Layers,
  Settings,
  MoreVertical,
  CheckCircle2,
  ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadImage } from '@/lib/storage'

const ServicesConfig = ({ config, onChange }: any) => {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false)
  const [newServiceData, setNewServiceData] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: ''
  })
  const [uploadingServices, setUploadingServices] = useState<Record<string, boolean>>({})
  const [isUploadingNewServiceImage, setIsUploadingNewServiceImage] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    serviceId: '',
    serviceName: ''
  })

  // Load services from API
  useEffect(() => {
    const loadServices = async () => {
      let timeoutId: NodeJS.Timeout | null = null;
      setError(null)

      const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('Request timeout after 30 seconds'))
        }, 30000)
      })

      try {
        const fetchPromise = fetch('/api/services', { cache: 'no-store' })
        const response = await Promise.race([fetchPromise, timeout]) as Response

        if (!response.ok) {
          const errorText = await response.text()
          let errorData;
          try {
            errorData = JSON.parse(errorText)
          } catch (parseError) {
            throw new Error(`Failed to fetch services: ${response.status} ${errorText}`)
          }

          if (errorData.error === 'Firebase Permission Denied') {
            setError('Firebase Permission Error')
            toast.error('Firebase Permission Denied')
          } else {
            setError(`Failed to fetch services: ${errorData.error || response.status}`)
            toast.error(`Failed to fetch: ${errorData.error}`)
          }
          throw new Error(`Failed to fetch services: ${errorData.error || response.status}`)
        }

        const text = await response.text()
        let data = JSON.parse(text)
        setServices(data.services || [])
      } catch (error) {
        console.error('Error loading services:', error)
        setError((error as Error).message)
      } finally {
        setLoading(false)
        if (timeoutId) clearTimeout(timeoutId)
      }
    }

    loadServices()
  }, [])

  const updateService = async (id: string, key: string, value: string) => {
    try {
      const serviceToUpdate = services.find(s => s.id === id)
      if (!serviceToUpdate) return
      const updatedService = { ...serviceToUpdate, [key]: value }

      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedService),
      })

      if (!response.ok) throw new Error('Failed to update service')
      setServices(prev => prev.map(s => s.id === id ? updatedService : s))
      toast.success('Service parameter saved')
    } catch (error) {
      toast.error('Sync failed')
    }
  }

  const createNewService = async () => {
    if (!newServiceData.title.trim()) return
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newServiceData),
      })

      if (!response.ok) throw new Error('Failed to create service')
      const createdService = await response.json()
      setServices(prev => [...prev, createdService])
      setIsAddServiceModalOpen(false)
      setNewServiceData({ title: '', description: '', category: '', imageUrl: '' })
      toast.success('New service Service established')
    } catch (error) {
      toast.error('Details injection failed')
    }
  }

  const handleServiceImageUpload = async (serviceId: string, file: File) => {
    if (!file) return
    setUploadingServices(prev => ({ ...prev, [serviceId]: true }))
    try {
      const imageUrl = await uploadImage(file, `services/service-${serviceId}-${Date.now()}`)
      await updateService(serviceId, 'imageUrl', imageUrl)
      toast.success('Image saved')
    } catch (error) {
      toast.error('Upload intercept failure')
    } finally {
      setUploadingServices(prev => ({ ...prev, [serviceId]: false }))
    }
  }

  const handleNewServiceImageUpload = async (file: File) => {
    if (!file) return
    setIsUploadingNewServiceImage(true)
    try {
      const imageUrl = await uploadImage(file, `services/new-service-${Date.now()}`)
      setNewServiceData(prev => ({ ...prev, imageUrl }))
      toast.success('Asset cached successfully')
    } catch (error) {
      toast.error('Asset upload failure')
    } finally {
      setIsUploadingNewServiceImage(false)
    }
  }

  const confirmDeleteService = async () => {
    const { serviceId } = deleteDialog
    if (!serviceId) return
    try {
      const response = await fetch(`/api/services/${serviceId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete service')
      setServices(prev => prev.filter(s => s.id !== serviceId))
      setDeleteDialog({ isOpen: false, serviceId: '', serviceName: '' })
      toast.error('Service deleted')
    } catch (error) {
      toast.error('deleting sequence failed')
    }
  }

  const cancelDeleteService = () => {
    setDeleteDialog({ isOpen: false, serviceId: '', serviceName: '' })
  }

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse pb-20">
        <div className="flex justify-between items-end h-20 bg-gray-50 rounded-[2rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-50 rounded-[2.5rem]" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-[400px] bg-gray-50 rounded-[3rem]" />)}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      {/* Header & Primary Action */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-primary-900 tracking-tight uppercase">Services Dashboard</h2>
          <p className="text-secondary-500 font-medium tracking-widest text-[10px] uppercase">Service Manager & performance metrics</p>
        </div>
        <button
          onClick={() => setIsAddServiceModalOpen(true)}
          className="group relative px-8 py-5 bg-primary-900 text-white rounded-[2rem] shadow-2xl shadow-primary-900/20 hover:shadow-primary-900/40 transition-all active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-4">
            <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-accent-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Engineer New Service</span>
          </div>
        </button>
      </div>

      {/* Management Row (Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-premium flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
            <LayoutGrid className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Global Coverage</p>
            <p className="text-3xl font-black text-primary-900 mt-1">{services.length}</p>
            <p className="text-[9px] font-bold text-green-600 uppercase mt-1">Operational Channels</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-premium flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Market Presence</p>
            <p className="text-3xl font-black text-primary-900 mt-1">{new Set(services.map(s => s.category)).size}</p>
            <p className="text-[9px] font-bold text-amber-600 uppercase mt-1">Core Specializations</p>
          </div>
        </div>

        <div className="bg-primary-900 p-8 rounded-[2.5rem] shadow-2xl shadow-primary-900/20 flex items-center gap-6 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-all duration-700" />
          <div className="relative z-10 w-16 h-16 bg-white/10 text-accent-500 rounded-3xl flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">Security Status</p>
            <p className="text-xl font-black text-white mt-1 uppercase tracking-tighter transition-all group-hover:tracking-normal">Identity Verified</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[9px] font-bold text-green-400 uppercase">Master Sync Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <AnimatePresence mode='popLayout'>
          {services.map((s: any) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[3rem] border border-gray-100 shadow-premium overflow-hidden group hover:border-primary-900/10 transition-all"
            >
              <div className="p-10 space-y-10">
                {/* ID & Visual Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[9px] font-black text-secondary-300 uppercase tracking-widest">Service ID</p>
                      <p className="text-xs font-black text-primary-900 uppercase">{s.id.substring(0, 8)}</p>
                    </div>
                    <div className="h-6 w-px bg-gray-100" />
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-[10px] font-black pointer-events-none text-secondary-300 uppercase tracking-widest">Active System</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setDeleteDialog({ isOpen: true, serviceId: s.id, serviceName: s.title })}
                    className="p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-95"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Identity Fields */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Market Name</label>
                      <input
                        value={s.title || ''}
                        onChange={(e) => updateService(s.id, 'title', e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50/50 border-none rounded-2xl text-[12px] font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                        placeholder="Service Title"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Setting Category</label>
                      <input
                        value={s.category || ''}
                        onChange={(e) => updateService(s.id, 'category', e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50/50 border-none rounded-2xl text-[12px] font-bold text-secondary-400 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                        placeholder="Category"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Operational Details (Description)</label>
                    <textarea
                      value={s.description || ''}
                      onChange={(e) => updateService(s.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-8 py-5 bg-gray-50/50 border-none rounded-3xl text-[12px] font-medium text-secondary-600 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none resize-none leading-relaxed"
                      placeholder="Detailed Management report..."
                    />
                  </div>
                </div>

                {/* Image Management */}
                <div className="space-y-6 pt-6 border-t border-gray-50">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-[10px] font-black text-secondary-300 uppercase tracking-[0.2em]">Visual Identification Asset</label>
                    <Zap className="w-4 h-4 text-accent-500 animate-pulse" />
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative group/camera w-40 h-40 shrink-0">
                      <label className="cursor-pointer block">
                        <div className="absolute inset-0 bg-primary-900 rounded-[2rem] flex flex-col items-center justify-center gap-3 opacity-0 group-hover/camera:opacity-100 transition-all z-20">
                          <Camera className="w-8 h-8 text-white" />
                          <span className="text-[8px] font-black text-white uppercase tracking-widest text-center px-4">Update<br />Visual List</span>
                        </div>
                        <div className="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex items-center justify-center overflow-hidden relative shadow-inner">
                          {s.imageUrl ? (
                            <img src={s.imageUrl} className="w-full h-full object-cover grayscale group-hover/camera:grayscale-0 transition-all duration-700" alt="" />
                          ) : (
                            <Layers className="w-10 h-10 text-gray-200" />
                          )}
                          {uploadingServices[s.id] && (
                            <div className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm flex items-center justify-center z-30">
                              <div className="w-8 h-8 border-2 border-white/20 border-t-accent-500 rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleServiceImageUpload(s.id, e.target.files[0])} disabled={uploadingServices[s.id]} />
                      </label>
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner">
                        <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-3">Asset Settings Path</p>
                        <div className="flex items-center gap-3">
                          <input
                            value={s.imageUrl || ''}
                            onChange={(e) => updateService(s.id, 'imageUrl', e.target.value)}
                            className="flex-1 bg-transparent border-none text-[11px] font-mono text-secondary-400 focus:ring-0 truncate"
                            placeholder="https://..."
                          />
                          <ExternalLink className="w-4 h-4 text-secondary-200" />
                        </div>
                      </div>
                      <button
                        onClick={() => updateService(s.id, 'imageUrl', '')}
                        className="text-[10px] font-black text-rose-500 uppercase tracking-widest px-4 py-2 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        delet Asset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {services.length === 0 && (
          <div className="col-span-full py-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[4rem] text-center flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-10 border border-gray-100">
              <Wrench className="w-10 h-10 text-primary-900" />
            </div>
            <h3 className="text-2xl font-black text-primary-900 uppercase tracking-tight">Service Mesh Empty</h3>
            <p className="text-secondary-400 font-medium max-w-[320px] mt-4 mb-10 leading-relaxed uppercase text-[10px] tracking-widest">Global operations are currently dormant. Initiate service mesh by engineering a new Service.</p>
            <button
              onClick={() => setIsAddServiceModalOpen(true)}
              className="px-8 py-5 bg-primary-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-900/40 active:scale-95 transition-all"
            >
              Initiate Engineering Sequence
            </button>
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      <AnimatePresence>
        {isAddServiceModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-primary-900 uppercase tracking-tight">Engineered Injection</h3>
                  <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-[0.3em] mt-1">Define new service Manager Service</p>
                </div>
                <button onClick={() => setIsAddServiceModalOpen(false)} className="p-4 hover:bg-gray-100 rounded-[2rem] transition-all active:scale-95">
                  <X className="w-8 h-8 text-secondary-300" />
                </button>
              </div>

              <div className="p-10 overflow-y-auto space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Left Side: Fields */}
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Project Specification Name</label>
                      <input
                        value={newServiceData.title}
                        onChange={(e) => setNewServiceData({ ...newServiceData, title: e.target.value })}
                        placeholder="e.g. Industrial Sanitation Setting"
                        className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl text-sm font-black text-primary-900 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Security Domain (Category)</label>
                      <input
                        value={newServiceData.category}
                        onChange={(e) => setNewServiceData({ ...newServiceData, category: e.target.value })}
                        placeholder="e.g. Hygiene Excellence"
                        className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl text-sm font-bold text-secondary-400 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Operational Instructions</label>
                      <textarea
                        value={newServiceData.description}
                        onChange={(e) => setNewServiceData({ ...newServiceData, description: e.target.value })}
                        placeholder="Describe the service complexity..."
                        rows={6}
                        className="w-full px-8 py-5 bg-gray-50 border-none rounded-[2.5rem] text-sm font-medium text-secondary-600 focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Right Side: Media */}
                  <div className="space-y-8">
                    <div className="bg-primary-900 rounded-[3rem] p-8 text-white space-y-6 shadow-xl shadow-primary-900/30">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl text-accent-500"><Camera className="w-6 h-6" /></div>
                        <h4 className="text-sm font-black uppercase tracking-widest">Visual Settings</h4>
                      </div>

                      <div className="h-64 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center overflow-hidden relative group">
                        {newServiceData.imageUrl ? (
                          <img src={newServiceData.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="" />
                        ) : (
                          <div className="text-center px-6">
                            <Layers className="w-12 h-12 text-white/10 mx-auto mb-4" />
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Asset Undefined</p>
                          </div>
                        )}

                        {isUploadingNewServiceImage && (
                          <div className="absolute inset-0 bg-primary-900/80 backdrop-blur-md flex flex-col items-center justify-center z-30">
                            <div className="w-12 h-12 border-4 border-white/10 border-t-accent-500 rounded-full animate-spin mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Synchronizing...</p>
                          </div>
                        )}

                        <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-all bg-primary-900/60 flex items-center justify-center">
                          <span className="px-6 py-3 bg-white text-primary-900 font-black text-[9px] uppercase tracking-widest rounded-xl shadow-2xl">Upload Visual Identifier</span>
                          <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleNewServiceImageUpload(e.target.files[0])} disabled={isUploadingNewServiceImage} />
                        </label>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest px-2">Identifier Source URL</label>
                        <input
                          value={newServiceData.imageUrl}
                          onChange={(e) => setNewServiceData({ ...newServiceData, imageUrl: e.target.value })}
                          className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-mono text-accent-500 focus:ring-1 focus:ring-accent-500 outline-none"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-8">
                      <div className="flex items-start gap-4">
                        <ShieldCheck className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                        <div className="space-y-2">
                          <h5 className="text-sm font-black text-primary-900 uppercase">Manager Guard</h5>
                          <p className="text-[10px] font-medium text-secondary-500 leading-relaxed uppercase">Services are automatically encrypted and saved across the global edge network upon authorization.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 border-t border-gray-50 bg-gray-50/50 flex gap-6">
                <button onClick={() => setIsAddServiceModalOpen(false)} className="px-10 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] hover:text-primary-900 transition-all">Discard Detailso</button>
                <button
                  onClick={createNewService}
                  disabled={!newServiceData.title.trim() || isUploadingNewServiceImage}
                  className="flex-1 py-5 bg-primary-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary-900/30 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-4"
                >
                  <Plus className="w-5 h-5" />
                  <span>Authorize Engineering Sequence</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteDialog.isOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-primary-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-12 text-center space-y-8">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-2xl animate-pulse" />
                  <div className="relative w-24 h-24 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center shadow-inner border border-rose-100">
                    <Trash2 className="w-10 h-10" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-primary-900 tracking-tight uppercase">Delete Setting</h3>
                  <p className="text-secondary-500 font-medium leading-relaxed uppercase text-[10px] tracking-widest px-4">
                    Confirm deleting of <span className="text-primary-900 font-black">{deleteDialog.serviceName}</span> across the global mesh network. This operation is absolute.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={cancelDeleteService}
                    className="flex-1 py-5 text-[10px] font-black text-secondary-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                  >
                    Abort
                  </button>
                  <button
                    onClick={confirmDeleteService}
                    className="flex-1 py-5 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/30 active:scale-95 transition-all"
                  >
                    Execute Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ServicesConfig
