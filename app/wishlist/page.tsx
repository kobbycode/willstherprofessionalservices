'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { useShop } from '@/context/ShopContext'
import { useSiteConfig } from '@/lib/site-config'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function WishlistPage() {
    const { wishlist } = useShop()
    const { config } = useSiteConfig()

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <div className="flex-grow pt-32 pb-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <Heart className="text-red-500 fill-red-500" />
                            My Wishlist
                        </h1>
                        <p className="text-gray-600 text-lg">
                            {wishlist.length > 0
                                ? `You have ${wishlist.length} item${wishlist.length === 1 ? '' : 's'} in your wishlist`
                                : 'Keep track of products you love'}
                        </p>
                    </motion.div>

                    {wishlist.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto"
                        >
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart size={48} className="text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                Browse our shop and tap the heart icon to save items you're interested in.
                            </p>
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-lg hover:shadow-purple-500/30"
                            >
                                Browse Shop
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {wishlist.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    contactPhone={config.contactPhone}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    )
}
