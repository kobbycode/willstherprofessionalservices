'use client'

// Uploads images to imgbb instead of Firebase Storage
// Requires NEXT_PUBLIC_IMGBB_API_KEY to be set at build time

async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove data URL prefix if present
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export async function uploadImage(file: File, _pathPrefix = 'uploads'): Promise<string> {
  try {
    console.log('=== UPLOAD (imgbb) START ===')
    console.log('File details:', { name: file.name, size: file.size, type: file.type })

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
    if (!apiKey) {
      throw new Error('Missing NEXT_PUBLIC_IMGBB_API_KEY')
    }

    // Convert to base64 as imgbb accepts base64 string or binary
    const base64 = await readFileAsBase64(file)

    const form = new FormData()
    form.append('image', base64)
    form.append('name', `${Date.now()}_${file.name.replace(/\s+/g, '_')}`)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const url = `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`
    const res = await fetch(url, {
      method: 'POST',
      body: form,
      signal: controller.signal
    })
    clearTimeout(timeout)

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`imgbb upload failed: ${res.status} ${res.statusText} ${text}`)
    }

    const data = await res.json()
    const imageUrl: string | undefined = data?.data?.display_url || data?.data?.url
    if (!imageUrl) {
      throw new Error('imgbb response missing URL')
    }

    console.log('=== UPLOAD (imgbb) END ===')
    return imageUrl
  } catch (error: any) {
    console.error('=== UPLOAD ERROR (imgbb) ===')
    console.error(error)
    if (error?.name === 'AbortError') {
      throw new Error('Upload timed out. Please check your connection and try again.')
    }
    throw new Error(error?.message || 'Upload failed')
  }
}


