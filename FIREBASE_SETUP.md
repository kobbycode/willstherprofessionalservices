# Firebase Setup Guide for Willsther Professional Services

## Current Issues Fixed

### 1. ✅ Firebase Configuration
- Fixed project ID typo: `wilsther-profesional-services` → `wilsther-professional-services`
- Fixed storage bucket typo: `wilsther-profesional-services.appspot.com` → `wilsther-professional-services.appspot.com`

### 2. ✅ Enhanced Error Handling
- Added retry logic for Firestore operations
- Improved error messages for better debugging
- Added fallback strategies for failed operations

### 3. ✅ Storage Upload Improvements
- Enhanced error handling for CORS issues
- Added timeout protection (30 seconds)
- Better error categorization and user feedback

## Required Firebase Setup Steps

### Step 1: Deploy CORS Configuration
To fix the CORS issues with Firebase Storage, run this command:

```bash
gsutil cors set cors.json gs://wilsther-professional-services.appspot.com
```

**Note:** You need `gsutil` installed and authenticated with your Firebase project.

### Step 2: Verify Firebase Project Settings
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `wilsther-professional-services`
3. Go to Storage → Rules
4. Ensure rules allow authenticated users to read/write
5. Go to Authentication → Settings → Authorized domains
6. Add: `willsther-professional-services.vercel.app`

### Step 3: Check Firestore Rules
Ensure your Firestore rules allow authenticated users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 4: Deploy Firebase Configuration
```bash
firebase deploy --only storage,firestore
```

## Testing the Fixes

### 1. Test Profile Updates
- Try updating profile information (name, phone, bio)
- Check if Firestore operations succeed
- Verify retry logic works for connection issues

### 2. Test Image Uploads
- Try uploading a profile picture
- Check console for detailed upload logs
- Verify CORS errors are resolved

### 3. Check Error Handling
- Monitor console for improved error messages
- Verify fallback strategies work
- Check if retry logic prevents failures

## Troubleshooting

### If CORS Issues Persist
1. Verify the CORS configuration was deployed correctly
2. Check if the domain is exactly correct in cors.json
3. Clear browser cache and try again

### If Firestore Still Fails
1. Check Firebase project status
2. Verify authentication is working
3. Check Firestore rules and quotas

### If Storage Uploads Fail
1. Verify storage bucket name is correct
2. Check if user has proper permissions
3. Monitor Firebase Storage quotas

## Support

If issues persist after following these steps, check:
1. Firebase project status: https://status.firebase.google.com/
2. Firebase documentation: https://firebase.google.com/docs
3. Console logs for detailed error information
