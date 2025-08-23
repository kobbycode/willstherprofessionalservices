'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, EyeOff, Upload, X } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { fetchPostById, updatePost, type BlogPost } from '@/lib/blog'
import { fetchCategories } from '@/lib/categories'
import { formatDateHuman } from '@/lib/date'
import { uploadImage } from '@/lib/storage'
import RichTextEditor from '@/components/RichTextEditor'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [showUrlModal, setShowUrlModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')

  // Form state
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')

  // Load post and categories
  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [postData, categoriesData] = await Promise.all([
        fetchPostById(params.id),
        fetchCategories()
      ])
      
      if (!postData) {
        toast.error('Post not found')
        router.push('/admin')
        return
      }

      setPost(postData)
      setCategories(categoriesData)
      
      // Set form values
      setTitle(postData.title)
      setExcerpt(postData.excerpt || '')
      setContent(postData.content)
      setCategory(postData.category)
      setTags(postData.tags || [])
      setStatus(postData.status)
      setImageUrl(postData.image || '')
      setImagePreview(postData.image || '')
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load post data')
    } finally {
      setIsLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Tag handling
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
        setTagInput('')
      }
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags(tags.slice(0, -1))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Image upload handling
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const url = await uploadImage(file, `blog-images/${Date.now()}-${file.name}`)
      setImageUrl(url)
      setImagePreview(url)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setImageUrl('')
    setImagePreview('')
  }

  // Save functions
  const saveDraft = async () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    setIsSaving(true)
    try {
      await updatePost(params.id, {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        category,
        image: imageUrl,
        tags,
        status: 'draft'
      })
      toast.success('Draft saved successfully')
    } catch (error) {
      console.error('Save failed:', error)
      toast.error('Failed to save draft')
    } finally {
      setIsSaving(false)
    }
  }

  const publishPost = async () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    setIsPublishing(true)
    try {
      await updatePost(params.id, {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        category,
        image: imageUrl,
        tags,
        status: 'published'
      })
      toast.success('Post published successfully')
      router.push('/admin')
    } catch (error) {
      console.error('Publish failed:', error)
      toast.error('Failed to publish post')
    } finally {
      setIsPublishing(false)
    }
  }

  // Add category
  const addCategory = async () => {
    const name = newCategory.trim()
    if (!name) return

    setIsAddingCategory(true)
    try {
      const { addCategory, fetchCategories } = await import('@/lib/categories')
      await addCategory(name)
      const updatedCategories = await fetchCategories()
      setCategories(updatedCategories)
      setNewCategory('')
      toast.success('Category added')
    } catch (error) {
      console.error('Failed to add category:', error)
      toast.error('Failed to add category')
    } finally {
      setIsAddingCategory(false)
    }
  }

  // Helper functions
  const calculateWordCount = (text: string) => {
    return text.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length
  }

  const calculateReadingTime = (text: string) => {
    const words = calculateWordCount(text)
    return Math.max(1, Math.ceil(words / 200))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-20">
          <div className="container-custom px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-96 bg-gray-200 rounded mb-8"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-20">
          <div className="container-custom px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
              <Link href="/admin" className="text-blue-600 hover:text-blue-700">
                Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container-custom px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Blog Post</h1>
                <p className="text-sm text-gray-500">Last updated: {formatDateHuman(post.updatedAt || post.date, 'en-GB')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPreview ? 'Hide Preview' : 'Preview'}</span>
              </button>
              <button
                onClick={saveDraft}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
              </button>
              <button
                onClick={publishPost}
                disabled={isPublishing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <span>{isPublishing ? 'Publishing...' : 'Publish'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter post title..."
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of the post..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <div className="flex space-x-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  />
                  <button
                    type="button"
                    onClick={addCategory}
                    disabled={isAddingCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isAddingCategory ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="border border-gray-300 rounded-lg p-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                  className="w-full px-2 py-1 border-0 focus:ring-0 focus:outline-none text-sm"
                  placeholder="Type tags and press Enter or comma..."
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUrlModal(true)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Or enter URL
                  </button>
                </div>
                
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                fullHeight={true}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                
                <div className="text-sm text-gray-600 space-y-2">
                  <div>Word count: {calculateWordCount(content)}</div>
                  <div>Reading time: {calculateReadingTime(content)} min</div>
                  <div>Tags: {tags.length}</div>
                  <div>Category: {category || 'Not set'}</div>
                  <div>Status: {status}</div>
                </div>
              </div>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="prose prose-sm max-w-none">
                  <h1>{title || 'Untitled Post'}</h1>
                  {excerpt && <p className="text-gray-600">{excerpt}</p>}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Image URL</h3>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setImagePreview(imageUrl)
                  setShowUrlModal(false)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Set Image
              </button>
              <button
                onClick={() => setShowUrlModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
