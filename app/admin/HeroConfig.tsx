'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
  ArrowUp,
  ArrowDown
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
  const [uploadingSlides, setUploadingSlides] = useState<Record<string, boolean>>({})
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
    setIsAddSlideModalOpen(true)
    setNewSlideData({
      imageUrl: '',
      title: '',
      subtitle: '',
      ctaLabel: '',
      ctaHref: ''
    })
  }

  const createNewSlide = () => {
    if (!newSlideData.imageUrl.trim()) {
      toast.error('Please provide an image for the slide')
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
    setNewSlideData({
      imageUrl: '',
      title: '',
      subtitle: '',
      ctaLabel: '',
      ctaHref: ''
    })
    toast.success('Slide added successfully!')
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

  const updateSlideOrder = (id: string, direction: 'up' | 'down') => {
    const next = { ...config }
    next.heroSlides = [...heroSlides]
    const index = next.heroSlides.findIndex((s: any) => s.id === id)
    if (index >= 0) {
      if (direction === 'up' && index > 0) {
        // Swap with previous item
        const temp = next.heroSlides[index - 1]
        next.heroSlides[index - 1] = next.heroSlides[index]
        next.heroSlides[index] = temp
      } else if (direction === 'down' && index < next.heroSlides.length - 1) {
        // Swap with next item
        const temp = next.heroSlides[index + 1]
        next.heroSlides[index + 1] = next.heroSlides[index]
        next.heroSlides[index] = temp
      }
      onChange(next)
    }
  }

  const saveEditedSlide = () => {
    if (!editingSlideId) return
    
    if (!newSlideData.imageUrl.trim()) {
      toast.error('Please provide an image for the slide')
      return
    }
    
    const next = { ...config }
    next.heroSlides = [...heroSlides]
    const index = next.heroSlides.findIndex((s: any) => s.id === editingSlideId)
    if (index >= 0) {
      next.heroSlides[index] = {
        ...next.heroSlides[index],
        ...newSlideData
      }
      onChange(next)
      setIsAddSlideModalOpen(false)
      setEditingSlideId(null)
      setNewSlideData({
        imageUrl: '',
        title: '',
        subtitle: '',
        ctaLabel: '',
        ctaHref: ''
      })
      toast.success('Slide updated successfully!')
    }
  }

  const handleSlideImageUpload = async (file: File) => {
    if (!file) return
    
    setIsUploadingNewSlideImage(true)
    
    try {
      const imageUrl = await uploadImage(file, `hero/slides/slide-${Date.now()}`)
      setNewSlideData(prev => ({ ...prev, imageUrl }))
      toast.success('Slide image uploaded successfully!')
    } catch (error) {
      console.error('Failed to upload slide image:', error)
      toast.error('Failed to upload image. Please try again.')
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
    toast.success('Slide deleted successfully!')
  }

  const cancelDeleteSlide = () => {
    setDeleteDialog({ isOpen: false, slideId: '', slideTitle: '' })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Section Configuration</h2>
          <p className="text-gray-600 mt-1">Manage your homepage hero slides</p>
        </div>
        <button 
          onClick={addSlide} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Slide</span>
        </button>
      </div>
      
      {heroSlides.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <ImageIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">No Hero Slides Found</h3>
          <p className="text-blue-700 mb-4">Get started by adding your first hero slide</p>
          <button 
            onClick={addSlide} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {heroSlides.map((slide: any, index: number) => (
            <div key={slide.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Slide {index + 1}</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => updateSlideOrder(slide.id, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => updateSlideOrder(slide.id, 'down')}
                    disabled={index === heroSlides.length - 1}
                    className={`p-1 rounded ${index === heroSlides.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => editSlide(slide)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit slide"
                  >
                    <Plus className="w-4 h-4 rotate-45" />
                  </button>
                  <button 
                    onClick={() => setDeleteDialog({ 
                      isOpen: true, 
                      slideId: slide.id, 
                      slideTitle: slide.title || `Slide ${index + 1}` 
                    })}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Delete slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slide Image</label>
                  {slide.imageUrl ? (
                    <div className="relative">
                      <img 
                        src={slide.imageUrl}
                        alt="Slide preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=1974&auto=format&fit=crop';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input 
                      value={slide.title || ''} 
                      onChange={(e) => updateSlide(slide.id, 'title', e.target.value)} 
                      placeholder="Enter slide title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <textarea 
                      value={slide.subtitle || ''} 
                      onChange={(e) => updateSlide(slide.id, 'subtitle', e.target.value)} 
                      placeholder="Enter slide subtitle"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CTA Label</label>
                      <input 
                        value={slide.ctaLabel || ''} 
                        onChange={(e) => updateSlide(slide.id, 'ctaLabel', e.target.value)} 
                        placeholder="Button text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CTA Link</label>
                      <input 
                        value={slide.ctaHref || ''} 
                        onChange={(e) => updateSlide(slide.id, 'ctaHref', e.target.value)} 
                        placeholder="#section or /page"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add/Edit Slide Modal */}
      {isAddSlideModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            // Close modal when clicking on backdrop
            if (e.target === e.currentTarget) {
              setIsAddSlideModalOpen(false)
              setEditingSlideId(null)
            }
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col"
          >
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingSlideId ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                </h3>
                <button 
                  onClick={() => {
                    setIsAddSlideModalOpen(false)
                    setEditingSlideId(null)
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slide Image *</label>
                  
                  {/* Image Preview */}
                  {newSlideData.imageUrl && (
                    <div className="mb-3">
                      <img 
                        src={newSlideData.imageUrl}
                        alt="Slide preview"
                        className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=1974&auto=format&fit=crop';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Upload Section */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <label className="relative cursor-pointer bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                        <span className="text-sm font-medium">
                          {isUploadingNewSlideImage ? 'Uploading...' : 'Upload Image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleSlideImageUpload(file);
                          }}
                          disabled={isUploadingNewSlideImage}
                        />
                      </label>
                      {newSlideData.imageUrl && (
                        <button
                          onClick={() => setNewSlideData({...newSlideData, imageUrl: ''})}
                          className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          disabled={isUploadingNewSlideImage}
                        >
                          Clear Image
                        </button>
                      )}
                    </div>
                    
                    {/* URL Input as fallback */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Or enter image URL:</label>
                      <input 
                        value={newSlideData.imageUrl || ''} 
                        onChange={(e) => setNewSlideData({...newSlideData, imageUrl: e.target.value})} 
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                        disabled={isUploadingNewSlideImage}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input 
                    value={newSlideData.title} 
                    onChange={(e) => setNewSlideData({...newSlideData, title: e.target.value})} 
                    placeholder="Enter slide title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea 
                    value={newSlideData.subtitle} 
                    onChange={(e) => setNewSlideData({...newSlideData, subtitle: e.target.value})} 
                    placeholder="Enter slide subtitle"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Label</label>
                    <input 
                      value={newSlideData.ctaLabel} 
                      onChange={(e) => setNewSlideData({...newSlideData, ctaLabel: e.target.value})} 
                      placeholder="e.g., Get Quote"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CTA Link</label>
                    <input 
                      value={newSlideData.ctaHref} 
                      onChange={(e) => setNewSlideData({...newSlideData, ctaHref: e.target.value})} 
                      placeholder="e.g., #contact or /services"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsAddSlideModalOpen(false)
                    setEditingSlideId(null)
                  }}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={editingSlideId ? saveEditedSlide : createNewSlide}
                  disabled={!newSlideData.imageUrl.trim() || isUploadingNewSlideImage}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    !newSlideData.imageUrl.trim() || isUploadingNewSlideImage
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>{editingSlideId ? 'Update Slide' : 'Add Slide'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
                <button 
                  onClick={cancelDeleteSlide}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the slide <span className="font-semibold">"{deleteDialog.slideTitle}"</span>? 
                This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={cancelDeleteSlide}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteSlide}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors duration-200"
                >
                  Delete Slide
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default HeroConfig