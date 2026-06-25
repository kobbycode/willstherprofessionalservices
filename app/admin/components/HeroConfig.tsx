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
  Eye,
  Camera,
  ArrowRight,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { SiteConfig, ConfigOnChange } from '@/lib/site-config'
import { uploadImage } from '@/lib/storage'
import Image from 'next/image'

interface HeroConfigProps {
    config: SiteConfig
    onChange: ConfigOnChange
    onSave?: () => Promise<void>
}

const HeroConfig = ({ config, onChange, onSave }: HeroConfigProps) => {
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
  const [isSavingSlide, setIsSavingSlide] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    slideId: '',
    slideTitle: ''
  })

  const updateSlide = (id: string, key: string, value: string) => {
    onChange((prev: any) => {
      const next = { ...prev }
      const heroSlides = prev.heroSlides || []
      const index = heroSlides.findIndex((s: any) => s.id === id)
      if (index >= 0) {
        const nextSlides = [...heroSlides]
        nextSlides[index] = { ...nextSlides[index], [key]: value }
        next.heroSlides = nextSlides
      }
      return next
    })
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

  const createNewSlide = async () => {
    if (!newSlideData.imageUrl.trim()) {
      toast.error('Image asset required')
      return
    }

    onChange((prev: any) => ({
      ...prev,
      heroSlides: [
        ...(prev.heroSlides || []),
        {
          id: `slide_${Date.now()}`,
          ...newSlideData,
          order: (prev.heroSlides || []).length
        }
      ]
    }))

    setIsSavingSlide(true)
    try {
      await onSave?.()
      setIsAddSlideModalOpen(false)
      toast.success('Slide added — live on website ✓')
    } catch {
      toast.error('Failed to publish slide. Please try again.')
    } finally {
      setIsSavingSlide(false)
    }
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

  const saveEditedSlide = async () => {
    if (!editingSlideId) return
    if (!newSlideData.imageUrl.trim()) {
      toast.error('Image asset required')
      return
    }

    onChange((prev: any) => {
      const next = { ...prev }
      const currentSlides = prev.heroSlides || []
      const index = currentSlides.findIndex((s: any) => s.id === editingSlideId)
      if (index >= 0) {
        const nextSlides = [...currentSlides]
        nextSlides[index] = { ...nextSlides[index], ...newSlideData }
        next.heroSlides = nextSlides
      }
      return next
    })

    setIsSavingSlide(true)
    try {
      await onSave?.()
      setIsAddSlideModalOpen(false)
      setEditingSlideId(null)
      toast.success('Changes saved — live on website ✓')
    } catch {
      toast.error('Failed to save changes. Please try again.')
    } finally {
      setIsSavingSlide(false)
    }
  }

  const updateSlideOrder = (id: string, direction: 'up' | 'down') => {
    onChange((prev: any) => {
      const next = { ...prev }
      const currentSlides = [...(prev.heroSlides || [])]
      const index = currentSlides.findIndex((s: any) => s.id === id)
      if (index >= 0) {
        if (direction === 'up' && index > 0) {
          const temp = currentSlides[index - 1]
          currentSlides[index - 1] = currentSlides[index]
          currentSlides[index] = temp
        } else if (direction === 'down' && index < currentSlides.length - 1) {
          const temp = currentSlides[index + 1]
          currentSlides[index + 1] = currentSlides[index]
          currentSlides[index] = temp
        }
        next.heroSlides = currentSlides
      }
      return next
    })
    onSave?.()
  }

  const handleSlideImageUpload = async (file: File) => {
    if (!file) return
    setIsUploadingNewSlideImage(true)
    try {
      const imageUrl = await uploadImage(file, `hero/slides/slide-${Date.now()}`)
      setNewSlideData(prev => ({ ...prev, imageUrl }))
      toast.success('Ultra-high-res asset uploaded')
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setIsUploadingNewSlideImage(false)
    }
  }

  const confirmDeleteSlide = () => {
    const { slideId } = deleteDialog
    if (!slideId) return
    onChange((prev: any) => ({
      ...prev,
      heroSlides: (prev.heroSlides || []).filter((s: any) => s.id !== slideId)
    }))
    setDeleteDialog({ isOpen: false, slideId: '', slideTitle: '' })
    toast.success('Slide deleted')
    onSave?.()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-primary-900 tracking-tight text-shadow-sm">Banner Slides</h2>
          <p className="text-secondary-600 font-medium mt-1 uppercase tracking-[0.1em] text-[10px]">Manage the main images on your home page</p>
        </div>
        <button
          onClick={addSlide}
          className="group px-6 py-3.5 bg-primary-900 text-white rounded-2xl shadow-xl shadow-primary-900/20 hover:shadow-primary-900/30 active:scale-95 transition-all flex items-center gap-3"
        >
          <div className="p-1 px-2 border border-white/20 rounded-lg group-hover:border-white/40"><Plus className="w-4 h-4" /></div>
          <span className="text-[11px] font-black uppercase tracking-widest">Add New Slide</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8">
        {heroSlides.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-24 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
              <ImageIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-primary-900 mb-2 uppercase tracking-tight">No slides added</h3>
            <p className="text-secondary-400 font-medium text-sm max-w-xs mx-auto">Add your first slide to start showing content on the home page.</p>
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
                    {slide.imageUrl ? (
                    <Image
                      src={slide.imageUrl}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      alt="Preview"
                    />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/40 text-[10px] font-black uppercase tracking-widest bg-gray-800">No Image</div>
                    )}
                    <div className="absolute left-10 top-1/2 -translate-y-1/2 z-20 space-y-2 max-w-[80%]">
                      <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg inline-flex items-center gap-2 border border-white/20">
                        <Eye className="w-3 h-3 text-white" />
                        <span className="text-white text-[9px] font-black uppercase tracking-widest">Preview Mode</span>
                      </div>
                      <h4 className="text-white text-xl font-black leading-tight drop-shadow-lg">{slide.title || 'Untitled Segment'}</h4>
                    </div>
                  </div>

                  {/* Right: Intel */}
                  <div className="flex-1 p-10 flex flex-col justify-between bg-white relative">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-secondary-300 uppercase tracking-widest">Slide Details</p>
                        <h3 className="text-2xl font-black text-primary-900 tracking-tight">{slide.title || 'Slide Title'}</h3>
                        <p className="text-secondary-500 font-medium text-sm line-clamp-2 italic">"{slide.subtitle || 'No subtitle'}"</p>
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
                        <span className="text-[9px] font-black text-secondary-300 uppercase tracking-widest">Setting Path</span>
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-primary-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[92vh]"
            >
              {/* ── LEFT PANEL: Composition ── */}
              <div className="lg:w-[300px] bg-[#f7f8fa] border-r border-gray-100 p-8 flex flex-col gap-6 flex-shrink-0 overflow-y-auto">
                {/* Header */}
                <div>
                  <h3 className="text-2xl font-black text-primary-900 tracking-tight">Composition</h3>
                  <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mt-0.5">Asset Configuration Portal</p>
                </div>

                {/* PRIMARY VISUAL card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-start gap-3 shadow-sm">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Camera className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-primary-900 uppercase tracking-widest leading-tight">Primary Visual</p>
                    <p className="text-[10px] text-secondary-400 mt-0.5 leading-snug">This is the main visual shown on the slide.</p>
                  </div>
                </div>

                {/* Image Preview */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm aspect-[4/3] relative">
                  <AnimatePresence mode='wait'>
                    {newSlideData.imageUrl ? (
                      <motion.img
                        key={newSlideData.imageUrl}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={newSlideData.imageUrl}
                        className="w-full h-full object-contain"
                        alt="Slide preview"
                      />
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-50"
                      >
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">No image yet</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Size hint */}
                <div className="bg-white rounded-xl border border-gray-200 p-3 flex items-start gap-2.5 shadow-sm">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[8px] font-black text-gray-400">i</span>
                  </div>
                  <p className="text-[10px] text-secondary-400 leading-snug">
                    Recommended size: <span className="font-bold text-secondary-600">1280×720px</span><br />
                    PNG, JPG or SVG up to 10MB
                  </p>
                </div>

                {/* Upload button */}
                <label className="group relative flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary-900/30 hover:bg-gray-50 transition-all cursor-pointer">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleSlideImageUpload(e.target.files[0])} />
                  {isUploadingNewSlideImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary-900/20 border-t-primary-900 rounded-full animate-spin" />
                      <span className="text-[9px] font-black text-primary-900 uppercase tracking-widest">Uploading…</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-center">
                      <Camera className="w-4 h-4 text-gray-400 group-hover:text-primary-900 transition-colors" />
                      <span className="text-[10px] font-bold text-gray-500 group-hover:text-primary-900 uppercase tracking-widest transition-colors">Upload Image</span>
                    </div>
                  )}
                </label>
              </div>

              {/* ── RIGHT PANEL: Form ── */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">

                {/* Modal Header */}
                <div className="px-10 py-7 flex items-center justify-between border-b border-gray-100">
                  <h3 className="text-3xl font-black text-primary-900 tracking-tight">
                    {editingSlideId ? 'Edit Slide' : 'Add New Slide'}
                  </h3>
                  <button
                    onClick={() => setIsAddSlideModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Form body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="px-10 pt-8 pb-4 border-b border-gray-100">
                    <p className="text-[11px] font-black text-primary-900 uppercase tracking-widest">02. Slide Text</p>
                    <p className="text-sm text-secondary-400 mt-1">Update the text content that will be displayed on this slide.</p>
                  </div>

                  <div className="px-10 py-8 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest block">Title</label>
                      <input
                        value={newSlideData.title}
                        onChange={(e) => setNewSlideData({ ...newSlideData, title: e.target.value })}
                        placeholder="e.g. The best name in facility support services"
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-primary-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900/40 transition-all"
                      />
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest block">Subtitle</label>
                      <input
                        value={newSlideData.subtitle}
                        onChange={(e) => setNewSlideData({ ...newSlideData, subtitle: e.target.value })}
                        placeholder="e.g. We are results oriented..."
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-primary-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900/40 transition-all"
                      />
                    </div>

                    {/* Button Label */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest block">Button Label</label>
                      <input
                        value={newSlideData.ctaLabel}
                        onChange={(e) => setNewSlideData({ ...newSlideData, ctaLabel: e.target.value })}
                        placeholder="e.g. Get Started Today"
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-primary-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900/40 transition-all"
                      />
                    </div>

                    {/* Button Link */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest block">Button Link</label>
                      <input
                        value={newSlideData.ctaHref}
                        onChange={(e) => setNewSlideData({ ...newSlideData, ctaHref: e.target.value })}
                        placeholder="e.g. #contact"
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-primary-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900/40 transition-all"
                      />
                    </div>

                    {/* Also-enter-URL option for image */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-secondary-500 uppercase tracking-widest block">Or paste image URL</label>
                      <input
                        value={newSlideData.imageUrl}
                        onChange={(e) => setNewSlideData({ ...newSlideData, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-primary-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900/40 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Footer ── */}
                <div className="px-10 py-5 border-t border-gray-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    {/* Shield icon */}
                    <svg className="w-8 h-8 text-gray-300 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <div>
                      <p className="text-[11px] font-black text-primary-900 uppercase tracking-widest leading-tight">Verification Required</p>
                      <p className="text-[10px] text-secondary-400 leading-tight">Before saving changes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsAddSlideModalOpen(false)}
                      disabled={isSavingSlide}
                      className="text-sm font-medium text-gray-500 hover:text-primary-900 transition-colors px-2 disabled:opacity-40"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={editingSlideId ? saveEditedSlide : createNewSlide}
                      disabled={!newSlideData.imageUrl.trim() || isUploadingNewSlideImage || isSavingSlide}
                      className="flex items-center gap-2 px-6 py-3 bg-primary-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-900/20 hover:bg-primary-800 active:scale-95 transition-all disabled:opacity-40 min-w-[140px] justify-center"
                    >
                      {isSavingSlide ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Publishing…</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                          </svg>
                          <span>{editingSlideId ? 'Save Changes' : 'Add Slide'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
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
                <h3 className="text-2xl font-black text-primary-900 tracking-tight uppercase">Confirm Delete</h3>
                <p className="text-secondary-500 font-medium">Are you sure you want to delete <span className="text-primary-900 font-black">"{deleteDialog.slideTitle}"</span>? This action cannot be undone.</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setDeleteDialog({ isOpen: false, slideId: '', slideTitle: '' })} className="flex-1 py-4 text-[10px] font-black text-secondary-500 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
                <button onClick={confirmDeleteSlide} className="flex-1 py-4 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-500/20 active:scale-95 transition-all">Delete Slide</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default HeroConfig
