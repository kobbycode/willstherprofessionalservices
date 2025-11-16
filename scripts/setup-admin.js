// Script to set up initial admin user
// Run this with: node scripts/setup-admin.js

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Your Firebase config - replace with your actual config
const firebaseConfig = {
  apiKey: 'AIzaSyB4XxvcqkCGS6IgwkDQSKEr8XFKJgodCIU',
  authDomain: 'wilsther-professional-services.firebaseapp.com',
  projectId: 'wilsther-professional-services',
  storageBucket: 'wilsther-professional-services.firebasestorage.app',
  messagingSenderId: '484189314031',
  appId: '1:484189314031:web:cc4f556f31e37757eab41a',
  measurementId: 'G-BGVH0BFR5Y'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setupAdmin() {
  try {
    // Create admin user
    const adminEmail = 'admin@willsther.com';
    const adminPassword = 'admin123'; // Change this to a secure password
    
    console.log('Creating admin user...');
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    console.log('Admin user created successfully:', user.uid);
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: 'Admin User',
      email: adminEmail,
      role: 'admin',
      phone: '+233 594 850 005',
      bio: 'System Administrator at Willsther Professional Services',
      location: 'Accra, Ghana',
      timezone: 'Africa/Accra',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      preferences: {
        theme: 'light',
        compactMode: false,
        autoSave: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Admin user document created in Firestore');
    console.log('Setup complete! You can now login with:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    
  } catch (error) {
    console.error('Error setting up admin:', error);
    if (error.code === 'auth/email-already-in-use') {
      console.log('Admin user already exists');
    }
  }
}

setupAdmin();
