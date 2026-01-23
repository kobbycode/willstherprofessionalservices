'use client'

import { Product } from '@/types/product'
import { motion } from 'framer-motion'
import { ShoppingBag, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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
            className="group bg-white rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 border border-gray-100 flex flex-col h-full"
        >
            <Link href={`/shop/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100 cursor-pointer">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
            </Link>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <Link href={`/shop/${product.id}`} className="hover:text-purple-600 transition-colors">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                            {product.title}
                        </h3>
                    </Link>
                    <span className="text-primary-600 font-bold text-lg whitespace-nowrap ml-3">
                        GH₵{product.price.toFixed(2)}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5em] flex-grow">
                    {product.description}
                </p>

                <div className="mt-auto pt-4 flex gap-3">
                    <Link
                        href={`/shop/${product.id}`}
                        className="flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
                    >
                        View Details
                    </Link>
                    <a
                        href={product.inStock ? whatsappUrl : '#'}
                        target={product.inStock ? '_blank' : undefined}
                        rel={product.inStock ? "noopener noreferrer" : undefined}
                        className={`
                            flex items-center justify-center p-3 rounded-xl transition-all duration-200
                            ${product.inStock
                                ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                        `}
                        title="Order via WhatsApp"
                    >
                        <MessageCircle size={20} />
                    </a>
                </div>
            </div>
        </motion.div>
    )
}
