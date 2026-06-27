'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { getDb } from '@/lib/firebase'
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/product'
import { useSiteConfig } from '@/lib/site-config'
import { Search, ShoppingBag, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import Skeleton from '@/components/Skeleton'
import Link from 'next/link'

const PRODUCTS_PER_PAGE = 12

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [hideOutOfStock, setHideOutOfStock] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const { config } = useSiteConfig()

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category || 'General')))]

    useEffect(() => {
        const db = getDb()
        if (!db) return

        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(100))

        getDocs(q).then((snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[]
            setProducts(productsData)
            setFilteredProducts(productsData)
            setIsLoading(false)
        }).catch((err) => {
            setIsLoading(false)
        })
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

        if (hideOutOfStock) {
            result = result.filter(p => p.inStock !== false)
        }

        setFilteredProducts(result)
        setCurrentPage(1)
    }, [searchTerm, selectedCategory, hideOutOfStock, products])

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))
    const pageProducts = useMemo(() => {
        const start = (currentPage - 1) * PRODUCTS_PER_PAGE
        return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE)
    }, [filteredProducts, currentPage])

    return (
        <main className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px] pb-10 md:pb-16">

            {/* HERO HEADER */}
            <section className="bg-[#F8FAFC] py-6 md:py-8">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="text-[#2563EB] font-semibold tracking-[0.2em] text-[11px] mb-2 block">
                            SHOP COLLECTION
                        </span>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
                            Our Premium <span className="text-[#2563EB]">Shop</span>
                        </h1>
                        <p className="text-[#64748B] text-sm max-w-xl leading-relaxed">
                            Equip yourself with the same high-performance products our professionals use.
                            Quality guaranteed for every surface.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container-custom pb-16">
                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white shadow-sm border border-[#E2E8F0] p-3 md:p-4 mb-6"
                >
                    <div className="flex flex-col lg:flex-row gap-2 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Search our catalog..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8F0] text-sm text-[#0F172A] font-medium placeholder:text-[#64748B] outline-none transition-all focus:border-[#2563EB]"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto no-scrollbar py-1">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-3 py-1.5 whitespace-nowrap transition-all font-semibold text-xs uppercase tracking-wider
                                        ${selectedCategory === category
                                            ? 'bg-[#2563EB] text-white'
                                            : 'bg-white text-[#64748B] hover:bg-[#F1F5F9] border border-[#E2E8F0]'}
                                    `}
                                >
                                    {category}
                                </button>
                            ))}
                            <div className="w-px h-5 bg-[#E2E8F0] mx-1" />
                            <button
                                onClick={() => setHideOutOfStock(v => !v)}
                                className={`px-3 py-1.5 whitespace-nowrap transition-all font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 ${hideOutOfStock
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white text-[#64748B] hover:bg-[#F1F5F9] border border-[#E2E8F0]'}`}
                            >
                                <Filter size={12} />
                                {hideOutOfStock ? 'In Stock Only' : 'Show All'}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Results Count */}
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.2em]">
                        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                    </h2>
                    <div className="h-px flex-1 bg-[#E2E8F0] ml-4 hidden md:block" />
                </div>

                {/* Product Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white border border-[#E2E8F0] p-0">
                                <Skeleton className="aspect-[4/3] w-full" />
                                <div className="p-3 space-y-3">
                                    <Skeleton className="h-3 w-3/4" />
                                    <Skeleton className="h-5 w-1/3" />
                                    <div className="flex gap-2 pt-1">
                                        <Skeleton className="flex-1 h-8" />
                                        <Skeleton className="w-8 h-8" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {pageProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    contactPhone={config.contactPhone}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-1.5 mt-8">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB]"
                                >
                                    <ChevronLeft size={12} />
                                    Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 text-[11px] font-semibold transition-all border ${page === currentPage
                                            ? 'bg-[#2563EB] text-white border-[#2563EB]'
                                            : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB]'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB]"
                                >
                                    Next
                                    <ChevronRight size={12} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-10 md:py-14 bg-white border border-[#E2E8F0] shadow-sm">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F1F5F9] flex items-center justify-center mx-auto mb-2">
                            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-[#64748B]" />
                        </div>
                        <h3 className="text-sm font-bold text-[#0F172A] mb-1">No products found</h3>
                        <p className="text-xs text-[#64748B] max-w-xs mx-auto mb-3">
                            {searchTerm
                                ? `We couldn't find any products matching "${searchTerm}"`
                                : "Check back later for new professional supplies!"}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-[#2563EB] text-xs font-semibold py-2"
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
