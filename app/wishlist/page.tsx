'use client'

import ProductCard from '@/components/ProductCard'
import { useShop } from '@/context/ShopContext'
import { useSiteConfig } from '@/lib/site-config'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function WishlistPage() {
    const { wishlist, clearCart } = useShop() // wishlist is products
    const { config } = useSiteConfig()

    return (
        <main className="min-h-screen bg-white flex flex-col pt-[56px] md:pt-[118px]">

            {/* Premium Hero Section */}
            <div className="relative bg-white text-secondary-900 py-20 px-4 overflow-hidden border-b border-gray-100">
                {/* Background animations */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-50 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" />
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary-50 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse delay-700" />
                </div>

                <div className="relative container mx-auto text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-6 text-[12px] font-bold text-primary-600 uppercase tracking-widest shadow-sm"
                    >
                        <Heart size={12} fill="currentColor" className="text-primary-500" />
                        <span>My Favorites</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 tracking-tight text-secondary-900"
                    >
                        Your Curated <span className="text-primary-600 font-bold">Collection</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm md:text-base text-secondary-600 max-w-xl mx-auto leading-relaxed"
                    >
                        {wishlist.length > 0
                            ? `You have ${wishlist.length} premium item${wishlist.length === 1 ? '' : 's'} saved for later.`
                            : 'Save the products you love and they will appear here for easy access.'}
                    </motion.p>
                </div>
            </div>

            <div className="flex-grow py-12">
                <div className="container-custom">
                    <AnimatePresence mode="wait">
                        {wishlist.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="max-w-md mx-auto text-center py-16 px-8 bg-white rounded-2xl shadow-sm border border-gray-100"
                            >
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <Heart size={32} className="text-red-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">No favorites yet</h2>
                                <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                                    Browse our shop and tap the heart icon to start building your personal collection of professional supplies.
                                </p>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white text-sm font-semibold uppercase tracking-wider rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/10 active:scale-95 group"
                                >
                                    <ShoppingBag size={16} className="group-hover:animate-bounce" />
                                    <span>Start Shopping</span>
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                                        <div className="w-1 h-6 bg-red-500 rounded-full" />
                                        Saved Items
                                    </h2>
                                    <Link
                                        href="/shop"
                                        className="text-[13px] font-semibold text-purple-600 uppercase tracking-wider hover:text-purple-700 flex items-center gap-2 group"
                                    >
                                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                        Continue Shopping
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {wishlist.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            contactPhone={config.contactPhone}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    )
}
