'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'

// Improved dynamic import with better error handling
const Quill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => (
    <div className="h-32 bg-gray-100 rounded animate-pulse flex items-center justify-center">
      <div className="text-gray-500 text-sm">Loading editor...</div>
    </div>
  )
}) as any

type Props = {
  value: string
  onChange: (nextHtml: string) => void
  placeholder?: string
  className?: string
  fullHeight?: boolean
}

export default function RichTextEditor({ value, onChange, placeholder, className, fullHeight = false }: Props) {
  const [internal, setInternal] = useState<string>(value || '')
  const [isQuillLoaded, setIsQuillLoaded] = useState(false)
  const lastPropValue = useRef<string>(value || '')
  const timer = useRef<any>(null)
  const quillRef = useRef<any>(null)

  useEffect(() => {
    if (value !== lastPropValue.current) {
      lastPropValue.current = value
      setInternal(value || '')
    }
  }, [value])

  // Check if Quill is loaded
  useEffect(() => {
    const checkQuillLoaded = () => {
      if (typeof window !== 'undefined' && (window as any).Quill) {
        setIsQuillLoaded(true)
      } else {
        setTimeout(checkQuillLoaded, 100)
      }
    }
    checkQuillLoaded()
  }, [])

  // Ensure the editor gets focus on mount and stays focused after parent re-renders
  useEffect(() => {
    if (!isQuillLoaded) return
    
    const t = setTimeout(() => {
      try {
        const inst = quillRef.current && (quillRef.current.getEditor ? quillRef.current.getEditor() : quillRef.current)
        inst && inst.focus && inst.focus()
      } catch (error) {
        console.warn('Failed to focus Quill editor:', error)
      }
    }, 100)
    return () => clearTimeout(t)
  }, [isQuillLoaded])

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'link'], 
      ['clean']
    ],
    // Custom clipboard handler to prevent image pasting
    clipboard: {
      matchVisual: false
    }
  }), [])

  const formats = useMemo(() => [
    'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'blockquote', 'link'
  ], [])

  const handleChange = (html: string) => {
    setInternal(html)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      onChange(html)
    }, 200)
  }

  if (!isQuillLoaded) {
    return (
      <div className={`${fullHeight ? 'editor-fullheight' : ''} ${className || ''}`}>
        <div className="h-32 bg-gray-100 rounded animate-pulse flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading editor...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${fullHeight ? 'editor-fullheight' : ''} ${className || ''}`}>
      <Quill
        theme="snow"
        ref={quillRef}
        value={internal}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ width: '100%' }}
      />
    </div>
  )
}


