'use client'

import { Product } from '@/types/product'
import { motion } from 'framer-motion'
import { ShoppingBag, MessageCircle, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useShop } from '@/context/ShopContext'

interface ProductCardProps {
    product: Product
    contactPhone: string
}

export default function ProductCard({ product, contactPhone }: ProductCardProps) {
    const { addToCart, toggleWishlist, isInWishlist } = useShop()
    const whatsappNumber = contactPhone.replace(/\D/g, '')
    const message = encodeURIComponent(`Hi, I am interested in buying *${product.title}* listed for GH₵${product.price}`)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
        >
            {/* Image Section */}
            <Link href={`/shop/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                        <ShoppingBag size={48} className="opacity-30" />
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        toggleWishlist(product)
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${isInWishlist(product.id)
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-110'
                        }`}
                >
                    <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                </button>

                {/* Stock Badge */}
                {!product.inStock && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                        OUT OF STOCK
                    </div>
                )}
            </Link>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Title & Price */}
                <Link href={`/shop/${product.id}`} className="block mb-3 group/title">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-1 group-hover/title:text-purple-600 transition-colors">
                        {product.title}
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-purple-600">
                            GH₵{product.price.toFixed(2)}
                        </span>
                        {product.category && (
                            <span className="text-xs text-gray-500 font-medium">
                                {product.category}
                            </span>
                        )}
                    </div>
                </Link>

                {/* Action Buttons */}
                <div className="mt-auto flex gap-2">
                    <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold text-sm transition-all duration-300 ${product.inStock
                                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <ShoppingBag size={16} />
                        Add to Cart
                    </button>
                    <a
                        href={product.inStock ? whatsappUrl : '#'}
                        target={product.inStock ? '_blank' : undefined}
                        rel={product.inStock ? "noopener noreferrer" : undefined}
                        onClick={(e) => !product.inStock && e.preventDefault()}
                        className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 ${product.inStock
                                ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        title="Order via WhatsApp"
                    >
                        <MessageCircle size={18} />
                    </a>
                </div>
            </div>
        </motion.div>
    )
}
