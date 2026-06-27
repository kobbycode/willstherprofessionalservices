import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID!;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL!;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n');

const app = initializeApp({
    credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
    }),
    storageBucket: `${FIREBASE_PROJECT_ID}.firebasestorage.app`
});

async function syncGallery() {
    const storage = getStorage(app);
    const db = getFirestore(app);
    const bucket = storage.bucket();

    const [files] = await bucket.getFiles({ prefix: 'gallery/' });
    const galleryFiles = files.filter(f => f.name.match(/\.(jpg|jpeg|png|webp|gif)$/i));

    const newGalleryItems = [];
    for (const file of galleryFiles) {
        try {
            const [metadata] = await file.getMetadata();
            const downloadToken = metadata.metadata?.firebaseStorageDownloadTokens;

            let url: string;
            if (downloadToken) {
                const encodedName = encodeURIComponent(file.name);
                url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedName}?alt=media&token=${downloadToken}`;
            } else {
                await file.makePublic();
                url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
            }

            const rawName = file.name.split('/').pop() || '';
            const cleanName = rawName.replace(/^\d+_/, '').replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');

            newGalleryItems.push({
                id: `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                imageUrl: url,
                caption: cleanName || 'Gallery Image'
            });
        } catch (err) {
        }
    }

    const siteDoc = await db.collection('config').doc('site').get();
    const config = siteDoc.data() || {};
    const existingGallery = config.gallery || [];

    const existingUrls = new Set(existingGallery.map((g: any) => g.imageUrl));
    const toAdd = newGalleryItems.filter(item => !existingUrls.has(item.imageUrl));

    if (toAdd.length === 0) {
        return;
    }

    const mergedGallery = [...existingGallery, ...toAdd];

    await db.collection('config').doc('site').set(
        { gallery: mergedGallery },
        { merge: true }
    );
}

syncGallery().catch(() => {});
