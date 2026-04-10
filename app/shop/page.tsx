'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getDb } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/product'
import { useSiteConfig } from '@/lib/site-config'
import { Search, ShoppingBag, Filter } from 'lucide-react'
import Skeleton from '@/components/Skeleton'

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const { config } = useSiteConfig()

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category || 'General')))]

    useEffect(() => {
        const db = getDb()
        if (!db) return

        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))

        // Real-time listener for products
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[]
            setProducts(productsData)
            setFilteredProducts(productsData)
            setIsLoading(false)
        }, (err) => {
            console.error("Error fetching products:", err)
            setIsLoading(false)
        })

        return () => unsubscribe()
    }, [])

    useEffect(() => {
        let result = products

        if (searchTerm) {
            result = result.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (selectedCategory !== 'All') {
            result = result.filter(p => (p.category || 'General') === selectedCategory)
        }

        setFilteredProducts(result)
    }, [searchTerm, selectedCategory, products])

    return (
        <main className="min-h-screen bg-[#fafafa] pt-[56px] md:pt-[118px]">

            {/* Hero Section */}
            <div className="relative bg-white text-secondary-900 pt-20 pb-20 px-4 overflow-hidden border-b border-gray-100">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100/50 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-100/50 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse delay-700" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
                </div>

                <div className="relative container mx-auto text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-6 text-[10px] font-bold text-primary-600 uppercase tracking-widest shadow-sm"
                    >
                        <ShoppingBag size={12} />
                        <span>Professional Cleaning Supplies</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 tracking-tight text-secondary-900"
                    >
                        Our Premium <span className="text-primary-600 font-bold">Shop</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xs md:text-sm text-secondary-600 max-w-xl mx-auto leading-relaxed"
                    >
                        Equip yourself with the same high-performance products our professionals use.
                        Quality guaranteed for every surface.
                    </motion.p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-10 pb-24">
                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl shadow-secondary-900/5 border border-gray-100 p-4 md:p-5 mb-10"
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search our catalog..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50/50 border-none focus:ring-1 focus:ring-purple-200 outline-none transition-all text-sm text-gray-900 font-medium placeholder:text-gray-400"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar py-1">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`
                                        px-4 py-2 rounded-lg whitespace-nowrap transition-all font-semibold text-[11px] uppercase tracking-wider
                                        ${selectedCategory === category
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                            : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}
                                    `}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Results Header */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em]">
                        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                    </h2>
                    <div className="h-px flex-1 bg-gray-100 ml-6 hidden md:block" />
                </div>

                {/* Product Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-0">
                                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                                <div className="p-5 space-y-4">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-6 w-1/3" />
                                    <div className="flex gap-2 pt-2">
                                        <Skeleton className="flex-1 h-10 rounded-lg" />
                                        <Skeleton className="w-10 h-10 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                contactPhone={config.contactPhone}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm border-dashed">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-6 h-6 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                        <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6">
                            {searchTerm
                                ? `We couldn't find any products matching "${searchTerm}"`
                                : "Check back later for new professional supplies!"}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-purple-600 text-xs font-semibold hover:underline"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}
            </div>

        </main>
    )
}
