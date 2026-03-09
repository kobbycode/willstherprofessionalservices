'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getDb } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
        <main className="min-h-screen bg-gray-50/50 pt-[56px] md:pt-[118px]">
            <Header />

            {/* Hero Section */}
            <div className="relative bg-[#0F172A] text-white pt-20 pb-24 px-4 overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-700" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
                </div>

                <div className="relative container mx-auto text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 text-sm font-medium text-purple-300"
                    >
                        <ShoppingBag size={14} />
                        <span>Professional Cleaning Supplies</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
                    >
                        Our Premium Shop
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Equip yourself with the same high-performance products our professionals use.
                        Quality guaranteed for every surface.
                    </motion.p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-10 pb-24">
                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-purple-900/10 border border-white p-4 md:p-6 mb-12"
                >
                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search our catalog..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-900 font-medium placeholder:text-gray-400"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar py-1">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`
                                        px-6 py-3 rounded-2xl whitespace-nowrap transition-all font-bold text-sm
                                        ${selectedCategory === category
                                            ? 'bg-purple-600 text-white shadow-xl shadow-purple-200 scale-105'
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
                <div className="flex justify-between items-center mb-8 px-2">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                    </h2>
                    <div className="h-px flex-1 bg-gray-100 mx-6 hidden md:block" />
                </div>

                {/* Product Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 p-0">
                                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                                <div className="p-6 space-y-4">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-8 w-1/3" />
                                    <div className="flex gap-3 pt-2">
                                        <Skeleton className="flex-1 h-12 rounded-xl" />
                                        <Skeleton className="w-12 h-12 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                contactPhone={config.contactPhone}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-xl border-dashed">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mb-8">
                            {searchTerm
                                ? `We couldn't find any products matching "${searchTerm}"`
                                : "Check back later for new professional supplies!"}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-purple-600 font-bold hover:underline"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    )
}
