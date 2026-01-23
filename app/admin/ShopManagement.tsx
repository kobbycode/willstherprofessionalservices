'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, X, Search, ShoppingBag, DollarSign, Image as ImageIcon, CheckCircle, Package } from 'lucide-react'
import { getDb } from '@/lib/firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { uploadImage } from '@/lib/storage'
import { Product } from '@/types/product'

export default function ShopManagement() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({})
    const [searchTerm, setSearchTerm] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const db = getDb()
        if (!db) return

        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[]
            setProducts(productsData)
            setIsLoading(false)
        }, (err) => {
            console.error("Error fetching products:", err)
            setError("Failed to load products")
            setIsLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError('')

        try {
            const db = getDb()
            if (!db) throw new Error("Database not initialized")

            const productData = {
                title: currentProduct.title,
                description: currentProduct.description,
                price: Number(currentProduct.price),
                imageUrl: currentProduct.imageUrl,
                inStock: currentProduct.inStock ?? true,
                category: currentProduct.category || 'Cleaning',
                updatedAt: serverTimestamp()
            }

            if (currentProduct.id) {
                await updateDoc(doc(db, 'products', currentProduct.id), productData)
            } else {
                await addDoc(collection(db, 'products'), {
                    ...productData,
                    createdAt: serverTimestamp()
                })
            }

            setIsEditing(false)
            setCurrentProduct({})
        } catch (err: any) {
            console.error("Error saving product:", err)
            setError(err.message || "Failed to save product")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (productId: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return

        try {
            const db = getDb()
            if (!db) return
            await deleteDoc(doc(db, 'products', productId))
        } catch (err) {
            console.error("Error deleting product:", err)
            setError("Failed to delete product")
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsSaving(true)
        try {
            const url = await uploadImage(file, 'products')
            setCurrentProduct(prev => ({ ...prev, imageUrl: url }))
        } catch (err) {
            console.error("Error uploading image:", err)
            setError("Failed to upload image")
        } finally {
            setIsSaving(false)
        }
    }

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Shop Products</h2>
                    <p className="text-gray-400">Manage your products and inventory</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentProduct({ inStock: true })
                        setIsEditing(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 w-full"
                />
            </div>

            {error && (
                <div className="p-4 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-20 text-gray-400">Loading products...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredProducts.map(product => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors group"
                            >
                                <div className="aspect-square relative bg-black/20">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                            <ImageIcon size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setCurrentProduct(product)
                                                setIsEditing(true)
                                            }}
                                            className="p-2 bg-black/50 hover:bg-purple-600 text-white rounded-lg backdrop-blur-sm transition-colors"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 bg-black/50 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    {!product.inStock && (
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/80 text-white text-xs font-bold rounded backdrop-blur-sm">
                                            OUT OF STOCK
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-white line-clamp-1">{product.title}</h3>
                                        <span className="text-purple-400 font-bold whitespace-nowrap">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Package size={14} />
                                        <span>{product.category || 'Cleaning'}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Edit/Create Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-[#1a1a1a] w-full max-w-2xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-white/10">
                                <h3 className="text-xl font-bold text-white">
                                    {currentProduct.id ? 'Edit Product' : 'Add New Product'}
                                </h3>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Product Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={currentProduct.title || ''}
                                                onChange={e => setCurrentProduct(prev => ({ ...prev, title: e.target.value }))}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Price ($)</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                    value={currentProduct.price || ''}
                                                    onChange={e => setCurrentProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                            <input
                                                type="text"
                                                value={currentProduct.category || ''}
                                                onChange={e => setCurrentProduct(prev => ({ ...prev, category: e.target.value }))}
                                                placeholder="e.g. Detergents"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setCurrentProduct(prev => ({ ...prev, inStock: !prev.inStock }))}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${currentProduct.inStock
                                                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                                                    }`}
                                            >
                                                {currentProduct.inStock ? <CheckCircle size={18} /> : <X size={18} />}
                                                {currentProduct.inStock ? 'In Stock' : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Product Image</label>
                                            <div className="relative aspect-video bg-black/20 rounded-lg border border-white/10 overflow-hidden group">
                                                {currentProduct.imageUrl ? (
                                                    <img
                                                        src={currentProduct.imageUrl}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                                        <ImageIcon size={32} />
                                                        <span className="text-xs mt-2">No image selected</span>
                                                    </div>
                                                )}
                                                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                    <span className="text-white text-sm font-medium">Change Image</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {isSaving && !currentProduct.id && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                                        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                            <textarea
                                                required
                                                value={currentProduct.description || ''}
                                                onChange={e => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))}
                                                rows={4}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <ShoppingBag size={18} />
                                        )}
                                        {currentProduct.id ? 'Save Changes' : 'Create Product'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
