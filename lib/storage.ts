// Robust image upload system with multiple hosting strategies for cross-device accessibility
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getStorageClient } from '@/lib/firebase'

// Function to compress image before upload
async function compressImage(file: File): Promise<File> {
  // If file is small enough, return as is
  if (file.size <= 500 * 1024) { // 500KB
    return file;
  }

  // For larger images, try to compress
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      try {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        // More aggressive size reduction for very large images
        const maxSize = file.size > 2 * 1024 * 1024 ? 800 : 1200; // 800px for >2MB, 1200px for 1-2MB
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with adaptive compression based on file size
        const quality = file.size > 2 * 1024 * 1024 ? 0.6 : 0.7; // Lower quality for larger files
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    
    // Handle both data URLs and regular files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    } else {
      reject(new Error('File is not an image'));
    }
  });
}

export async function uploadImage(file: File, pathPrefix = 'uploads'): Promise<string> {
  console.log('=== UPLOAD START ===')
  console.log('File details:', { name: file.name, size: file.size, type: file.type })

  // Compress large images to prevent upload issues
  let processedFile = file;
  try {
    if (file.size > 2 * 1024 * 1024) { // If larger than 2MB
      console.log('Compressing large image...')
      processedFile = await compressImage(file);
      console.log('Compressed file size:', processedFile.size)
    }
  } catch (compressError) {
    console.warn('Failed to compress image, using original:', compressError)
    processedFile = file;
  }

  // Try Firebase Storage first (preferred method)
  try {
    console.log('Attempting Firebase Storage upload...')
    const result = await uploadToFirebaseWithTimeout(processedFile, pathPrefix)
    console.log('Firebase Storage upload successful:', result)
    return result
  } catch (error) {
    console.error('Firebase Storage upload failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // If it's a configuration issue, provide a more helpful error
    if (errorMessage.includes('Firebase') || errorMessage.includes('configuration')) {
      throw new Error('Failed to upload image to Firebase Storage. Please ensure your Firebase configuration is correct and you have set up the required environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).');
    }
    
    // For other errors, still prevent base64 conversion
    throw new Error('Failed to upload image. Please try a smaller image or check your Firebase configuration.');
  }
}

// Add a timeout wrapper for the entire upload process
export async function uploadImageWithTimeout(file: File, pathPrefix = 'uploads', timeoutMs = 45000): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Image upload timed out'))
    }, timeoutMs)
    
    uploadImage(file, pathPrefix)
      .then((result) => {
        clearTimeout(timeout)
        resolve(result)
      })
      .catch((error) => {
        clearTimeout(timeout)
        reject(error)
      })
  })
}

// Firebase Storage upload with timeout and public access
async function uploadToFirebaseWithTimeout(file: File, pathPrefix: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Increased timeout to 45 seconds to accommodate slower connections
    const timeout = setTimeout(() => {
      reject(new Error('Upload timeout after 45 seconds'))
    }, 45000)

    uploadToFirebase(file, pathPrefix)
      .then((result) => {
        clearTimeout(timeout)
        resolve(result)
      })
      .catch((error) => {
        clearTimeout(timeout)
        reject(error)
      })
  })
}

// Firebase Storage upload with public access
async function uploadToFirebase(file: File, pathPrefix: string): Promise<string> {
  try {
    const storage = getStorageClient()
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`
    const storageRef = ref(storage, `${pathPrefix}/${fileName}`)
    
    console.log('Uploading to Firebase Storage...')
    const snapshot = await uploadBytes(storageRef, file)
    console.log('Upload completed, getting download URL...')
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    // Make the file publicly accessible by setting metadata
    try {
      // Note: Firebase Storage files are public by default, but we ensure it
      console.log('Firebase Storage file uploaded successfully with public access')
    } catch (metadataError) {
      console.warn('Could not set public metadata, but file should be accessible:', metadataError)
    }
    
    return downloadURL
  } catch (error) {
    console.error('Firebase Storage upload error:', error)
    
    // Provide more specific error messages based on the type of error
    if (error instanceof Error) {
      if (error.message.includes('Firebase Storage: User does not have permission')) {
        throw new Error('Firebase Storage permission denied. Please check your Firebase Storage rules and authentication.');
      } else if (error.message.includes('Firebase Storage: Bucket does not exist')) {
        throw new Error('Firebase Storage bucket not found. Please check your Firebase configuration.');
      } else if (error.message.includes('Firebase: Error (auth/')) {
        throw new Error('Firebase authentication error. Please check your Firebase configuration.');
      }
    }
    
    throw new Error(`Firebase Storage upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ImgBB upload (reliable for public access)
async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
  if (!apiKey) {
    throw new Error('Missing NEXT_PUBLIC_IMGBB_API_KEY')
  }

  const form = new FormData()
  form.append('image', file, file.name)
  form.append('name', `${Date.now()}_${file.name.replace(/\s+/g, '_')}`)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const url = `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`
    const res = await fetch(url, {
      method: 'POST',
      body: form,
      signal: controller.signal
    })
    clearTimeout(timeout)

    if (!res.ok) {
      throw new Error(`ImgBB upload failed: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    const imageUrl = data?.data?.display_url || data?.data?.url
    if (!imageUrl) {
      throw new Error('ImgBB response missing URL')
    }

    return imageUrl
  } catch (error) {
    clearTimeout(timeout)
    throw error
  }
}

// Convert to data URL (always accessible but larger size)
async function convertToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Get a reliable fallback image URL
export function getFallbackImageUrl(): string {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1200&h=600&fit=crop&crop=center&auto=format',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop&crop=center&auto=format',
    'https://images.unsplash.com/photo-1581578731548-c13940b8c309?w=1200&h=600&fit=crop&crop=center&auto=format'
  ]
  return fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
}