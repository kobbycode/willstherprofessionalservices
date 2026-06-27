'use client'

import { Product } from '@/types/product'
import { motion } from 'framer-motion'
import { ShoppingBag, MessageCircle, Heart, X } from 'lucide-react'
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
    let whatsappNumber = contactPhone.replace(/\D/g, '')
    if (whatsappNumber.startsWith('0') && whatsappNumber.length === 10) {
        whatsappNumber = '233' + whatsappNumber.substring(1)
    }
    const message = encodeURIComponent(`Hi, I am interested in buying *${product.title}* listed for GH₵${product.price}`)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    const productImages = product.images && product.images.length > 0
        ? product.images
        : product.imageUrl
            ? [product.imageUrl]
            : []

    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    useEffect(() => {
        setSelectedImageIndex(0)
    }, [product.id])

    const currentImage = productImages[selectedImageIndex] || ''

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col border border-[#E2E8F0]"
        >
            {/* Image Section */}
            <Link href={`/shop/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#F1F5F9] cursor-pointer">
                {currentImage ? (
                    <Image
                        src={currentImage}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#64748B] bg-[#F1F5F9]">
                        <ShoppingBag size={24} className="opacity-30" />
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        toggleWishlist(product)
                    }}
                    className={`absolute top-1.5 right-1.5 p-1.5 transition-all duration-300 ${isInWishlist(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-[#64748B] hover:bg-white hover:scale-110'
                        }`}
                >
                    <Heart size={12} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                </button>

                {/* Stock Badge */}
                {product.inStock ? (
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-semibold tracking-wider flex items-center gap-1">
                        <div className="w-1 h-1 bg-white" />
                        IN STOCK
                    </div>
                ) : (
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-semibold tracking-wider flex items-center gap-1">
                        <X size={8} strokeWidth={3} />
                        OUT OF STOCK
                    </div>
                )}
            </Link>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
                <div className="flex gap-1 px-1 py-0.5 bg-white overflow-x-auto border-b border-[#E2E8F0]">
                    {productImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={`relative w-8 h-8 flex-shrink-0 overflow-hidden border transition-all ${idx === selectedImageIndex
                                ? 'border-[#2563EB]'
                                : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${product.title} ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="32px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Content Section */}
            <div className="p-2.5 flex flex-col flex-grow">
                <div className="mb-1.5">
                    {product.category && (
                        <p className="text-[10px] font-semibold text-[#2563EB] uppercase tracking-[0.2em] mb-0.5">
                            {product.category}
                        </p>
                    )}
                    <Link href={`/shop/${product.id}`} className="block group/title">
                        <h3 className="text-[13px] font-semibold text-[#0F172A] line-clamp-2 leading-snug group-hover/title:text-[#2563EB] transition-colors">
                            {product.title}
                        </h3>
                    </Link>
                </div>

                {/* Price & Actions */}
                <div className="mt-auto pt-2 flex items-center justify-between border-t border-[#E2E8F0]">
                    <span className="text-[14px] font-bold text-[#0F172A] font-outfit">
                        GH₵{product.price.toFixed(2)}
                    </span>

                    <div className="flex gap-1">
                        <button
                            onClick={() => {
                                addToCart(product)
                                setIsCartOpen(true)
                            }}
                            disabled={!product.inStock}
                            className={`p-1.5 transition-all duration-300 ${product.inStock
                                ? 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white active:scale-95'
                                : 'bg-[#F1F5F9] text-[#64748B] cursor-not-allowed'
                                }`}
                            title="Add to Cart"
                        >
                            <ShoppingBag size={13} />
                        </button>
                        <a
                            href={product.inStock ? whatsappUrl : '#'}
                            target={product.inStock ? '_blank' : undefined}
                            rel={product.inStock ? "noopener noreferrer" : undefined}
                            onClick={(e) => !product.inStock && e.preventDefault()}
                            className={`p-1.5 transition-all duration-300 ${product.inStock
                                ? 'bg-green-500 hover:bg-green-600 text-white active:scale-95'
                                : 'bg-[#F1F5F9] text-[#64748B] cursor-not-allowed'
                                }`}
                            title="Order via WhatsApp"
                        >
                            <MessageCircle size={13} />
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
