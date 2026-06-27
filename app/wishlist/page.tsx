'use client'

import ProductCard from '@/components/ProductCard'
import { useShop } from '@/context/ShopContext'
import { useSiteConfig } from '@/lib/site-config'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function WishlistPage() {
    const { wishlist } = useShop()
    const { config } = useSiteConfig()

    return (
        <main className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px]">

            {/* Hero */}
            <div className="bg-white border-b border-[#E2E8F0] py-10 md:py-14">
                <div className="container-custom px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-left"
                    >
                        <span className="text-[#2563EB] font-semibold tracking-[0.2em] text-xs mb-2 block">
                            <Heart className="w-3 h-3 inline mr-1" fill="currentColor" />
                            FAVORITES
                        </span>
                        <h1 className="text-xl md:text-3xl font-bold text-[#0F172A] mb-2 tracking-tight">
                            Your Saved <span className="text-[#2563EB]">Items</span>
                        </h1>
                        <p className="text-[#64748B] text-sm max-w-lg leading-relaxed">
                            {wishlist.length > 0
                                ? `You have ${wishlist.length} item${wishlist.length === 1 ? '' : 's'} saved for later.`
                                : 'Products you love will appear here for easy access.'}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="py-8 md:py-10">
                <div className="container-custom px-4">
                    <AnimatePresence mode="wait">
                        {wishlist.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="max-w-md mx-auto text-center py-12 md:py-16 px-4 bg-white shadow-sm border border-[#E2E8F0]"
                            >
                                <div className="w-14 h-14 bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
                                    <Heart size={24} className="text-[#64748B]" />
                                </div>
                                <h2 className="text-base font-bold text-[#0F172A] mb-2">Your wishlist is empty</h2>
                                <p className="text-[#64748B] text-xs mb-6">
                                    Browse our shop and tap the heart icon to save products you love.
                                </p>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-semibold uppercase tracking-wider transition-all"
                                >
                                    <ShoppingBag size={14} />
                                    <span>Browse Shop</span>
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                                        <span className="w-0.5 h-4 bg-[#2563EB]" />
                                        Saved Items ({wishlist.length})
                                    </h2>
                                    <Link
                                        href="/shop"
                                        className="text-xs font-semibold text-[#2563EB] hover:text-[#1d4ed8] uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                                    >
                                        <ArrowLeft size={12} />
                                        Continue Shopping
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
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
