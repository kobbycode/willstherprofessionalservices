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

    const whatsappNumber = config.contactPhone.replace(/\D/g, '')
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
        <main className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-5">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                    <Link href="/" className="hover:text-purple-600">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-purple-600">Shop</Link>
                    <span>/</span>
                    {product.category && (
                        <>
                            <Link href={`/shop?category=${product.category}`} className="hover:text-purple-600">{product.category}</Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-gray-900 truncate max-w-[200px]">{product.title}</span>
                </nav>

                {/* Main Product Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

                        {/* Image Gallery - Left Side */}
                        <div className="lg:col-span-5 p-5 bg-gray-50">
                            {/* Main Image */}
                            <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4 border border-gray-200">
                                {currentImage ? (
                                    <Image
                                        src={currentImage}
                                        alt={product.title}
                                        fill
                                        className="object-contain p-4"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ShoppingBag size={60} className="opacity-30" />
                                    </div>
                                )}
                                {!product.inStock && (
                                    <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded">
                                        OUT OF STOCK
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {productImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {productImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${idx === selectedImageIndex
                                                ? 'border-purple-600 ring-2 ring-purple-200'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Image src={img} alt={`${product.title} ${idx + 1}`} fill className="object-cover" sizes="64px" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info - Middle */}
                        <div className="lg:col-span-4 p-5 border-r border-gray-100">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                {product.title}
                            </h1>

                            {product.category && (
                                <p className="text-sm text-gray-500 mb-4">
                                    Category: <span className="text-purple-600 font-medium">{product.category}</span>
                                </p>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-2xl md:text-3xl font-bold text-purple-700">
                                    GH₵{product.price.toFixed(2)}
                                </span>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mb-5">
                                {product.inStock ? (
                                    <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                                        <CheckCircle size={16} /> In Stock
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-red-500 text-sm font-medium">
                                        <X size={16} /> Out of Stock
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="prose prose-sm text-gray-600 mb-6">
                                <p>{product.description}</p>
                            </div>

                            {/* Specifications */}
                            {product.specifications && Object.keys(product.specifications).length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Specifications</h3>
                                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <tbody>
                                                {Object.entries(product.specifications).map(([key, value], idx) => (
                                                    <tr key={idx} className={idx < Object.keys(product.specifications!).length - 1 ? 'border-b border-gray-200' : ''}>
                                                        <td className="py-2 px-3 font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</td>
                                                        <td className="py-2 px-3 text-gray-600">{value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Social Share */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">Share:</span>
                                <div className="flex gap-2">
                                    <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                                        <Facebook size={14} />
                                    </a>
                                    <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors">
                                        <Twitter size={14} />
                                    </a>
                                    <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors">
                                        <Linkedin size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Buy Box - Right Side (Sticky) */}
                        <div className="lg:col-span-3 p-5 bg-gray-50/50">
                            <div className="sticky top-24">
                                {/* Quantity Selector */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock}
                                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-all duration-300 mb-3 ${product.inStock
                                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <ShoppingBag size={20} />
                                    Add to Cart
                                </button>

                                {/* Wishlist Button */}
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium border-2 transition-all duration-300 mb-4 ${isInWishlist(product.id)
                                        ? 'border-red-500 text-red-500 bg-red-50'
                                        : 'border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600'
                                        }`}
                                >
                                    <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                    {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                                </button>

                                {/* WhatsApp Order */}
                                <a
                                    href={product.inStock ? whatsappUrl : '#'}
                                    target={product.inStock ? '_blank' : undefined}
                                    rel={product.inStock ? "noopener noreferrer" : undefined}
                                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-colors ${product.inStock
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <MessageCircle size={18} />
                                    Order via WhatsApp
                                </a>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Truck size={14} className="text-purple-600" />
                                        <span>Fast Delivery Available</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <RotateCcw size={14} className="text-purple-600" />
                                        <span>Easy Returns</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Shield size={14} className="text-purple-600" />
                                        <span>Secure Payment</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {(relatedProducts.length > 0 || relatedLoading) && (
                    <div className="mt-10">
                        <h2 className="text-lg font-bold text-gray-900 mb-5">Related Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedLoading ? (
                                // Loading skeletons
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 animate-pulse">
                                        <div className="aspect-square bg-gray-200" />
                                        <div className="p-3 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                relatedProducts.map((relatedProduct) => (
                                    <Link
                                        key={relatedProduct.id}
                                        href={`/shop/${relatedProduct.id}`}
                                        className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200"
                                    >
                                        <div className="relative aspect-square bg-gray-100">
                                            {relatedProduct.images && relatedProduct.images.length > 0 ? (
                                                <Image
                                                    src={relatedProduct.images[0]}
                                                    alt={relatedProduct.title}
                                                    fill
                                                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                />
                                            ) : relatedProduct.imageUrl ? (
                                                <Image
                                                    src={relatedProduct.imageUrl}
                                                    alt={relatedProduct.title}
                                                    fill
                                                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <ShoppingBag size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-purple-600 transition-colors">
                                                {relatedProduct.title}
                                            </h3>
                                            <p className="text-purple-700 font-bold">
                                                GH₵{relatedProduct.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </Link>
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
