'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  Edit3,
  ExternalLink,
  Layers,
  Sparkles,
  Camera,
  MousePointer2,
  ArrowRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadImage } from '@/lib/storage'

const HeroConfig = ({ config, onChange }: any) => {
  const heroSlides = config.heroSlides || []
  const [isAddSlideModalOpen, setIsAddSlideModalOpen] = useState(false)
  const [newSlideData, setNewSlideData] = useState({
    imageUrl: '',
    title: '',
    subtitle: '',
    ctaLabel: '',
    ctaHref: ''
  })
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null)
  const [isUploadingNewSlideImage, setIsUploadingNewSlideImage] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    slideId: '',
    slideTitle: ''
  })

  const updateSlide = (id: string, key: string, value: string) => {
    const next = { ...config }
    next.heroSlides = [...heroSlides]
    const index = next.heroSlides.findIndex((s: any) => s.id === id)
    if (index >= 0) {
      next.heroSlides[index] = { ...next.heroSlides[index], [key]: value }
      onChange(next)
    }
  }

  const addSlide = () => {
    setEditingSlideId(null)
    setNewSlideData({
      imageUrl: '',
      title: '',
      subtitle: '',
      ctaLabel: '',
      ctaHref: ''
    })
    setIsAddSlideModalOpen(true)
  }

  const createNewSlide = () => {
    if (!newSlideData.imageUrl.trim()) {
      toast.error('Image asset required')
      return
    }

    const next = { ...config }
    next.heroSlides = [...heroSlides]
    next.heroSlides.push({
      id: `slide_${Date.now()}`,
      ...newSlideData,
      order: next.heroSlides.length
    })
    onChange(next)
    setIsAddSlideModalOpen(false)
    toast.success('New cinematic slide deployed')
  }

  const editSlide = (slide: any) => {
    setEditingSlideId(slide.id)
    setNewSlideData({
      imageUrl: slide.imageUrl || '',
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      ctaLabel: slide.ctaLabel || '',
      ctaHref: slide.ctaHref || ''
    })
    setIsAddSlideModalOpen(true)
  }

  const saveEditedSlide = () => {
    if (!editingSlideId) return
    if (!newSlideData.imageUrl.trim()) {
      toast.error('Image asset required')
      return
    }

    const next = { ...config }
    next.heroSlides = [...heroSlides]
    const index = next.heroSlides.findIndex((s: any) => s.id === editingSlideId)
    if (index >= 0) {
      next.heroSlides[index] = { ...next.heroSlides[index], ...newSlideData }
      onChange(next)
      setIsAddSlideModalOpen(false)
      setEditingSlideId(null)
      toast.success('Cinematic sequence updated')
    }
  }

  const updateSlideOrder = (id: string, direction: 'up' | 'down') => {
    const next = { ...config }
    next.heroSlides = [...heroSlides]
    const index = next.heroSlides.findIndex((s: any) => s.id === id)
    if (index >= 0) {
      if (direction === 'up' && index > 0) {
        const temp = next.heroSlides[index - 1]
        next.heroSlides[index - 1] = next.heroSlides[index]
        next.heroSlides[index] = temp
      } else if (direction === 'down' && index < next.heroSlides.length - 1) {
        const temp = next.heroSlides[index + 1]
        next.heroSlides[index + 1] = next.heroSlides[index]
        next.heroSlides[index] = temp
      }
      onChange(next)
    }
  }

  const handleSlideImageUpload = async (file: File) => {
    if (!file) return
    setIsUploadingNewSlideImage(true)
    try {
      const imageUrl = await uploadImage(file, `hero/slides/slide-${Date.now()}`)
      setNewSlideData(prev => ({ ...prev, imageUrl }))
      toast.success('Ultra-high-res asset uploaded')
    } catch (error) {
      toast.error('Asset upload failed')
    } finally {
      setIsUploadingNewSlideImage(false)
    }
  }

  const confirmDeleteSlide = () => {
    const { slideId } = deleteDialog
    if (!slideId) return
    const next = { ...config }
    next.heroSlides = heroSlides.filter((s: any) => s.id !== slideId)
    onChange(next)
    setDeleteDialog({ isOpen: false, slideId: '', slideTitle: '' })
    toast.success('Asset purged from sequence')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-primary-900 tracking-tight text-shadow-sm">Hero Experience</h2>
          <p className="text-secondary-600 font-medium mt-1 uppercase tracking-[0.1em] text-[10px]">Orchestrate the first impression of your digital presence</p>
        </div>
        <button
          onClick={addSlide}
          className="group px-6 py-3.5 bg-primary-900 text-white rounded-2xl shadow-xl shadow-primary-900/20 hover:shadow-primary-900/30 active:scale-95 transition-all flex items-center gap-3"
        >
          <div className="p-1 px-2 border border-white/20 rounded-lg group-hover:border-white/40"><Plus className="w-4 h-4" /></div>
          <span className="text-[11px] font-black uppercase tracking-widest">New Cinematic Slide</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8">
        {heroSlides.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-24 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
              <ImageIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-primary-900 mb-2 uppercase tracking-tight">The Stage is Empty</h3>
            <p className="text-secondary-400 font-medium text-sm max-w-xs mx-auto">Begin your brand storytelling by adding your first ultra-high-resolution cinematic slide.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode='popLayout'>
              {heroSlides.map((slide: any, index: number) => (
                <motion.div
                  key={slide.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[300px]"
                >
                  {/* Order Controls - Overlay */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => updateSlideOrder(slide.id, 'up')}
                      disabled={index === 0}
                      className="p-3 bg-white text-primary-900 rounded-2xl shadow-xl border border-gray-100 hover:bg-primary-900 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-primary-900"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateSlideOrder(slide.id, 'down')}
                      disabled={index === heroSlides.length - 1}
                      className="p-3 bg-white text-primary-900 rounded-2xl shadow-xl border border-gray-100 hover:bg-primary-900 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-primary-900"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Left: Preview */}
                  <div className="lg:w-[450px] relative overflow-hidden bg-gray-900">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-900/60 to-transparent z-10" />
                    <img
                      src={slide.imageUrl}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt="Preview"
                    />
                    <div className="absolute left-10 top-1/2 -translate-y-1/2 z-20 space-y-2 max-w-[80%]">
                      <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg inline-flex items-center gap-2 border border-white/20">
                        <Sparkles className="w-3 h-3 text-white" />
                        <span className="text-white text-[9px] font-black uppercase tracking-widest">Preview Mode</span>
                      </div>
                      <h4 className="text-white text-xl font-black leading-tight drop-shadow-lg">{slide.title || 'Untitled Segment'}</h4>
                    </div>
                  </div>

                  {/* Right: Intel */}
                  <div className="flex-1 p-10 flex flex-col justify-between bg-white relative">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest">Slide Identity Segment</p>
                        <h3 className="text-2xl font-black text-primary-900 tracking-tight">{slide.title || 'Cinematic Header'}</h3>
                        <p className="text-secondary-500 font-medium text-sm line-clamp-2 italic">"{slide.subtitle || 'No subtitle established for this segment'}"</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => editSlide(slide)}
                          className="p-3 bg-gray-50 text-primary-900 rounded-2xl hover:bg-primary-900 hover:text-white transition-all shadow-sm"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, slideId: slide.id, slideTitle: slide.title })}
                          className="p-3 bg-gray-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 pt-6 border-t border-gray-50 mt-auto">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-secondary-300 uppercase tracking-widest">Call to Action</span>
                        <div className="flex items-center gap-2 group/cta">
                          <span className="text-xs font-black text-primary-900 group-hover/cta:translate-x-1 transition-transform cursor-pointer">{slide.ctaLabel || 'Discover More'}</span>
                          <ArrowRight className="w-3 h-3 text-secondary-300" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-secondary-300 uppercase tracking-widest">Protocol Path</span>
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-3 h-3 text-secondary-300" />
                          <span className="text-xs font-bold text-secondary-400 lowercase">{slide.ctaHref || '#'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Slide Portal - Modal */}
      <AnimatePresence>
        {isAddSlideModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
            >
              {/* Modal Left: Composition Preview */}
              <div className="lg:w-80 bg-gray-50 border-r border-gray-100 p-10 flex flex-col gap-8 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-black text-primary-900">Composition</h3>
                  <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mt-1">Asset configuration portal</p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="w-10 h-10 bg-primary-900/5 rounded-2xl flex items-center justify-center text-primary-900"><Camera className="w-5 h-5" /></div>
                    <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest leading-none">Primary Visual</p>
                    <div className="relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                      <AnimatePresence mode='wait'>
                        {newSlideData.imageUrl ? (
                          <motion.img
                            key={newSlideData.imageUrl}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            src={newSlideData.imageUrl}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                            <ImageIcon className="w-6 h-6 text-gray-300" />
                            <span className="text-[8px] font-black text-secondary-300 uppercase tracking-[0.2em]">Pending Asset</span>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Right: Intelligence Configuration */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                  <h3 className="text-2xl font-black text-primary-900 tracking-tight">{editingSlideId ? 'Modify Sequence' : 'Assemble Segment'}</h3>
                  <button onClick={() => setIsAddSlideModalOpen(false)} className="p-4 hover:bg-gray-100 rounded-2xl transition-all active:scale-95"><X className="w-6 h-6 text-secondary-400" /></button>
                </div>

                <div className="p-10 flex-1 overflow-y-auto space-y-10 custom-scrollbar">
                  {/* Asset Upload Segment */}
                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest">01. Visual Registry</p>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <label className="group relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-100 rounded-[2rem] hover:border-primary-900/30 hover:bg-gray-50/50 transition-all cursor-pointer overflow-hidden">
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleSlideImageUpload(e.target.files[0])} />
                          {isUploadingNewSlideImage ? (
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-2 border-primary-900/10 border-t-primary-900 rounded-full animate-spin" />
                              <span className="text-[10px] font-black text-primary-900 uppercase tracking-widest">Uploading...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-center gap-2">
                              <Camera className="w-6 h-6 text-secondary-300 group-hover:scale-110 transition-transform" />
                              <span className="text-[10px] font-black text-primary-900 uppercase tracking-widest">Inject Asset</span>
                            </div>
                          )}
                        </label>
                      </div>
                      <div className="flex-[2]">
                        <input
                          value={newSlideData.imageUrl}
                          onChange={(e) => setNewSlideData({ ...newSlideData, imageUrl: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[11px] font-black tracking-widest uppercase focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                          placeholder="Or enter heritage asset URL..."
                        />
                        <p className="text-[9px] font-bold text-secondary-400 mt-2 lowercase italic ml-2">Preferred resolution: 1920x1080 cinematic</p>
                      </div>
                    </div>
                  </div>

                  {/* Narrative Segment */}
                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest">02. Sequence Narrative</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Primary Directive</label>
                        <input
                          value={newSlideData.title}
                          onChange={(e) => setNewSlideData({ ...newSlideData, title: e.target.value })}
                          placeholder="e.g. Elevate Your Lifestyle"
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[12px] font-bold tracking-tight focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Lifecycle Subtext</label>
                        <input
                          value={newSlideData.subtitle}
                          onChange={(e) => setNewSlideData({ ...newSlideData, subtitle: e.target.value })}
                          placeholder="e.g. Premium maintenance for elite assets"
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[12px] font-bold tracking-tight focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Action Descriptor</label>
                        <input
                          value={newSlideData.ctaLabel}
                          onChange={(e) => setNewSlideData({ ...newSlideData, ctaLabel: e.target.value })}
                          placeholder="e.g. Inquire Intelligence"
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[12px] font-bold tracking-tight focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest px-2">Redirect Protocol</label>
                        <input
                          value={newSlideData.ctaHref}
                          onChange={(e) => setNewSlideData({ ...newSlideData, ctaHref: e.target.value })}
                          placeholder="e.g. /services"
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[12px] font-bold tracking-tight focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 relative z-10">
                  <div className="flex items-center gap-3">
                    <MousePointer2 className="w-5 h-5 text-secondary-300" />
                    <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Deployment Verification Required</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setIsAddSlideModalOpen(false)} className="px-8 py-4 text-[10px] font-black text-secondary-500 uppercase tracking-widest hover:text-primary-900 transition-all">Abort</button>
                    <button
                      onClick={editingSlideId ? saveEditedSlide : createNewSlide}
                      disabled={!newSlideData.imageUrl.trim() || isUploadingNewSlideImage}
                      className="px-10 py-4 bg-primary-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary-900/20 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-3"
                    >
                      <Layers className="w-4 h-4" />
                      <span>{editingSlideId ? 'Push Update' : 'Finalize Segment'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Purge Confirmation Dialog */}
      <AnimatePresence>
        {deleteDialog.isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-primary-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl text-center space-y-8"
            >
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm shadow-rose-500/10">
                <Trash2 className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-primary-900 tracking-tight uppercase">Confirm Purge Protocol</h3>
                <p className="text-secondary-500 font-medium">Are you certain you wish to purge <span className="text-primary-900 font-black">"{deleteDialog.slideTitle}"</span> from the cinematic sequence? This operation is irreversible.</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setDeleteDialog({ isOpen: false, slideId: '', slideTitle: '' })} className="flex-1 py-4 text-[10px] font-black text-secondary-500 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
                <button onClick={confirmDeleteSlide} className="flex-1 py-4 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-500/20 active:scale-95 transition-all">Execute Purge</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default HeroConfig
