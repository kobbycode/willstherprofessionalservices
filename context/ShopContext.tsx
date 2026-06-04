'use client'

import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react'
import { Product } from '@/types/product'
import { toast } from 'react-hot-toast'
import { getDb } from '@/lib/firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'

export type CartItem = {
    product: Product
    quantity: number
}

interface ShopContextType {
    cart: CartItem[]
    wishlist: Product[]
    isCartOpen: boolean
    addToCart: (product: Product, quantity?: number) => void
    removeFromCart: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    toggleWishlist: (product: Product) => void
    isInWishlist: (productId: string) => boolean
    setIsCartOpen: (isOpen: boolean) => void
    cartTotal: number
    cartCount: number
    wishlistCount: number
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

export function ShopProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [wishlist, setWishlist] = useState<Product[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('shop_cart')
        const savedWishlist = localStorage.getItem('shop_wishlist')

        if (savedCart) setCart(JSON.parse(savedCart))
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist))

        setIsLoaded(true)
    }, [])

    // Save to localStorage just changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('shop_cart', JSON.stringify(cart))
        }
    }, [cart, isLoaded])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('shop_wishlist', JSON.stringify(wishlist))
        }
    }, [wishlist, isLoaded])

    // Sync cart items' inStock from Firestore in real-time
    useEffect(() => {
        if (!isLoaded || cart.length === 0) return

        const productIds = Array.from(new Set(cart.map(item => item.product.id)))
        const db = getDb()
        if (!db) return

        const q = query(collection(db, 'products'), where('__name__', 'in', productIds.slice(0, 10)))
        return onSnapshot(q, (snapshot) => {
            snapshot.docs.forEach(doc => {
                const fresh = doc.data()
                if (typeof fresh.inStock !== 'undefined') {
                    setCart(prev =>
                        prev.map(item =>
                            item.product.id === doc.id
                                ? { ...item, product: { ...item.product, inStock: fresh.inStock } }
                                : item
                        )
                    )
                }
            })
        })
    }, [isLoaded, cart.length])

    const addToCart = useCallback((product: Product, quantity = 1) => {
        if (!product.inStock) {
            toast.error(`${product.title} is currently out of stock`)
            return
        }
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id)
            if (existing) {
                toast.success(`Updated ${product.title} quantity`)
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }
            toast.success(`Added ${product.title} to cart`)
            return [...prev, { product, quantity }]
        })
    }, [])

    const removeFromCart = useCallback((productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId))
        toast.success("Item removed from cart")
    }, [])

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity < 1) return
        setCart(prev => prev.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
        ))
    }, [])

    const clearCart = useCallback(() => {
        setCart([])
    }, [])

    const toggleWishlist = useCallback((product: Product) => {
        setWishlist(prev => {
            const exists = prev.find(p => p.id === product.id)
            if (exists) {
                toast.success("Removed from wishlist")
                return prev.filter(p => p.id !== product.id)
            }
            toast.success("Added to wishlist")
            return [...prev, product]
        })
    }, [])

    const isInWishlist = useCallback((productId: string) => {
        return wishlist.some(p => p.id === productId)
    }, [wishlist])

    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.product.price * item.quantity), 0), [cart])
    const cartCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart])
    const wishlistCount = useMemo(() => wishlist.length, [wishlist])

    const value = useMemo(() => ({
        cart,
        wishlist,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        setIsCartOpen,
        cartTotal,
        cartCount,
        wishlistCount
    }), [cart, wishlist, isCartOpen, addToCart, removeFromCart, updateQuantity, clearCart, toggleWishlist, isInWishlist, setIsCartOpen, cartTotal, cartCount, wishlistCount])

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    )
}

export const useShop = () => {
    const context = useContext(ShopContext)
    if (context === undefined) {
        throw new Error('useShop must be used within a ShopProvider')
    }
    return context
}
