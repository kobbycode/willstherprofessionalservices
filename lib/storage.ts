'use client'

import { getStorageClient } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function uploadImage(file: File, pathPrefix = 'uploads'): Promise<string> {
  const storage = getStorageClient()
  const key = `${pathPrefix}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
  const r = ref(storage, key)
  const snap = await uploadBytes(r, file, { contentType: file.type })
  return await getDownloadURL(snap.ref)
}


