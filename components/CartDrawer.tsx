'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useShop } from '@/context/ShopContext'
import { X, Minus, Plus, Trash2, ShoppingBag, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export const CartDrawer = () => {
    const router = useRouter()
    const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartTotal } = useShop()

    return (
        <>
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                            onClick={() => setIsCartOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 20 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
                        >
                            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
                                <h2 className="text-sm md:text-base font-semibold text-gray-900 flex items-center gap-2 uppercase tracking-[0.2em] font-outfit">
                                    <ShoppingBag size={18} />
                                    Your Cart ({cart.length})
                                </h2>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-3 sm:p-1.5 hover:bg-gray-100 transition-colors"
                                >
                                    <X size={18} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-300">
                                        <ShoppingBag size={48} className="mb-4 opacity-20" />
                                        <p className="text-sm md:text-base font-medium uppercase tracking-widest">Your cart is empty</p>
                                        <button
                                            onClick={() => setIsCartOpen(false)}
                                            className="mt-3 text-xs sm:text-[13px] md:text-sm text-primary-600 font-semibold hover:underline uppercase tracking-widest"
                                        >
                                            Start Shopping
                                        </button>
                                    </div>
                                ) : (
                                    cart.map(({ product, quantity }) => (
                                        <div key={product.id} className={`flex gap-3 md:gap-4 p-4 ${!product.inStock ? 'bg-red-50 border border-red-200' : 'bg-slate-50'}`}>
                                            <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white overflow-hidden border border-gray-200">
                                                {product.imageUrl && (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                                {!product.inStock && (
                                                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-wider bg-red-50 px-1.5 py-0.5 rounded border border-red-200">Sold Out</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xs md:text-sm font-semibold text-gray-900 line-clamp-1 mb-1">{product.title}</h3>
                                                {!product.inStock && (
                                                    <div className="flex items-center gap-1 text-red-500 mb-1">
                                                        <AlertCircle size={12} />
                                                        <span className="text-[11px] font-bold uppercase tracking-wider">Currently Unavailable</span>
                                                    </div>
                                                )}
                                                <p className="text-xs sm:text-[13px] text-primary-600 font-bold mb-2 md:mb-3 italic font-outfit">GH₵{product.price.toFixed(2)}</p>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 md:gap-3 bg-white border border-gray-200 px-2">
                                                        <button
                                                            onClick={() => updateQuantity(product.id, quantity - 1)}
                                                            className="p-2.5 sm:p-1 hover:text-primary-600 disabled:opacity-50"
                                                            disabled={quantity <= 1}
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="text-sm md:text-base font-medium w-4 text-center">{quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(product.id, quantity + 1)}
                                                            className="p-2.5 sm:p-1 hover:text-primary-600"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                    <button
                                                    onClick={() => removeFromCart(product.id)}
                                                    className="p-3 sm:p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-4 md:p-6 border-t border-gray-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-xs sm:text-[12px] uppercase tracking-widest text-gray-400 font-semibold">Subtotal</span>
                                        <span className="text-sm md:text-lg font-bold text-gray-900 italic font-outfit">GH₵{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={() => { setIsCartOpen(false); router.push('/checkout') }}
                                        className="w-full py-3 sm:py-3.5 md:py-4 bg-gray-900 hover:bg-black text-white font-semibold text-xs sm:text-[13px] uppercase tracking-[0.3em] shadow-lg transition-all active:scale-[0.98]"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
