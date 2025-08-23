# Admin Authentication Setup Guide

## Overview
The admin system has been upgraded from localStorage authentication to Firebase Authentication with Firestore for user management.

## Features
- ✅ **Firebase Authentication** - Secure user login/logout
- ✅ **Profile Management** - Update personal information
- ✅ **Password Changes** - Change password from profile page
- ✅ **Real-time Updates** - Changes reflect immediately across the system
- ✅ **Secure Storage** - User data stored in Firestore

## Setup Instructions

### 1. Firebase Configuration
Ensure your Firebase project is properly configured in `lib/firebase.ts`

### 2. Create Initial Admin User
Run the setup script to create the first admin user:

```bash
# Install dependencies if needed
npm install firebase

# Run the setup script
node scripts/setup-admin.js
```

**Default Admin Credentials:**
- Email: `admin@willsther.com`
- Password: `admin123`

### 3. Update Firebase Config
Edit `scripts/setup-admin.js` and add your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## How It Works

### Login Process
1. Admin enters email and password
2. Firebase authenticates the credentials
3. On success, redirects to admin dashboard
4. No more hardcoded credentials in the code

### Profile Management
1. **Basic Info**: Name, phone, bio, location, timezone
2. **Password Changes**: Current password + new password confirmation
3. **Notifications**: Email, push, SMS preferences
4. **Display Preferences**: Theme, compact mode, auto-save

### Password Changes
1. Admin enters current password for verification
2. Enters new password (minimum 8 characters)
3. Confirms new password
4. Firebase updates the password immediately
5. Old hardcoded credentials become invalid

## Security Features

- **Re-authentication**: Required before password changes
- **Strong Password Validation**: Minimum 8 characters
- **Secure Storage**: Passwords stored in Firebase Auth (not in code)
- **Session Management**: Automatic logout on auth state changes

## File Changes Made

### Updated Files:
- `app/admin/profile/page.tsx` - Added Firebase auth and password change
- `app/admin/login/page.tsx` - Switched to Firebase authentication
- `components/AdminAuth.tsx` - Updated to use Firebase auth state

### New Files:
- `scripts/setup-admin.js` - Admin user setup script
- `ADMIN_AUTH_SETUP.md` - This documentation

## Usage

### First Time Setup:
1. Run the setup script to create admin user
2. Login with the created credentials
3. Change password immediately for security

### Regular Usage:
1. Login with email/password
2. Access admin dashboard
3. Use profile page to update information
4. Change password as needed

### Password Changes:
1. Go to Profile → Security tab
2. Enter current password
3. Enter new password (8+ characters)
4. Confirm new password
5. Click "Change Password"

## Benefits

- **No Hardcoded Credentials** - Secure by default
- **Real-time Updates** - Changes apply immediately
- **Professional Authentication** - Industry-standard security
- **User Management** - Easy to add more admin users
- **Audit Trail** - Track changes and updates

## Troubleshooting

### Common Issues:
1. **Firebase not initialized** - Check `lib/firebase.ts`
2. **Authentication failed** - Verify Firebase config
3. **User not found** - Run setup script first
4. **Permission denied** - Check Firestore security rules

### Firestore Rules:
Ensure your Firestore rules allow access to the `users` collection:

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

## Next Steps

1. **Run the setup script** to create admin user
2. **Test login** with new credentials
3. **Change password** from profile page
4. **Verify old credentials** no longer work
5. **Customize profile** with your information

The system is now fully Firebase-powered and secure! 🚀
