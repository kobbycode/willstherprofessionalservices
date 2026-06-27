'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getDb } from '@/lib/firebase'
import { doc, getDoc, collection, getDocs, query, where, limit } from 'firebase/firestore'
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
    Shield,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { useShop } from '@/context/ShopContext'
import Skeleton from '@/components/Skeleton'
import Image from 'next/image'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { toast } from 'react-hot-toast'

export default function ProductDetailClient() {
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
        if (!id) return

        const db = getDb()
        if (!db) return

        getDoc(doc(db, 'products', id as string)).then((snapshot) => {
            if (snapshot.exists()) {
                const productData = { id: snapshot.id, ...snapshot.data() } as Product
                setProduct(productData)

                if (productData.category) {
                    setRelatedLoading(true)
                    const relatedQuery = query(
                        collection(db, 'products'),
                        where('category', '==', productData.category),
                        limit(4)
                    )
                    getDocs(relatedQuery)
                        .then((relatedSnapshot) => {
                            const related = relatedSnapshot.docs
                                .map(doc => ({ id: doc.id, ...doc.data() } as Product))
                                .filter(p => p.id !== id)
                            setRelatedProducts(related)
                            setRelatedLoading(false)
                        })
                        .catch(() => setRelatedLoading(false))
                }
            } else {
                setError("Product not found")
            }
            setIsLoading(false)
        }).catch((err) => {
            setError("Failed to load product")
            setIsLoading(false)
        })
    }, [id])

    useEffect(() => {
        setSelectedImageIndex(0)
        setQuantity(1)
    }, [product?.id])

    let whatsappNumber = config.contactPhone.replace(/\D/g, '')
    if (whatsappNumber.startsWith('0') && whatsappNumber.length === 10) {
        whatsappNumber = '233' + whatsappNumber.substring(1)
    }
    const message = encodeURIComponent(`Hi, I am interested in buying *${product?.title}* listed for GH₵${product?.price}`)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    const productUrl = typeof window !== 'undefined' ? window.location.href : ''
    const shareText = encodeURIComponent(`Check out ${product?.title} - GH₵${product?.price}`)
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(productUrl)}`
    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`

    const handleAddToCart = () => {
        if (!product) return
        addToCart(product, quantity)
    }

    const handleMobileShare = async () => {
        const shareData = {
            title: product?.title || '',
            text: `Check out ${product?.title} - GH₵${product?.price}`,
            url: productUrl,
        }
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share(shareData)
            } catch {}
        } else {
            await navigator.clipboard.writeText(productUrl)
            toast.success('Link copied to clipboard')
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px]">
                <div className="container-custom py-6 md:py-10">
                    <Skeleton className="h-4 w-48 mb-6" />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                        <div className="lg:col-span-6">
                            <Skeleton className="aspect-square" />
                            <div className="flex gap-2 mt-3">
                                {[1, 2, 3, 4].map(i => (
                                    <Skeleton key={i} className="w-16 h-16 " />
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-6 space-y-4">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-8 w-3/4 " />
                            <Skeleton className="h-7 w-32 " />
                            <div className="space-y-2 pt-4">
                                <Skeleton className="h-4 w-full rounded" />
                                <Skeleton className="h-4 w-full rounded" />
                                <Skeleton className="h-4 w-2/3 rounded" />
                            </div>
                            <div className="pt-4 space-y-3">
                                <Skeleton className="h-12 w-full " />
                                <Skeleton className="h-12 w-full " />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (error || !product) {
        return (
            <main className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px]">
                <div className="container-custom py-16 md:py-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto bg-white  shadow-sm border border-[#E2E8F0] p-8 md:p-10"
                    >
                        <div className="w-14 h-14 bg-[#F1F5F9]  flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag size={28} className="text-[#64748B]" />
                        </div>
                        <h1 className="text-lg md:text-xl font-bold text-[#0F172A] mb-2">Product Not Found</h1>
                        <p className="text-[#64748B] text-sm mb-6 leading-relaxed">
                            The product you are looking for might have been removed or is no longer available.
                        </p>
                        <Link href="/shop" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white font-semibold text-sm  hover:bg-[#1d4ed8] transition-colors">
                            <ArrowLeft size={16} />
                            Back to Shop
                        </Link>
                    </motion.div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px] pb-24 md:pb-16">
            <div className="container-custom py-4 md:py-6">

                {/* Back + Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-4 md:mb-6"
                >
                    <Link
                        href="/shop"
                        className="flex items-center gap-1.5 text-[#64748B] hover:text-[#2563EB] transition-colors text-sm font-medium"
                    >
                        <ChevronLeft size={16} />
                        Back
                    </Link>
                    <span className="text-[#E2E8F0]">/</span>
                    <div className="flex items-center gap-1.5 text-xs md:text-sm text-[#64748B] overflow-x-auto no-scrollbar">
                        <Link href="/" className="hover:text-[#2563EB] transition-colors whitespace-nowrap">Home</Link>
                        <ChevronRight size={12} className="text-[#CBD5E1]" />
                        <Link href="/shop" className="hover:text-[#2563EB] transition-colors whitespace-nowrap">Shop</Link>
                        {product.category && (
                            <>
                                <ChevronRight size={12} className="text-[#CBD5E1]" />
                                <Link href={`/shop?category=${product.category}`} className="hover:text-[#2563EB] transition-colors whitespace-nowrap">{product.category}</Link>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Main Product Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-6"
                    >
                        <div className="relative aspect-square bg-white  overflow-hidden shadow-sm border border-[#E2E8F0] group">
                            {currentImage ? (
                                <Image
                                    key={currentImage}
                                    src={currentImage}
                                    alt={product.title}
                                    fill
                                    className="object-contain p-4 md:p-6 group-hover:scale-105 transition-transform duration-700"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#64748B]">
                                    <ShoppingBag size={60} className="opacity-20" />
                                </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                {!product.inStock && (
                                    <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] md:text-xs font-bold  shadow-sm">
                                        OUT OF STOCK
                                    </span>
                                )}
                                {product.category && (
                                    <span className="px-2.5 py-1 bg-[#2563EB] text-white text-[10px] md:text-xs font-bold  shadow-sm">
                                        {product.category}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {productImages.length > 1 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
                                {productImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden  border-2 transition-all duration-300 ${
                                            idx === selectedImageIndex
                                                ? 'border-[#2563EB] shadow-sm'
                                                : 'border-[#E2E8F0] hover:border-[#2563EB]/40'
                                        }`}
                                    >
                                        <Image src={img} alt={`${product.title} ${idx + 1}`} fill className="object-cover" sizes="80px" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-6 space-y-5"
                    >
                        {/* Eyebrow */}
                        <div>
                            <span className="text-[#2563EB] font-semibold tracking-[0.2em] text-[10px] md:text-xs block mb-2">
                                {product.category ? product.category.toUpperCase() : 'PRODUCT'}
                            </span>
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0F172A] tracking-tight leading-tight">
                                {product.title}
                            </h1>
                        </div>

                        {/* Price + Stock */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xl md:text-2xl font-bold text-[#2563EB]">
                                GH₵{product.price.toFixed(2)}
                            </span>
                            <div className="h-5 w-px bg-[#E2E8F0]" />
                            {product.inStock ? (
                                <span className="flex items-center gap-1.5 text-green-600 font-semibold bg-green-50 px-2.5 py-1 text-xs  border border-green-100">
                                    <CheckCircle size={14} /> In Stock
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-red-600 font-semibold bg-red-50 px-2.5 py-1 text-xs  border border-red-100">
                                    <X size={14} strokeWidth={3} /> Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="text-[#64748B] text-sm leading-relaxed border-l-4 border-[#2563EB]/20 pl-4 py-1">
                            <p className="whitespace-pre-line">{product.description}</p>
                        </div>

                        {/* Specifications */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="bg-white  border border-[#E2E8F0] overflow-hidden">
                                <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                    <h3 className="text-[10px] font-bold text-[#2563EB] uppercase tracking-[0.2em]">Specifications</h3>
                                </div>
                                <div className="divide-y divide-[#E2E8F0]">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between px-4 py-2">
                                            <span className="text-xs font-medium text-[#64748B] capitalize">{key.replace(/_/g, ' ')}</span>
                                            <span className="text-xs font-semibold text-[#0F172A]">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Desktop: Buy Box */}
                        <div className="hidden md:block space-y-3 pt-2">
                            {/* Quantity */}
                            <div>
                                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-1.5">Quantity</label>
                                <div className="inline-flex items-center p-1 bg-[#F1F5F9]  border border-[#E2E8F0]">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-9 h-9 flex items-center justify-center bg-white  border border-[#E2E8F0] text-[#64748B] hover:text-[#2563EB] transition-all disabled:opacity-50"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-sm text-[#0F172A]">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(20, quantity + 1))}
                                        className="w-9 h-9 flex items-center justify-center bg-white  border border-[#E2E8F0] text-[#64748B] hover:text-[#2563EB] transition-all"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 font-semibold text-sm  transition-all duration-300 ${
                                        product.inStock
                                            ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] active:scale-[0.98]'
                                            : 'bg-[#F1F5F9] text-[#64748B] cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingBag size={16} />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => toggleWishlist(product)}
                                    className={`w-11 h-11 flex items-center justify-center  border-2 transition-all duration-300 ${
                                        isInWishlist(product.id)
                                            ? 'border-red-500 text-red-500 bg-red-50'
                                            : 'border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB]'
                                    }`}
                                >
                                    <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                </button>
                            </div>

                            <a
                                href={product.inStock ? whatsappUrl : '#'}
                                target={product.inStock ? '_blank' : undefined}
                                rel={product.inStock ? "noopener noreferrer" : undefined}
                                className={`w-full flex items-center justify-center gap-2 py-3 px-5 font-semibold text-sm  transition-all ${
                                    product.inStock
                                        ? 'bg-green-50 text-green-600 border-2 border-green-200 hover:bg-green-500 hover:text-white'
                                        : 'bg-[#F1F5F9] text-[#64748B] cursor-not-allowed'
                                }`}
                            >
                                <MessageCircle size={16} />
                                Order via WhatsApp
                            </a>

                            {/* Benefits */}
                            <div className="bg-[#F8FAFC]  p-4 border border-[#E2E8F0] space-y-3">
                                <h3 className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">Why Choose WILLSTHER?</h3>
                                <div className="grid grid-cols-1 gap-2.5">
                                    {[
                                        { icon: Truck, title: 'Swift Delivery', desc: 'To your doorstep within 24h' },
                                        { icon: Shield, title: 'Service Trusted', desc: 'Professional grade quality' },
                                        { icon: RotateCcw, title: 'Easy Support', desc: 'Dedicated customer care' }
                                    ].map((benefit, i) => (
                                        <div key={i} className="flex gap-2.5 items-start">
                                            <div className="w-9 h-9 bg-white  flex items-center justify-center shadow-sm text-[#2563EB] flex-shrink-0">
                                                <benefit.icon size={16} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-[#0F172A]">{benefit.title}</h4>
                                                <p className="text-xs text-[#64748B]">{benefit.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Share */}
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Share</span>
                                <div className="flex items-center gap-2">
                                    {[
                                        { icon: Facebook, url: facebookShareUrl, color: 'text-blue-600' },
                                        { icon: Twitter, url: twitterShareUrl, color: 'text-sky-400' },
                                        { icon: Linkedin, url: linkedinShareUrl, color: 'text-blue-700' },
                                        { icon: MessageCircle, url: `https://wa.me/?text=${encodeURIComponent(`${product?.title} - GH₵${product?.price}\n${productUrl}`)}`, color: 'text-green-500' }
                                    ].map((social, i) => (
                                        <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className={`p-2  hover:bg-[#F1F5F9] transition-colors ${social.color}`}>
                                            <social.icon size={16} />
                                        </a>
                                    ))}
                                    <button
                                        onClick={() => navigator.clipboard.writeText(productUrl)}
                                        className="p-2  hover:bg-[#F1F5F9] transition-colors text-[#64748B] hover:text-[#2563EB]"
                                    >
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Related Products */}
                {(relatedProducts.length > 0 || relatedLoading) && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-10 md:mt-16 space-y-4 md:space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[#2563EB] font-semibold tracking-[0.2em] text-[10px] md:text-xs block mb-1">
                                    YOU MAY ALSO LIKE
                                </span>
                                <h3 className="text-lg md:text-xl font-bold text-[#0F172A] tracking-tight">
                                    Related Products
                                </h3>
                            </div>
                            <Link href="/shop" className="text-[#2563EB] font-semibold text-xs md:text-sm hover:underline whitespace-nowrap">
                                View All &rarr;
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            {relatedLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="bg-white  border border-[#E2E8F0] overflow-hidden animate-pulse">
                                        <div className="aspect-square bg-[#F1F5F9]" />
                                        <div className="p-3 space-y-2">
                                            <div className="h-3 bg-[#F1F5F9] w-3/4" />
                                            <div className="h-4 bg-[#F1F5F9] w-1/2" />
                                            <div className="flex gap-2 pt-1">
                                                <div className="flex-1 h-8 bg-[#F1F5F9] " />
                                                <div className="w-8 h-8 bg-[#F1F5F9] " />
                                            </div>
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
                    </motion.div>
                )}
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E2E8F0] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden">
                <div className="px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#2563EB]">
                            GH₵{product.price.toFixed(2)}
                        </span>
                        {product.inStock ? (
                            <span className="flex items-center gap-1 text-green-600 font-semibold text-xs">
                                <CheckCircle size={12} /> In Stock
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-red-600 font-semibold text-xs">
                                <X size={12} strokeWidth={3} /> Out of Stock
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Mobile Quantity */}
                        <div className="flex items-center p-1 bg-[#F1F5F9]  border border-[#E2E8F0]">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-8 flex items-center justify-center bg-white border border-[#E2E8F0] text-[#64748B] disabled:opacity-50"
                                disabled={quantity <= 1}
                            >
                                <Minus size={12} />
                            </button>
                            <span className="w-10 text-center font-bold text-sm text-[#0F172A]">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(20, quantity + 1))}
                                className="w-8 h-8 flex items-center justify-center bg-white border border-[#E2E8F0] text-[#64748B]"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.inStock}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 font-semibold text-sm  transition-all ${
                                product.inStock
                                    ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
                                    : 'bg-[#F1F5F9] text-[#64748B] cursor-not-allowed'
                            }`}
                        >
                            <ShoppingBag size={16} />
                            Buy
                        </button>
                        <button
                            onClick={() => toggleWishlist(product)}
                            className={`w-10 h-10 flex items-center justify-center  border-2 transition-all ${
                                isInWishlist(product.id)
                                    ? 'border-red-500 text-red-500 bg-red-50'
                                    : 'border-[#E2E8F0] text-[#64748B]'
                            }`}
                        >
                            <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                        </button>
                        <a
                            href={product.inStock ? whatsappUrl : '#'}
                            target={product.inStock ? '_blank' : undefined}
                            rel={product.inStock ? "noopener noreferrer" : undefined}
                            className={`w-10 h-10 flex items-center justify-center  transition-all ${
                                product.inStock
                                    ? 'bg-green-500 text-white'
                                    : 'bg-[#F1F5F9] text-[#64748B] cursor-not-allowed'
                            }`}
                        >
                            <MessageCircle size={16} />
                        </a>
                        <button
                            onClick={handleMobileShare}
                            className="w-10 h-10 flex items-center justify-center border border-[#E2E8F0] text-[#64748B] hover:text-[#2563EB] hover:border-[#2563EB] transition-all"
                        >
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
