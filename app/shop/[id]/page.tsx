'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getDb } from '@/lib/firebase'
import { doc, getDoc, collection, getDocs, query, where, limit } from 'firebase/firestore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Product } from '@/types/product'
import { useSiteConfig } from '@/lib/site-config'
import {
    ShoppingBag,
    MessageCircle,
    ArrowLeft,
    CheckCircle,
    X,
    Heart,
    Share2,
    Facebook,
    Twitter,
    Linkedin,
    Minus,
    Plus,
    Truck,
    RotateCcw,
    Shield
} from 'lucide-react'
import Link from 'next/link'
import { useShop } from '@/context/ShopContext'
import Skeleton from '@/components/Skeleton'
import Image from 'next/image'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'

export default function ProductDetailPage() {
    const { id } = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
    const [relatedLoading, setRelatedLoading] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const { config } = useSiteConfig()
    const { addToCart, toggleWishlist, isInWishlist } = useShop()

    const productImages = product?.images && product.images.length > 0
        ? product.images
        : product?.imageUrl
            ? [product.imageUrl]
            : []

    const currentImage = productImages[selectedImageIndex] || ''

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return

            try {
                const db = getDb()
                if (!db) throw new Error("Database not initialized")

                const productDoc = await getDoc(doc(db, 'products', id as string))

                if (productDoc.exists()) {
                    const productData = { id: productDoc.id, ...productDoc.data() } as Product
                    setProduct(productData)

                    if (productData.category) {
                        setRelatedLoading(true)
                        const relatedQuery = query(
                            collection(db, 'products'),
                            where('category', '==', productData.category),
                            limit(4)
                        )
                        const relatedSnapshot = await getDocs(relatedQuery)
                        const related = relatedSnapshot.docs
                            .map(doc => ({ id: doc.id, ...doc.data() } as Product))
                            .filter(p => p.id !== id)
                        setRelatedProducts(related)
                        setRelatedLoading(false)
                    }
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

    useEffect(() => {
        setSelectedImageIndex(0)
        setQuantity(1)
    }, [product?.id])

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-6">
                    <Skeleton className="h-5 w-40 mb-6" />
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                            <Skeleton className="aspect-square rounded-lg" />
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-24 w-full" />
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
                    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                        <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
                        <h1 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h1>
                        <p className="text-gray-500 mb-6">The product you are looking for might have been removed.</p>
                        <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                            <ArrowLeft size={18} />
                            Back to Shop
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        )
    }

    let whatsappNumber = config.contactPhone.replace(/\D/g, '')
    if (whatsappNumber.startsWith('0') && whatsappNumber.length === 10) {
        whatsappNumber = '233' + whatsappNumber.substring(1)
    }
    const message = encodeURIComponent(`Hi, I am interested in buying *${product.title}* listed for GH₵${product.price}`)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    const productUrl = typeof window !== 'undefined' ? window.location.href : ''
    const shareText = encodeURIComponent(`Check out ${product.title} - GH₵${product.price}`)
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(productUrl)}`
    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50/50 pb-20">
            <Header />

            <div className="container mx-auto px-4 pt-28 pb-12">
                {/* Breadcrumb - Glassmorphism */}
                <motion.nav
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white shadow-sm text-xs md:text-sm text-gray-500 mb-8"
                >
                    <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
                    <span className="text-gray-300">/</span>
                    <Link href="/shop" className="hover:text-purple-600 transition-colors">Shop</Link>
                    {product.category && (
                        <>
                            <span className="text-gray-300">/</span>
                            <Link href={`/shop?category=${product.category}`} className="hover:text-purple-600 transition-colors">{product.category}</Link>
                        </>
                    )}
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-900 font-bold max-w-[150px] md:max-w-none truncate">{product.title}</span>
                </motion.nav>

                {/* Main Product Section - Premium Integrated Design */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-purple-900/5 border border-purple-50 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

                        {/* Image Gallery - Focused & Modern */}
                        <div className="lg:col-span-5 p-6 md:p-10 bg-gray-50/50">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-square bg-white rounded-3xl overflow-hidden mb-6 shadow-xl shadow-gray-200/50 border border-white group"
                            >
                                {currentImage ? (
                                    <Image
                                        src={currentImage}
                                        alt={product.title}
                                        fill
                                        className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                                        sizes="(max-width: 1024px) 100vw, 40vw"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ShoppingBag size={80} className="opacity-20" />
                                    </div>
                                )}

                                {/* Stock & Category Badges */}
                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    {!product.inStock && (
                                        <div className="px-4 py-2 bg-red-500 text-white text-xs font-black rounded-xl shadow-lg shadow-red-500/20 backdrop-blur-md">
                                            OUT OF STOCK
                                        </div>
                                    )}
                                    {product.category && (
                                        <div className="px-4 py-2 bg-purple-600 text-white text-xs font-black rounded-xl shadow-lg shadow-purple-500/20">
                                            {product.category.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Thumbnail selection with better styling */}
                            {productImages.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                                    {productImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${idx === selectedImageIndex
                                                ? 'border-purple-600 ring-4 ring-purple-100 scale-105'
                                                : 'border-white hover:border-purple-200'
                                                }`}
                                        >
                                            <Image src={img} alt={`${product.title} ${idx + 1}`} fill className="object-cover" sizes="80px" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Detail Content */}
                        <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
                                        {product.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <span className="text-4xl font-black text-purple-600">
                                            GH₵{product.price.toFixed(2)}
                                        </span>
                                        <div className="h-2 w-2 rounded-full bg-gray-200" />
                                        {product.inStock ? (
                                            <span className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl text-sm border border-green-100 shadow-sm">
                                                <CheckCircle size={18} /> Instantly Available
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2 text-red-600 font-black bg-red-50 px-4 py-2 rounded-xl text-sm border-2 border-red-500 shadow-lg shadow-red-200 animate-pulse">
                                                <X size={18} strokeWidth={3} /> Currently Unavailable
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="prose prose-lg text-gray-600 max-w-none border-l-4 border-purple-100 pl-6 py-2 leading-relaxed">
                                    <p className="whitespace-pre-line">{product.description}</p>
                                </div>

                                {/* Modernized Buy Box Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Select Quantity</label>
                                            <div className="inline-flex items-center p-2 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-200 hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
                                                    disabled={quantity <= 1}
                                                >
                                                    <Minus size={20} />
                                                </button>
                                                <span className="w-16 text-center font-black text-xl text-gray-900">{quantity}</span>
                                                <button
                                                    onClick={() => setQuantity(Math.min(20, quantity + 1))}
                                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-200 hover:shadow-md transition-all active:scale-95"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={handleAddToCart}
                                                disabled={!product.inStock}
                                                className={`flex-1 flex items-center justify-center gap-3 py-5 px-8 rounded-2xl font-black text-lg transition-all duration-300 transform ${product.inStock
                                                    ? 'bg-purple-600 text-white shadow-xl shadow-purple-200 hover:bg-purple-700 hover:-translate-y-1'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                <ShoppingBag size={24} />
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={() => toggleWishlist(product)}
                                                className={`w-18 h-18 flex items-center justify-center rounded-2xl border-4 transition-all duration-300 ${isInWishlist(product.id)
                                                    ? 'border-red-500 text-red-500 bg-red-50 shadow-lg shadow-red-200'
                                                    : 'border-gray-100 text-gray-300 hover:border-purple-600 hover:text-purple-600 hover:shadow-lg hover:shadow-purple-100'
                                                    }`}
                                            >
                                                <Heart size={28} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                            </button>
                                        </div>

                                        <a
                                            href={product.inStock ? whatsappUrl : '#'}
                                            target={product.inStock ? '_blank' : undefined}
                                            rel={product.inStock ? "noopener noreferrer" : undefined}
                                            className={`w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-bold transition-all ${product.inStock
                                                ? 'bg-green-500/10 text-green-600 border-2 border-green-500/20 hover:bg-green-500 hover:text-white hover:shadow-xl hover:shadow-green-100'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            <MessageCircle size={22} />
                                            Order via WhatsApp
                                        </a>
                                    </div>

                                    {/* Benefits/Specs Section */}
                                    <div className="space-y-6">
                                        <div className="bg-purple-50 rounded-[2rem] p-8 border border-purple-100 space-y-4">
                                            <h3 className="text-xs font-black text-purple-600 uppercase tracking-widest">Why Choose WILLSTHER?</h3>
                                            <div className="space-y-4">
                                                <div className="flex gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-purple-600">
                                                        <Truck size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900">Swift Delivery</h4>
                                                        <p className="text-xs text-gray-500">To your doorstep within 24h</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-purple-600">
                                                        <Shield size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900">Service Trusted</h4>
                                                        <p className="text-xs text-gray-500">Professional grade quality</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-purple-600">
                                                        <RotateCcw size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900">Easy Support</h4>
                                                        <p className="text-xs text-gray-500">Dedicated customer care</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Social Share - Minimal */}
                                        <div className="flex items-center justify-between px-2">
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Share Now</span>
                                            <div className="flex gap-4">
                                                {[
                                                    { icon: Facebook, url: facebookShareUrl, color: 'text-blue-600' },
                                                    { icon: Twitter, url: twitterShareUrl, color: 'text-sky-400' },
                                                    { icon: Linkedin, url: linkedinShareUrl, color: 'text-blue-700' }
                                                ].map((social, i) => (
                                                    <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className={`hover:scale-125 transition-transform ${social.color}`}>
                                                        <social.icon size={20} />
                                                    </a>
                                                ))}
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(productUrl)}
                                                    className="hover:scale-125 transition-transform text-gray-400 hover:text-purple-600"
                                                >
                                                    <Share2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Related Products - Using the new ProductCard for consistency */}
                {(relatedProducts.length > 0 || relatedLoading) && (
                    <div className="mt-24 space-y-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">You May Also Like</h2>
                            <div className="h-px flex-1 bg-gray-100 mx-10 hidden md:block" />
                            <Link href="/shop" className="text-purple-600 font-black hover:underline px-4 py-2 bg-purple-50 rounded-xl">View All</Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-0 animate-pulse">
                                        <div className="aspect-[4/3] bg-gray-100" />
                                        <div className="p-6 space-y-4">
                                            <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                                            <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                relatedProducts.map((relatedProduct) => (
                                    <ProductCard
                                        key={relatedProduct.id}
                                        product={relatedProduct}
                                        contactPhone={config.contactPhone}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    )
}
