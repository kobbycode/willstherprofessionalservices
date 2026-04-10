import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    console.error('Missing Firebase Admin environment variables.');
    process.exit(1);
}

const app = initializeApp({
    credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
    }),
    storageBucket: `${FIREBASE_PROJECT_ID}.firebasestorage.app`
});

async function reconcile() {
    const storage = getStorage(app);
    const db = getFirestore(app);

    console.log('--- Fetching Storage Files ---');
    const [files] = await storage.bucket().getFiles({ prefix: '' });
    const storageUrls = await Promise.all(
        files
            .filter(f => f.name.match(/\.(jpg|jpeg|png|webp|gif)$/i))
            .map(async f => {
                // Construct public URL or get signed URL
                // Client app uses public download URLs. 
                // For simplicity in listing, we'll just log names first.
                return {
                    name: f.name,
                    size: f.metadata.size,
                    updated: f.metadata.updated
                };
            })
    );
    console.log(`Found ${storageUrls.length} images in storage.`);

    console.log('\n--- Fetching Firestore Config ---');
    const siteDoc = await db.collection('config').doc('site').get();
    const config = siteDoc.data() || {};
    const gallery = config.gallery || [];
    const galleryUrls = gallery.map((item: any) => item.imageUrl);

    console.log(`Commonly tracked gallery items: ${gallery.length}`);

    console.log('\n--- Discrepancies ---');
    const missingInFirestore = storageUrls.filter(s => {
        // This is tricky because storage names != full URLs.
        // We check if the filename exists within any of the gallery URLs.
        return !galleryUrls.some((url: string) => url.includes(encodeURIComponent(s.name).replace(/%2F/g, '/')));
    });

    console.log(`Images in Storage NOT in Gallery Config: ${missingInFirestore.length}`);
    missingInFirestore.forEach(m => console.log(` - ${m.name}`));

    if (missingInFirestore.length > 0) {
        console.log('\nProposed Gallery Additions (JSON snippet):');
        const additions = missingInFirestore.map(m => {
            const encodedName = encodeURIComponent(m.name).replace(/%2F/g, '/');
            const url = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_PROJECT_ID}.firebasestorage.app/o/${encodedName}?alt=media`;
            return {
                id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                imageUrl: url,
                caption: m.name.split('/').pop()?.split('_').slice(1).join(' ').split('.')[0] || 'Gallery Image'
            };
        });
        console.log(JSON.stringify(additions, null, 2));
    }
}

reconcile().catch(console.error);
