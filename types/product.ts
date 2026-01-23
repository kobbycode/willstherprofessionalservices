
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category?: string;
    inStock: boolean;
    createdAt: any; // Firestore Timestamp
}
