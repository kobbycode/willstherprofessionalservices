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

    // 1. Get all images specifically in the gallery/ folder
    console.log('--- Step 1: Listing gallery/ images in Storage ---');
    const [files] = await bucket.getFiles({ prefix: 'gallery/' });
    const galleryFiles = files.filter(f => f.name.match(/\.(jpg|jpeg|png|webp|gif)$/i));
    console.log(`Found ${galleryFiles.length} gallery images in Storage.\n`);

    // 2. Get download URLs for each (using the token-based URL the client SDK generates)
    console.log('--- Step 2: Generating download URLs ---');
    const newGalleryItems = [];
    for (const file of galleryFiles) {
        try {
            // Get the file metadata to find the download token
            const [metadata] = await file.getMetadata();
            const downloadToken = metadata.metadata?.firebaseStorageDownloadTokens;

            let url: string;
            if (downloadToken) {
                // Use the token-based URL (same format as client SDK getDownloadURL)
                const encodedName = encodeURIComponent(file.name);
                url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedName}?alt=media&token=${downloadToken}`;
            } else {
                // Generate a signed URL as fallback (or make file public)
                await file.makePublic();
                url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
            }

            // Extract a readable caption from the filename
            const rawName = file.name.split('/').pop() || '';
            // Remove the timestamp prefix (e.g., "1773575899340_")
            const cleanName = rawName.replace(/^\d+_/, '').replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');

            newGalleryItems.push({
                id: `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                imageUrl: url,
                caption: cleanName || 'Gallery Image'
            });

            console.log(`  ✅ ${file.name} → ${cleanName}`);
        } catch (err) {
            console.error(`  ❌ Failed for ${file.name}:`, err);
        }
    }

    console.log(`\nGenerated ${newGalleryItems.length} gallery entries.\n`);

    // 3. Read existing Firestore config
    console.log('--- Step 3: Reading existing Firestore config ---');
    const siteDoc = await db.collection('config').doc('site').get();
    const config = siteDoc.data() || {};
    const existingGallery = config.gallery || [];
    console.log(`Existing gallery entries in Firestore: ${existingGallery.length}`);

    // 4. Deduplicate - don't add items whose image URL is already tracked
    const existingUrls = new Set(existingGallery.map((g: any) => g.imageUrl));
    const toAdd = newGalleryItems.filter(item => !existingUrls.has(item.imageUrl));
    console.log(`New items to add (after dedup): ${toAdd.length}\n`);

    if (toAdd.length === 0) {
        console.log('✅ Gallery is already in sync. Nothing to do.');
        return;
    }

    // 5. Merge and write back
    const mergedGallery = [...existingGallery, ...toAdd];
    console.log(`--- Step 4: Writing ${mergedGallery.length} total gallery items to Firestore ---`);

    await db.collection('config').doc('site').set(
        { gallery: mergedGallery },
        { merge: true }
    );

    console.log(`\n✅ SUCCESS! Synced ${toAdd.length} new gallery images to Firestore.`);
    console.log(`Total gallery items now: ${mergedGallery.length}`);
    console.log('\nRefresh the website to see the changes.');
}

syncGallery().catch(console.error);
