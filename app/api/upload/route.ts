import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyB4XxvcqkCGS6IgwkDQSKEr8XFKJgodCIU',
  authDomain: 'wilsther-profesional-services.firebaseapp.com',
  projectId: 'wilsther-profesional-services',
  storageBucket: 'wilsther-profesional-services.appspot.com',
  messagingSenderId: '484189314031',
  appId: '1:484189314031:web:cc4f556f31e37757eab41a',
  measurementId: 'G-BGVH0BFR5Y'
}

// Initialize Firebase for server-side
let app: any
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

const storage = getStorage(app)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const authHeader = request.headers.get('authorization')
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }
    
    // Verify the authorization header (you might want to verify the token here)
    const token = authHeader.replace('Bearer ', '')
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create a unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}_${file.name.replace(/\s+/g, '_')}`
    const path = `profile-pictures/${filename}`
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, buffer, {
      contentType: file.type
    })
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return NextResponse.json({ 
      success: true, 
      downloadURL,
      path 
    })
    
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error.message 
    }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
