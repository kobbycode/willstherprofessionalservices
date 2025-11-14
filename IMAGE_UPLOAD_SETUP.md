# Image Upload Setup Guide

This guide explains how to set up image upload functionality in the Willsther Professional Services admin dashboard.

## How Image Upload Works

The system uses a multi-strategy approach for image hosting:

1. **Primary**: ImgBB API (most reliable for public access)
2. **Fallback**: Firebase Storage 
3. **Last Resort**: Data URL conversion (always accessible but larger size)

## Setup Instructions

### Option 1: ImgBB (Recommended)

1. Sign up for a free account at [https://imgbb.com/](https://imgbb.com/)
2. Go to your profile settings and find the API section
3. Copy your API key
4. Add the following to your `.env.local` file:
   ```
   NEXT_PUBLIC_IMGBB_API_KEY=your_actual_api_key_here
   ```

### Option 2: Firebase Storage (Already Configured)

Firebase Storage is already configured in the application. No additional setup is required if you have Firebase Admin credentials properly configured.

The storage bucket is set to: `wilsther-professional-services.appspot.com`

### Option 3: Direct Image URLs

You can always paste direct image URLs instead of uploading files. This works with any publicly accessible image.

## Using Image Upload in Admin Dashboard

1. Navigate to any section that supports images:
   - Hero Slides
   - Services
   - About Section
   - Gallery
   - Testimonials

2. Click the "Upload Image" button in any image section

3. Select an image file from your computer

4. The system will automatically:
   - Try to upload to ImgBB first (if API key is set)
   - Fall back to Firebase Storage if ImgBB fails
   - Convert to data URL if both methods fail

5. The image URL will be automatically saved to the appropriate Firestore document

## Troubleshooting

### "ImgBB API key not configured" Warning

If you see this warning, add your ImgBB API key to `.env.local` as described above.

### Firebase Storage Upload Failures

Ensure your Firebase Admin credentials are properly configured in `.env.local`:
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL  
- FIREBASE_PRIVATE_KEY

### Large Image Files

The system will reject images that are too large (>1MB). Consider:
- Compressing images before upload
- Using smaller resolution images
- Using direct URLs for very large images

## Technical Details

The upload logic is implemented in `lib/storage.ts` with the following priority:

1. ImgBB upload (requires API key)
2. Firebase Storage upload (requires admin credentials)
3. Data URL conversion (always works but increases document size)

All uploaded images are stored with timestamped filenames to prevent conflicts.