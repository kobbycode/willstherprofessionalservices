'use client'

import { Product } from '@/types/product'
import { motion } from 'framer-motion'
import { ShoppingBag, MessageCircle, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useShop } from '@/context/ShopContext'
import { useState, useEffect } from 'react'

interface ProductCardProps {
    product: Product
    contactPhone: string
}

export default function ProductCard({ product, contactPhone }: ProductCardProps) {
    const { addToCart, toggleWishlist, isInWishlist, setIsCartOpen } = useShop()
    const whatsappNumber = contactPhone.replace(/\D/g, '')
    const message = encodeURIComponent(`Hi, I am interested in buying *${product.title}* listed for GH₵${product.price}`)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    // Get images array - use images array if available, fallback to single imageUrl
    const productImages = product.images && product.images.length > 0
        ? product.images
        : product.imageUrl
            ? [product.imageUrl]
            : []

    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    // Reset selected image when product changes
    useEffect(() => {
        setSelectedImageIndex(0)
    }, [product.id])

    const currentImage = productImages[selectedImageIndex] || ''

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col"
        >
            {/* Image Section */}
            <Link href={`/shop/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100 cursor-pointer">
                {currentImage ? (
                    <Image
                        src={currentImage}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                        <ShoppingBag size={32} className="opacity-30" />
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        toggleWishlist(product)
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-300 ${isInWishlist(product.id)
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-110'
                        }`}
                >
                    <Heart size={14} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                </button>

                {/* Stock Badge */}
                {!product.inStock && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg backdrop-blur-sm">
                        OUT OF STOCK
                    </div>
                )}
            </Link>

            {/* Thumbnail Gallery - only show if multiple images */}
            {productImages.length > 1 && (
                <div className="flex gap-1 px-2 py-1.5 bg-gray-50 overflow-x-auto">
                    {productImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={`relative w-10 h-10 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${idx === selectedImageIndex
                                ? 'border-purple-500 shadow-sm'
                                : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${product.title} ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="40px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Content Section - More compact */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Category & Title */}
                <div className="mb-2">
                    {product.category && (
                        <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-1">
                            {product.category}
                        </p>
                    )}
                    <Link href={`/shop/${product.id}`} className="block group/title">
                        <h3 className="text-[13px] font-bold text-gray-900 line-clamp-2 leading-snug group-hover/title:text-purple-600 transition-colors">
                            {product.title}
                        </h3>
                    </Link>
                </div>

                {/* Price & Actions */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <span className="text-base font-black text-gray-900">
                        GH₵{product.price.toFixed(2)}
                    </span>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                addToCart(product)
                                setIsCartOpen(true)
                            }}
                            disabled={!product.inStock}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${product.inStock
                                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20 active:scale-90'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            title="Add to Cart"
                        >
                            <ShoppingBag size={16} />
                        </button>
                        <a
                            href={product.inStock ? whatsappUrl : '#'}
                            target={product.inStock ? '_blank' : undefined}
                            rel={product.inStock ? "noopener noreferrer" : undefined}
                            onClick={(e) => !product.inStock && e.preventDefault()}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${product.inStock
                                ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 active:scale-90'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            title="Order via WhatsApp"
                        >
                            <MessageCircle size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
