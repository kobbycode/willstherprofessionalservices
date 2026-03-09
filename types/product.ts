
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string; // Legacy single image field (kept for backwards compatibility)
    images?: string[]; // New array of images for gallery support
    category?: string;
    inStock: boolean;
    createdAt: any; // Firestore Timestamp
}
