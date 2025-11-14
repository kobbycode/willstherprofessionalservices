# Willsther Professional Services

A modern, responsive website for Willsther Professional Services with an integrated admin dashboard for content management.

## 🚀 Features

- **Modern Website**: Responsive design with beautiful animations
- **Admin Dashboard**: Complete content management system
- **Blog Management**: Create, edit, and manage blog posts
- **User Management**: Admin and editor role management
- **Contact Form**: Manage contact submissions
- **Website Settings**: Dynamic configuration management
- **Image Upload**: Multi-strategy image hosting (ImgBB, Firebase Storage, Data URLs)
- **Firebase Integration**: Real-time database and authentication
- **SEO Optimized**: Meta tags, sitemap, and structured data

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kobbycode/willstherprofessionalservices.git
   cd willstherprofessionalservices
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Update Firestore rules
   - Run the admin setup script:
   ```bash
   node scripts/setup-admin.js
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔧 Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication with Email/Password
   - Enable Firestore Database

2. **Update Firestore Rules**
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

3. **Set up Admin User**
   ```bash
   node scripts/setup-admin.js
   ```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Login: `vercel login`
   - Deploy: `vercel --prod`

2. **Environment Variables**
   Set the same environment variables in Vercel dashboard

3. **Custom Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Update DNS settings

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── blog/              # Blog pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
├── lib/                   # Utility functions
├── public/                # Static assets
├── scripts/               # Setup scripts
└── vercel.json           # Vercel configuration
```

## 🔐 Admin Access

- **URL**: `/admin`
- **Email**: `admin@willsther.com`
- **Password**: `admin123`

## 🎨 Customization

### Colors and Branding
Update the Tailwind configuration in `tailwind.config.js`

### Content Management
Use the admin dashboard to manage:
- Blog posts
- Website settings
- User management
- Contact submissions

### Firebase Configuration
Update Firebase settings in `lib/firebase.ts`

## 📷 Image Upload Setup

The system supports multiple image hosting strategies:

1. **ImgBB** (Primary) - Requires API key
2. **Firebase Storage** (Fallback) - Uses Firebase credentials
3. **Data URLs** (Last Resort) - Converts images to base64

### ImgBB Setup
1. Sign up at [imgbb.com](https://imgbb.com/)
2. Get your API key from profile settings
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_IMGBB_API_KEY=your_api_key_here
   ```

### Firebase Storage
Already configured with your Firebase project.

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔍 SEO Features

- Meta tags optimization
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt
- Open Graph tags
- Twitter cards

## 🚨 Troubleshooting

### Common Issues

1. **Firebase Initialization Error**
   - Check environment variables
   - Verify Firebase project settings

2. **Admin Dashboard Loading**
   - Check browser console for errors
   - Verify admin user exists
   - Test with `/admin/bypass`

3. **Build Errors**
   - Clear `.next` directory
   - Run `npm run build` locally first

### Debug Pages

- `/test-login` - Test Firebase authentication
- `/debug-firebase` - Debug Firebase initialization
- `/admin/bypass` - Admin dashboard without auth

## 📄 License

This project is proprietary to Willsther Professional Services.

## 🤝 Support

For support, contact:
- Email: willstherprofessionalservices@gmail.com
- Phone: (233) 594 850 005

---

**Built with ❤️ for Willsther Professional Services**
