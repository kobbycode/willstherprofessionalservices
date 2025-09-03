'use client'

// Uploads images to imgbb instead of Firebase Storage
// Requires NEXT_PUBLIC_IMGBB_API_KEY to be set at build time

// Note: imgbb supports raw binary in multipart 'image' field; no need to convert to base64

export async function uploadImage(file: File, _pathPrefix = 'uploads'): Promise<string> {
  try {
    console.log('=== UPLOAD (imgbb) START ===')
    console.log('File details:', { name: file.name, size: file.size, type: file.type })

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
    if (!apiKey) {
      throw new Error('Missing NEXT_PUBLIC_IMGBB_API_KEY')
    }
    const form = new FormData()
    form.append('image', file, file.name)
    form.append('name', `${Date.now()}_${file.name.replace(/\s+/g, '_')}`)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45000)

    const url = `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`
    const res = await fetch(url, {
      method: 'POST',
      body: form,
      signal: controller.signal
    })
    clearTimeout(timeout)

    let data: any
    try {
      data = await res.json()
    } catch {
      const text = await res.text().catch(() => '')
      throw new Error(`imgbb upload failed: ${res.status} ${res.statusText} ${text}`)
    }

    if (!res.ok) {
      const errMsg = data?.error?.message || data?.error || res.statusText
      throw new Error(`imgbb upload failed: ${res.status} ${errMsg}`)
    }
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


