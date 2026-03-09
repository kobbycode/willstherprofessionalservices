'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
        <main className="min-h-screen bg-gray-50 flex flex-col pt-[56px] md:pt-[118px]">
            <Header />

            {/* Premium Hero Section */}
            <div className="relative bg-[#0F172A] text-white py-20 px-4 overflow-hidden">
                {/* Background animations */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-700" />
                </div>

                <div className="relative container mx-auto text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 text-sm font-medium text-red-300"
                    >
                        <Heart size={14} fill="currentColor" />
                        <span>My Favorites</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
                    >
                        Your Curated Collection
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-400 max-w-2xl mx-auto"
                    >
                        {wishlist.length > 0
                            ? `You have ${wishlist.length} premium item${wishlist.length === 1 ? '' : 's'} saved for later.`
                            : 'Save the products you love and they will appear here for easy access.'}
                    </motion.p>
                </div>
            </div>

            <div className="flex-grow py-16">
                <div className="container-custom">
                    <AnimatePresence mode="wait">
                        {wishlist.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="max-w-xl mx-auto text-center py-20 px-8 bg-white rounded-3xl shadow-premium border border-gray-100"
                            >
                                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <Heart size={48} className="text-red-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">No favorites yet</h2>
                                <p className="text-gray-500 mb-10 text-lg">
                                    Browse our shop and tap the heart icon to start building your personal collection of professional supplies.
                                </p>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 px-10 py-5 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/20 active:scale-95 group"
                                >
                                    <ShoppingBag size={20} className="group-hover:animate-bounce" />
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
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                        <div className="w-1 h-8 bg-red-500 rounded-full" />
                                        Saved Items
                                    </h2>
                                    <Link
                                        href="/shop"
                                        className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-2 group"
                                    >
                                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                        Continue Shopping
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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

            <Footer />
        </main>
    )
}
