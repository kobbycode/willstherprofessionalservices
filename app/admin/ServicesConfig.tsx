'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Wrench,
  Plus,
  Trash2,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadImage } from '@/lib/storage'

const ServicesConfig = ({ config, onChange }: any) => {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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
      console.log('Starting to load services...')
      let timeoutId: NodeJS.Timeout | null = null;
      
      // Set a timeout to prevent infinite loading
      const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('Request timeout after 10 seconds'));
        }, 10000);
      });
      
      try {
        const response = await Promise.race([
          fetch('/api/services', { cache: 'no-store' }),
          timeout
        ]) as Response;
        
        console.log('Services API response status:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Failed to fetch services:', response.status, errorText)
          throw new Error(`Failed to fetch services: ${response.status} ${errorText}`)
        }
        
        const data = await response.json()
        console.log('Services data received:', data)
        setServices(data.services || [])
      } catch (error) {
        console.error('Error loading services:', error)
        toast.error('Failed to load services: ' + (error as Error).message)
      } finally {
        console.log('Finished loading services, setting loading to false')
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedService),
      })

      if (!response.ok) throw new Error('Failed to update service')

      setServices(prev => prev.map(s => s.id === id ? updatedService : s))
      toast.success('Service updated successfully!')
    } catch (error) {
      console.error('Failed to update service:', error)
      toast.error('Failed to update service. Please try again.')
    }
  }

  const addService = () => {
    setIsAddServiceModalOpen(true)
    setNewServiceData({
      title: '',
      description: '',
      category: '',
      imageUrl: ''
    })
  }

  const createNewService = async () => {
    if (!newServiceData.title.trim()) return
    
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newServiceData),
      })

      if (!response.ok) throw new Error('Failed to create service')
      
      const createdService = await response.json()
      setServices(prev => [...prev, createdService])
      setIsAddServiceModalOpen(false)
      setNewServiceData({
        title: '',
        description: '',
        category: '',
        imageUrl: ''
      })
      toast.success('Service added successfully!')
    } catch (error) {
      console.error('Failed to create service:', error)
      toast.error('Failed to create service. Please try again.')
    }
  }

  const handleServiceImageUpload = async (serviceId: string, file: File) => {
    if (!file) return
    
    setUploadingServices(prev => ({ ...prev, [serviceId]: true }))
    
    try {
      const imageUrl = await uploadImage(file, `services/service-${serviceId}-${Date.now()}`)
      await updateService(serviceId, 'imageUrl', imageUrl)
      toast.success('Service image uploaded successfully!')
    } catch (error) {
      console.error('Failed to upload service image:', error)
      toast.error('Failed to upload image. Please try again.')
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
      toast.success('Service image uploaded successfully!')
    } catch (error) {
      console.error('Failed to upload service image:', error)
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setIsUploadingNewServiceImage(false)
    }
  }

  const confirmDeleteService = async () => {
    const { serviceId } = deleteDialog
    if (!serviceId) return
    
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete service')

      setServices(prev => prev.filter(s => s.id !== serviceId))
      setDeleteDialog({ isOpen: false, serviceId: '', serviceName: '' })
      toast.success('Service deleted successfully!')
    } catch (error) {
      console.error('Failed to delete service:', error)
      toast.error('Failed to delete service. Please try again.')
    }
  }

  const cancelDeleteService = () => {
    setDeleteDialog({ isOpen: false, serviceId: '', serviceName: '' })
  }

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Services Configuration</h2>
            <p className="text-gray-600 mt-1">Manage your professional services</p>
          </div>
          <div className="px-4 py-2 bg-gray-200 rounded-lg animate-pulse">
            <span className="text-transparent">Add Service</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </motion.div>
    )
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
          <h2 className="text-2xl font-bold text-gray-900">Services Configuration</h2>
          <p className="text-gray-600 mt-1">Manage your professional services</p>
        </div>
        <button 
          onClick={addService} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Service</span>
        </button>
      </div>
      
      {services.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Wrench className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">No Services Found</h3>
          <p className="text-blue-700 mb-4">Get started by adding your first service</p>
          <button 
            onClick={addService} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s: any) => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 gap-4">
                {/* Content Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Title (ID: {s.id})</label>
                    <input 
                      value={s.title || ''} 
                      onChange={(e) => updateService(s.id, 'title', e.target.value)} 
                      placeholder="Enter service title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      value={s.description || ''} 
                      onChange={(e) => updateService(s.id, 'description', e.target.value)} 
                      placeholder="Enter service description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input 
                      value={s.category || ''} 
                      onChange={(e) => updateService(s.id, 'category', e.target.value)} 
                      placeholder="e.g., Cleaning Services, Maintenance Services"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Services with the same category will be grouped together</p>
                  </div>
                </div>

                {/* Image Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Image</label>
                    
                    {/* Image Preview */}
                    {s.imageUrl && (
                      <div className="mb-3">
                        <img 
                          src={s.imageUrl}
                          alt={s.title || 'Service'}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?q=80&w=1974&auto=format&fit=crop'
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Upload Section */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                          <span className="text-sm font-medium">
                            {uploadingServices[s.id] ? 'Uploading...' : 'Upload Image'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleServiceImageUpload(s.id, file)
                            }}
                            disabled={uploadingServices[s.id]}
                          />
                        </label>
                        {s.imageUrl && (
                          <button
                            onClick={() => updateService(s.id, 'imageUrl', '')}
                            className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            disabled={uploadingServices[s.id]}
                          >
                            Clear Image
                          </button>
                        )}
                      </div>
                      
                      {/* URL Input as fallback */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Or enter image URL:</label>
                        <input 
                          value={s.imageUrl || ''} 
                          onChange={(e) => updateService(s.id, 'imageUrl', e.target.value)} 
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          disabled={uploadingServices[s.id]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Remove Button */}
              <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setDeleteDialog({ isOpen: true, serviceId: s.id, serviceName: s.title })} 
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors duration-200 flex items-center space-x-2"
                  disabled={uploadingServices[s.id]}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Service</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add Service Modal */}
      {isAddServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add New Service</h3>
                <button 
                  onClick={() => setIsAddServiceModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Title *</label>
                  <input 
                    value={newServiceData.title} 
                    onChange={(e) => setNewServiceData({...newServiceData, title: e.target.value})} 
                    placeholder="Enter service title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    value={newServiceData.description} 
                    onChange={(e) => setNewServiceData({...newServiceData, description: e.target.value})} 
                    placeholder="Enter service description"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input 
                    value={newServiceData.category} 
                    onChange={(e) => setNewServiceData({...newServiceData, category: e.target.value})} 
                    placeholder="e.g., Cleaning Services, Maintenance Services"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Image</label>
                  
                  {/* Image Preview */}
                  {newServiceData.imageUrl && (
                    <div className="mb-3">
                      <img 
                        src={newServiceData.imageUrl}
                        alt="Service preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1581578731548-c13940b8c309?q=80&w=1974&auto=format&fit=crop'
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Upload Section */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                        <span className="text-sm font-medium">
                          {isUploadingNewServiceImage ? 'Uploading...' : 'Upload Image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleNewServiceImageUpload(file)
                          }}
                          disabled={isUploadingNewServiceImage}
                        />
                      </label>
                      {newServiceData.imageUrl && (
                        <button
                          onClick={() => setNewServiceData({...newServiceData, imageUrl: ''})}
                          className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          disabled={isUploadingNewServiceImage}
                        >
                          Clear Image
                        </button>
                      )}
                    </div>
                    
                    {/* URL Input as fallback */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Or enter image URL:</label>
                      <input 
                        value={newServiceData.imageUrl || ''} 
                        onChange={(e) => setNewServiceData({...newServiceData, imageUrl: e.target.value})} 
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        disabled={isUploadingNewServiceImage}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={() => setIsAddServiceModalOpen(false)}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewService}
                  disabled={!newServiceData.title.trim()}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    !newServiceData.title.trim() 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Service</span>
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
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg mb-4">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Service</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteDialog.serviceName}</span>? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelDeleteService}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteService}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default ServicesConfig