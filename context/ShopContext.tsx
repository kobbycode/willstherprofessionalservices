'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/types/product'
import { toast } from 'react-hot-toast'

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

    const addToCart = (product: Product, quantity = 1) => {
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
    }

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId))
        toast.success("Item removed from cart")
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return
        setCart(prev => prev.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
        ))
    }

    const clearCart = () => {
        setCart([])
    }

    const toggleWishlist = (product: Product) => {
        setWishlist(prev => {
            const exists = prev.find(p => p.id === product.id)
            if (exists) {
                toast.success("Removed from wishlist")
                return prev.filter(p => p.id !== product.id)
            }
            toast.success("Added to wishlist")
            return [...prev, product]
        })
    }

    const isInWishlist = (productId: string) => {
        return wishlist.some(p => p.id === productId)
    }

    const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

    return (
        <ShopContext.Provider value={{
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
            cartCount
        }}>
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
