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
        <main className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-20 px-4">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                </div>

                <div className="relative container mx-auto text-center max-w-3xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                    >
                        Our Shop
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-200"
                    >
                        Quality cleaning products and supplies for professional results
                    </motion.p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 mb-12">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        <Filter size={20} className="text-gray-400 min-w-[20px]" />
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`
                  px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium text-sm
                  ${selectedCategory === category
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}
                `}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
                        <p className="text-gray-500">Loading shop...</p>
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
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500">
                            {searchTerm
                                ? `No results for "${searchTerm}"`
                                : "Check back later for new products!"}
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    )
}
