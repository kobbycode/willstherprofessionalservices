import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert File to Blob for our upload function
    const arrayBuffer = await file.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: file.type })
    
    // Create a new File object (since we can't directly convert Blob to File in server context)
    const fileName = file.name
    const fileObj = new File([blob], fileName, { type: file.type })
    
    // Upload using our storage utility
    const url = await uploadImage(fileObj, 'api-test-uploads')
    
    return NextResponse.json({ 
      success: true, 
      url,
      fileName 
    })
  } catch (error: any) {
    console.error('Test upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Test upload endpoint. Use POST with form data containing a "file" field.' 
  })
}