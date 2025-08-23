'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  X,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Edit
} from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import RichTextEditor from '@/components/RichTextEditor'
import { createPost } from '@/lib/blog'
import { formatDateHuman } from '@/lib/date'
import toast from 'react-hot-toast'

// Helper function to calculate word count consistently
const calculateWordCount = (content: string): number => {
  if (!content) return 0
  const plain = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return plain.split(' ').filter(word => word.length > 0).length
}

// Helper function to calculate reading time consistently
const calculateReadingTime = (content: string): number => {
  const words = calculateWordCount(content)
  return Math.max(1, Math.ceil(words / 200))
}

const NewBlogPost = () => {
  const [post, setPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image: '',
    status: 'draft',
    tags: []
  })

  const [isPreview, setIsPreview] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [showUrlModal, setShowUrlModal] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState('')
  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const { fetchCategories, addCategory } = await import('@/lib/categories')
        let list = await fetchCategories()
        if (list.length === 0) {
          const defaults = ['Residential Cleaning','Commercial Cleaning','Industrial Cleaning','Green Cleaning','Post-Construction','Fabric Care']
          await Promise.all(defaults.map((n) => addCategory(n)))
          list = await fetchCategories()
        }
        if (!active) return
        setCategories(list)
      } catch {}
    }
    load()
    return () => { active = false }
  }, [])

  const handleSave = async () => {
    if (!post.title || !post.content || !post.category) {
      toast.error('Please fill in Title, Content, and Category')
      return
    }
    setIsSaving(true)
    try {
      const id = await createPost({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        image: post.image,
        tags,
        status: post.status as any,
        author: 'Willsther Team'
      })
      toast.success('Post saved')
    } catch (error) {
      toast.error('Failed to save post')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!post.title || !post.content || !post.category) {
      toast.error('Please fill in Title, Content, and Category')
      return
    }
    setIsPublishing(true)
    try {
      const next = { ...post, status: 'published' }
      setPost(next)
      await createPost({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        image: post.image,
        tags,
        status: 'published' as any,
        author: 'Willsther Team'
      })
      toast.success('Post published')
    } catch (error) {
      toast.error('Failed to publish post')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleAddCategory = async () => {
    const name = newCategory.trim()
    if (!name) return
    setIsAddingCategory(true)
    try {
      const { addCategory, fetchCategories } = await import('@/lib/categories')
      await addCategory(name)
      const list = await fetchCategories()
      setCategories(list)
      setNewCategory('')
      toast.success('Category added')
    } catch (e) {
      toast.error((e as any)?.message || 'Failed to add category')
    } finally {
      setIsAddingCategory(false)
    }
  }

  const handleAddTag = () => {
    const val = tagInput.trim()
    if (val && !tags.includes(val)) {
      setTags([...tags, val])
      setTagInput('')
    }
  }

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTagInput(value)
    
    // Check if the last character is a comma
    if (value.endsWith(',')) {
      const tagValue = value.slice(0, -1).trim() // Remove the comma
      if (tagValue && !tags.includes(tagValue)) {
        setTags([...tags, tagValue])
        setTagInput('')
      }
    }
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = tagInput.trim()
      if (val && !tags.includes(val)) {
        setTags([...tags, val])
        setTagInput('')
      }
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const TextEditor = () => (
    <div className="border border-gray-300 rounded-lg">
      <RichTextEditor
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
        placeholder="Write your blog content..."
      />
    </div>
  )

  const PostPreview = () => (
    <div className="bg-white rounded-lg border border-gray-300 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title || 'Untitled Post'}</h2>
      {post.excerpt && (
        <p className="text-gray-600 mb-4 italic">"{post.excerpt}"</p>
      )}
      {post.image && (
        <div className="mb-4">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
      <div className="prose max-w-none">
        <div className="text-gray-700">
          {/* Render markdown preview */}
          {(() => {
            const Markdown = require('react-markdown').default
            const gfm = require('remark-gfm').default
            return <Markdown remarkPlugins={[gfm]}>{post.content || 'No content yet...'}</Markdown>
          })()}
        </div>
      </div>
      {tags.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col space-y-4 sm:space-y-0">
            {/* Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/admin" 
                className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors text-sm sm:text-base w-fit group"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Admin</span>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-white/30"></div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Create New Blog Post</h1>
                <p className="text-white/80 mt-1 text-sm sm:text-base">Write and publish a new blog post</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-200 text-sm font-medium backdrop-blur-sm"
              >
                {isPreview ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{isPreview ? 'Edit' : 'Preview'}</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 text-sm shadow-lg hover:shadow-xl"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-500 text-white rounded-lg font-medium transition-all duration-200 text-sm shadow-lg hover:shadow-xl"
              >
                {isPublishing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                <span>Publish</span>
                )}
                <span>{isPublishing ? 'Publishing...' : 'Publish'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

          {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
            {isPreview ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{post.title || 'Untitled Post'}</h2>
              {post.excerpt && (
                <p className="text-lg text-gray-600 mb-6 italic">{post.excerpt}</p>
              )}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={post.title}
                    onChange={(e) => setPost({ ...post, title: e.target.value })}
                    placeholder="Enter post title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>

                {/* Excerpt */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                  <textarea
                    value={post.excerpt}
                    onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                    placeholder="Enter a brief excerpt..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base resize-none"
                  />
                </div>

                {/* Content Editor */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <RichTextEditor
                    value={post.content}
                    onChange={(content) => setPost({ ...post, content })}
                    placeholder="Write your blog post content..."
                  />
                </div>
          </div>

          {/* Sidebar */}
              <div className="space-y-6">
                  {/* Category */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={post.category}
                      onChange={(e) => setPost({ ...post, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  
                  {/* Add New Category */}
                  <div className="mt-3">
                    <div className="flex space-x-2">
                    <input
                      type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <button
                        onClick={handleAddCategory}
                        disabled={isAddingCategory}
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 text-sm font-medium transition-colors"
                      >
                        {isAddingCategory ? 'Adding...' : 'Add'}
                      </button>
                    </div>
                  </div>
                  </div>

                  {/* Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={post.status}
                    onChange={(e) => setPost({ ...post, status: e.target.value as 'draft' | 'published' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
              </div>

                {/* Tags */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Type a tag and press Enter or comma..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <button
                        onClick={handleAddTag}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                      >
                        Add
                      </button>
                  </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(index)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                  </div>
                </div>
              </div>

                {/* Image URL */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
                <div className="space-y-3">
                    <input
                      type="text"
                      value={post.image}
                      onChange={(e) => setPost({ ...post, image: e.target.value })}
                      placeholder="Enter image URL..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <button
                      onClick={() => setShowUrlModal(true)}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors"
                    >
                      Upload Image
                  </button>
                </div>
              </div>

                {/* Post Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Post Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Word Count:</span>
                      <span className="font-medium">{calculateWordCount(post.content)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reading Time:</span>
                      <span className="font-medium">{calculateReadingTime(post.content)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tags:</span>
                      <span className="font-medium">{tags.length}</span>
                    </div>
          </div>
        </div>
      </div>
            </div>
          )}
        </div>
      </div>

       {/* Custom URL Modal */}
       {showUrlModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold text-gray-900">Add Image URL</h3>
               <button
                 onClick={() => {
                   setShowUrlModal(false)
                   setUrlInput('')
                 }}
                 className="text-gray-400 hover:text-gray-600"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Image URL
                 </label>
                 <input
                   type="url"
                   value={urlInput}
                   onChange={(e) => setUrlInput(e.target.value)}
                   placeholder="https://example.com/image.jpg"
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                       if (urlInput.trim()) {
                         setPost({ ...post, image: urlInput.trim() })
                         setShowUrlModal(false)
                         setUrlInput('')
                         toast.success('Image URL added')
                       }
                     }
                   }}
                 />
               </div>
               <div className="flex justify-end space-x-3">
                 <button
                   onClick={() => {
                     setShowUrlModal(false)
                     setUrlInput('')
                   }}
                   className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={() => {
                     if (urlInput.trim()) {
                       setPost({ ...post, image: urlInput.trim() })
                       setShowUrlModal(false)
                       setUrlInput('')
                       toast.success('Image URL added')
                     } else {
                       toast.error('Please enter a valid URL')
                     }
                   }}
                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                 >
                   Add Image
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  )
}

export default NewBlogPost

