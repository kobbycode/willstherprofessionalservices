'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Edit,
    Trash2,
    X,
    Search,
    ShoppingBag,
    DollarSign,
    Image as ImageIcon,
    CheckCircle,
    Package,
    TrendingUp,
    BarChart2,
    PieChart as PieIcon,
    ArrowUpRight,
    Tag,
    Layers,
    AlertCircle
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts'
import { getDb } from '@/lib/firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { uploadImage } from '@/lib/storage'
import { Product } from '@/types/product'
import Skeleton from '@/components/Skeleton'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'
import Image from 'next/image'

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899']

export default function ShopManagement() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({})
    const [searchTerm, setSearchTerm] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const { user: currentUser } = useAuth()
    const isSuperAdmin = currentUser?.role === 'super_admin'

    useEffect(() => {
        const db = getDb()
        if (!db) return

        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[]
            setProducts(productsData)
            setIsLoading(false)
        }, (err) => {
            console.error("Error fetching products:", err)
            toast.error("Failed to load products")
            setIsLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [products, searchTerm])

    const stats = useMemo(() => ({
        total: products.length,
        inStock: products.filter(p => p.inStock).length,
        outOfStock: products.filter(p => !p.inStock).length,
        totalValue: products.reduce((sum, p) => sum + (p.price || 0), 0)
    }), [products])

    const categoryData = useMemo(() => {
        const counts: Record<string, number> = {}
        products.forEach(p => {
            const cat = p.category || 'Other'
            counts[cat] = (counts[cat] || 0) + 1
        })
        return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }, [products])

    const stockData = useMemo(() => {
        return [
            { name: 'In Stock', value: stats.inStock },
            { name: 'Out of Stock', value: stats.outOfStock }
        ]
    }, [stats])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentProduct.title || !currentProduct.price) {
            toast.error("Title and price are required")
            return
        }
        setIsSaving(true)

        try {
            const db = getDb()
            if (!db) throw new Error("Database not initialized")

            const productData = {
                title: currentProduct.title,
                description: currentProduct.description || '',
                price: Number(currentProduct.price),
                imageUrl: currentProduct.imageUrl || '',
                inStock: currentProduct.inStock ?? true,
                category: currentProduct.category || 'Cleaning',
                updatedAt: serverTimestamp()
            }

            if (currentProduct.id) {
                await updateDoc(doc(db, 'products', currentProduct.id), productData)
                toast.success("Product updated")
            } else {
                await addDoc(collection(db, 'products'), {
                    ...productData,
                    createdAt: serverTimestamp()
                })
                toast.success("Product created")
            }

            setIsEditing(false)
            setCurrentProduct({})
        } catch (err: any) {
            toast.error(err.message || "Failed to save product")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (productId: string) => {
        if (!isSuperAdmin) {
            toast.error("Only super admins can delete products")
            return
        }
        if (!window.confirm("Are you sure you want to delete this product?")) return

        try {
            const db = getDb()
            if (!db) return
            await deleteDoc(doc(db, 'products', productId))
            toast.success("Product deleted")
        } catch (err) {
            toast.error("Failed to delete product")
        }
    }

    const handleImageUpload = async (file: File) => {
        try {
            const url = await uploadImage(file, 'products')
            setCurrentProduct(prev => ({ ...prev, imageUrl: url }))
            toast.success("Image uploaded")
        } catch (err) {
            toast.error("Image upload failed")
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-primary-900 tracking-tight">Inventory Management</h2>
                    <p className="text-secondary-600 font-medium mt-1">Control your luxury product catalog and stock analytics</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentProduct({ inStock: true, category: 'Cleaning' })
                        setIsEditing(true)
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-primary-900 font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-accent-500/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Price/Stock Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Products', value: stats.total, icon: Package, color: 'blue' },
                    { label: 'Inventory Value', value: `$${stats.totalValue.toLocaleString()}`, icon: DollarSign, color: 'emerald' },
                    { label: 'In Stock', value: stats.inStock, icon: CheckCircle, color: 'purple' },
                    { label: 'Out of Stock', value: stats.outOfStock, icon: AlertCircle, color: 'rose' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-3xl shadow-premium p-6 border border-gray-100 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black text-primary-900 leading-none">{stat.value}</h3>
                            </div>
                            <div className={`p-4 bg-${stat.color}-500 rounded-2xl shadow-lg shadow-${stat.color}-500/20`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] shadow-premium p-8 border border-gray-100 flex flex-col h-[350px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-primary-900">Category Mix</h3>
                        <Layers className="w-5 h-5 text-secondary-300" />
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} barSize={40}>
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-premium p-8 border border-gray-100 flex flex-col h-[350px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-primary-900">Stock Status</h3>
                        <PieIcon className="w-5 h-5 text-secondary-300" />
                    </div>
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stockData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell fill="#10B981" />
                                    <Cell fill="#EF4444" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black text-primary-900">{stats.total}</span>
                            <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">total</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-900 transition-colors w-4 h-4" />
                        <input
                            type="text"
                            placeholder="SEARCH PRODUCTS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-gray-50/50 border-none rounded-2xl text-[11px] font-black tracking-widest uppercase focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all outline-none text-primary-900"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8">
                    {isLoading ? (
                        [...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)
                    ) : filteredProducts.length === 0 ? (
                        <div className="col-span-full py-20 text-center font-black text-secondary-300 uppercase tracking-widest">No products found</div>
                    ) : filteredProducts.map((p) => (
                        <motion.div
                            key={p.id}
                            layout
                            className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-premium transition-all duration-500 group relative"
                        >
                            <div className="relative aspect-square bg-gray-50">
                                {p.imageUrl ? (
                                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center"><ImageIcon className="w-10 h-10 text-gray-200" /></div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">{p.category}</span>
                                </div>
                                {!p.inStock && (
                                    <div className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm flex items-center justify-center">
                                        <span className="text-white text-xs font-black uppercase tracking-[0.2em] border-2 border-white/30 px-4 py-2 rounded-xl">Sold Out</span>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2">
                                    <button onClick={() => { setCurrentProduct(p); setIsEditing(true); }} className="p-2.5 bg-white text-primary-900 rounded-xl shadow-lg hover:bg-primary-900 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                                    {isSuperAdmin && (
                                        <button onClick={() => handleDelete(p.id)} className="p-2.5 bg-white text-rose-500 rounded-xl shadow-lg hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="font-black text-primary-900 tracking-tight text-lg mb-1 leading-tight">{p.title}</h4>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xl font-black text-primary-900">${p.price}</span>
                                    <div className={`w-2 h-2 rounded-full ${p.inStock ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-primary-900/40 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-primary-900">{currentProduct.id ? 'Refine Product' : 'Catalog New Item'}</h3>
                                    <p className="text-secondary-500 text-xs font-bold uppercase tracking-widest mt-1">Configure luxury asset properties</p>
                                </div>
                                <button onClick={() => setIsEditing(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"><X className="w-6 h-6 text-secondary-400" /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-2 ml-1">Asset Name</label>
                                        <input
                                            value={currentProduct.title || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, title: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-900 outline-none transition-all"
                                            placeholder="PRODUCT TITLE..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-2 ml-1">Price (USD)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-300" />
                                            <input
                                                type="number"
                                                value={currentProduct.price || ''}
                                                onChange={e => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                                                className="w-full pl-10 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-900 outline-none transition-all"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                                        <input
                                            value={currentProduct.category || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary-900 outline-none transition-all"
                                            placeholder="SPECIFY GENRE..."
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-2 ml-1">Asset Description</label>
                                        <textarea
                                            rows={4}
                                            value={currentProduct.description || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-900 outline-none transition-all resize-none leading-relaxed"
                                            placeholder="DESCRIBE THE ASSET..."
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={currentProduct.inStock ?? true}
                                                onChange={e => setCurrentProduct({ ...currentProduct, inStock: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-900"></div>
                                        </label>
                                        <span className="text-[10px] font-black text-primary-900 uppercase tracking-widest">Available for Purchase</span>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-2 ml-1">Image</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 relative">
                                                {currentProduct.imageUrl ? (
                                                    <img src={currentProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                ) : <ImageIcon className="w-6 h-6 m-auto text-gray-200" />}
                                            </div>
                                            <label className="flex-1 px-6 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary-900 transition-colors group">
                                                <span className="text-[10px] font-black text-secondary-400 group-hover:text-primary-900 uppercase tracking-widest">Select Visual Artifact</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={e => {
                                                    const file = e.target.files?.[0]
                                                    if (file) uploadImage(file, 'products').then(url => setCurrentProduct(prev => ({ ...prev, imageUrl: url })))
                                                }} />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end gap-4">
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3.5 text-[10px] font-black text-secondary-500 uppercase tracking-widest hover:text-primary-900 transition-colors">Abort</button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-10 py-3.5 bg-primary-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-900/20 active:scale-95 disabled:opacity-50 flex items-center gap-3"
                                    >
                                        {isSaving && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                        <span>Commit Changes</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
