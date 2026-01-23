'use client'

import { Product } from '@/types/product'
import { motion } from 'framer-motion'
import { ShoppingBag, MessageCircle } from 'lucide-react'
import Image from 'next/image'

interface ProductCardProps {
    product: Product
    contactPhone: string
}

export default function ProductCard({ product, contactPhone }: ProductCardProps) {
    const whatsappNumber = contactPhone.replace(/\D/g, '')
    const message = encodeURIComponent(`Hi, I am interested in buying *${product.title}* listed for GH₵${product.price}`)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                        <ShoppingBag size={48} className="opacity-50" />
                    </div>
                )}
                {!product.inStock && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                        OUT OF STOCK
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                        {product.title}
                    </h3>
                    <span className="text-purple-600 font-bold text-lg whitespace-nowrap ml-3">
                        ₵{product.price.toFixed(2)}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5em]">
                    {product.description}
                </p>

                <a
                    href={product.inStock ? whatsappUrl : '#'}
                    target={product.inStock ? '_blank' : undefined}
                    rel={product.inStock ? "noopener noreferrer" : undefined}
                    className={`
            flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200
            ${product.inStock
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
          `}
                >
                    <MessageCircle size={20} />
                    {product.inStock ? 'Order via WhatsApp' : 'Out of Stock'}
                </a>
            </div>
        </motion.div>
    )
}
