'use client'

import { useState } from 'react'

export default function TestApiUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setResult(null)
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/test-upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setResult(data)
    } catch (err) {
      console.error('API upload failed:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test API Image Upload</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Image via API'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-4">
          <p className="mb-2">Upload successful!</p>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Response:</p>
            <pre className="font-mono text-sm bg-gray-50 p-2 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
            {result.url && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Uploaded Image:</p>
                <img src={result.url} alt="Uploaded" className="max-w-full h-auto rounded" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}