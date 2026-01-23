'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getDb } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Product } from '@/types/product'
import { useSiteConfig } from '@/lib/site-config'
import { ShoppingBag, MessageCircle, ArrowLeft, Package, CheckCircle, X, Heart } from 'lucide-react'
import Link from 'next/link'
import { useShop } from '@/context/ShopContext'
import Skeleton from '@/components/Skeleton'

export default function ProductDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const { config } = useSiteConfig()
    const { addToCart, toggleWishlist, isInWishlist } = useShop()

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return

            try {
                const db = getDb()
                if (!db) throw new Error("Database not initialized")

                const productDoc = await getDoc(doc(db, 'products', id as string))

                if (productDoc.exists()) {
                    setProduct({ id: productDoc.id, ...productDoc.data() } as Product)
                } else {
                    setError("Product not found")
                }
            } catch (err) {
                console.error("Error fetching product:", err)
                setError("Failed to load product")
            } finally {
                setIsLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
                    <Skeleton className="h-6 w-32 mb-8" />
                    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 md:gap-8">
                            <Skeleton className="md:col-span-2 aspect-square" />
                            <div className="md:col-span-3 p-8 md:p-10 space-y-6">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-12 w-3/4" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-10 w-32" />
                                    <Skeleton className="h-10 w-24" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                                <div className="pt-6 border-t border-gray-100 flex gap-3">
                                    <Skeleton className="flex-1 h-14 rounded-xl" />
                                    <Skeleton className="w-14 h-14 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        )
    }

    if (error || !product) {
        return (
            <main className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                        <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
                        <p className="text-gray-500 mb-6">The product you are looking for might have been removed or does not exist.</p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium"
                        >
                            <ArrowLeft size={18} />
                            Back to Shop
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        )
    }

    const whatsappNumber = config.contactPhone.replace(/\D/g, '')
    const message = encodeURIComponent(`Hi, I am interested in buying *${product.title}* listed for GH₵${product.price}`)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Shop
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
                >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-0 md:gap-8">
                        {/* Image Section */}
                        <div className="md:col-span-2 lg:col-span-2 relative aspect-square bg-gray-100 overflow-hidden group max-w-md mx-auto w-full">
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ShoppingBag size={80} className="opacity-30" />
                                </div>
                            )}
                            {!product.inStock && (
                                <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow-lg">
                                    OUT OF STOCK
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-purple-600 font-medium mb-4">
                                <Package size={18} />
                                <span>{product.category || 'Cleaning Product'}</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-3xl font-bold text-purple-600">
                                    GH₵{product.price.toFixed(2)}
                                </span>
                                {product.inStock ? (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                        <CheckCircle size={14} /> In Stock
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                        <X size={14} /> Out of Stock
                                    </span>
                                )}
                            </div>

                            <div className="prose text-gray-600 mb-8 max-w-none text-sm md:text-base">
                                <p>{product.description}</p>
                            </div>

                            <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-gray-100">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => addToCart(product)}
                                        disabled={!product.inStock}
                                        className={`
                                            flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-base transition-all duration-300
                                            ${product.inStock
                                                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/30'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                                        `}
                                    >
                                        <ShoppingBag size={20} />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => toggleWishlist(product)}
                                        className={`
                                            p-3 rounded-xl border-2 transition-all duration-300
                                            ${isInWishlist(product.id)
                                                ? 'border-red-500 text-red-500 bg-red-50'
                                                : 'border-gray-200 text-gray-400 hover:border-purple-600 hover:text-purple-600'}
                                        `}
                                    >
                                        <Heart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                    </button>
                                </div>

                                <a
                                    href={product.inStock ? whatsappUrl : '#'}
                                    target={product.inStock ? '_blank' : undefined}
                                    rel={product.inStock ? "noopener noreferrer" : undefined}
                                    className="flex items-center justify-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors text-sm"
                                >
                                    <MessageCircle size={16} />
                                    Or order directly via WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    )
}
