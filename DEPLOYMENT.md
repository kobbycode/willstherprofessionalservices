# Deployment Guide - Willsther Professional Services

## 🚀 Vercel Deployment

### Prerequisites
- GitHub repository: https://github.com/kobbycode/willstherprofessionalservices.git
- Vercel account (free tier available)
- Firebase project configured

### Step 1: Connect to Vercel

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

### Step 2: Configure Environment Variables

In your Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB4XxvcqkCGS6IgwkDQSKEr8XFKJgodCIU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wilsther-profesional-services.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wilsther-profesional-services
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wilsther-profesional-services.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=484189314031
NEXT_PUBLIC_FIREBASE_APP_ID=1:484189314031:web:cc4f556f31e37757eab41a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-BGVH0BFR5Y
```

### Step 3: Firebase Configuration

1. **Update Firestore Rules** in Firebase Console:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{db}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

2. **Enable Authentication** in Firebase Console:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication

3. **Create Admin User** (if not already done):
   ```bash
   node scripts/setup-admin.js
   ```

### Step 4: Custom Domain (Optional)

1. **Add Custom Domain** in Vercel Dashboard:
   - Go to your project settings
   - Add your domain (e.g., willstherprofessionalservices.com)

2. **Update DNS Settings**:
   - Add CNAME record pointing to your Vercel deployment
   - Wait for DNS propagation (up to 48 hours)

### Step 5: Verify Deployment

1. **Test Website**: Visit your Vercel URL
2. **Test Admin Dashboard**: Visit `/admin`
   - Email: `admin@willsther.com`
   - Password: `admin123`
3. **Test Blog**: Visit `/blog`
4. **Test Contact Form**: Submit a test contact form

## 🔧 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **Firebase Errors**
   - Verify environment variables are set correctly
   - Check Firebase project settings
   - Ensure Firestore rules are updated

3. **Admin Dashboard Issues**
   - Verify admin user exists in Firebase
   - Check browser console for errors
   - Test with `/admin/bypass`

### Debug Pages

- `/test-login` - Test Firebase authentication
- `/debug-firebase` - Debug Firebase initialization
- `/admin/bypass` - Admin dashboard without auth

## 📊 Performance Optimization

### Vercel Settings

1. **Enable Edge Functions** for better performance
2. **Configure Caching** for static assets
3. **Enable Compression** for faster loading

### Next.js Optimization

1. **Image Optimization**: Using `next/image`
2. **Code Splitting**: Automatic with Next.js
3. **Static Generation**: Where possible

## 🔒 Security

1. **Environment Variables**: Never commit sensitive data
2. **Firebase Rules**: Configure proper security rules for production
3. **HTTPS**: Automatically enabled by Vercel

## 📈 Monitoring

1. **Vercel Analytics**: Enable in dashboard
2. **Error Tracking**: Monitor build and runtime errors
3. **Performance**: Use Vercel Speed Insights

## 🔄 Continuous Deployment

1. **GitHub Integration**: Automatic deployments on push
2. **Preview Deployments**: Test changes before production
3. **Rollback**: Easy rollback to previous versions

---

**Deployment URL**: https://willstherprofessionalservices.vercel.app
**GitHub Repository**: https://github.com/kobbycode/willstherprofessionalservices.git
