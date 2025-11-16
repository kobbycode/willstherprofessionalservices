# Firebase Storage CORS Deployment Guide

## Step 1: Install Firebase Tools (if not installed)
```bash
npm install -g firebase-tools
```

## Step 2: Log in to Firebase
```bash
firebase login
```

## Step 3: Deploy CORS Configuration
```bash
firebase storage:set-cors cors.json
```

If the above command doesn't work, try:
```bash
firebase storage:bucket:wilsther-profesional-services.firebasestorage.app:set-cors cors.json
```

## Alternative Method: Using gsutil (Google Cloud SDK)

If you have Google Cloud SDK installed:

1. Authenticate:
```bash
gcloud auth login
```

2. Deploy CORS configuration:
```bash
gsutil cors set cors.json gs://wilsther-profesional-services.firebasestorage.app
```

## After Deployment

1. Restart your development server:
```bash
npm run dev
```

2. Try uploading an image again - the CORS error should be resolved.