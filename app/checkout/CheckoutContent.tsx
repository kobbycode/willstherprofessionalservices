'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useShop } from '@/context/ShopContext'
import { ArrowLeft, CreditCard, Banknote, MessageCircle, AlertCircle, ShoppingBag } from 'lucide-react'
import { usePaystackPayment } from 'react-paystack'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { getDb } from '@/lib/firebase'
import { toast } from 'react-hot-toast'
import { useSiteConfig } from '@/lib/site-config'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type PaymentMethod = 'paystack' | 'cod' | 'whatsapp'

export default function CheckoutContent() {
    const router = useRouter()
    const { cart, cartTotal, clearCart, setIsCartOpen } = useShop()
    const { config } = useSiteConfig()
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack')
    const [details, setDetails] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: details.email,
        amount: Math.round(cartTotal * 100),
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        currency: 'GHS',
        metadata: {
            custom_fields: [
                { display_name: "Name", variable_name: "name", value: details.name },
                { display_name: "Phone", variable_name: "phone", value: details.phone }
            ]
        }
    }

    const initializePaystack = usePaystackPayment(paystackConfig)

    const handleSuccess = async (reference?: any) => {
        setIsSubmitting(true)
        try {
            const db = getDb()
            if (!db) throw new Error("Database not initialized")

            await addDoc(collection(db, 'orders'), {
                items: cart,
                total: cartTotal,
                userDetails: details,
                paymentMethod,
                status: 'pending',
                paystackReference: reference || null,
                createdAt: serverTimestamp(),
            })

            toast.success("Order placed successfully!")
            clearCart()
            setIsCartOpen(false)
            router.push('/shop')
        } catch (error) {
            toast.error("Failed to place order. Please contact support.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const outOfStockItems = cart.filter(item => !item.product.inStock)
        if (outOfStockItems.length > 0) {
            const names = outOfStockItems.map(i => i.product.title).join(', ')
            toast.error(`Cannot proceed: ${names} ${outOfStockItems.length === 1 ? 'is' : 'are'} out of stock`)
            return
        }

        if (paymentMethod === 'whatsapp') {
            const whatsappNumber = config.contactPhone.replace(/\D/g, '')
            const itemsList = cart.map(item => `- ${item.product.title} (${item.quantity}x) @ GH₵${item.product.price}`).join('%0A')
            const message = `*New Order Request*%0A%0A*Name:* ${details.name}%0A*Phone:* ${details.phone}%0A*Address:* ${details.address}%0A%0A*Items:*%0A${itemsList}%0A%0A*Total:* GH₵${cartTotal.toFixed(2)}`
            window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
            handleSuccess()
            return
        }

        if (paymentMethod === 'paystack') {
            if (!paystackConfig.publicKey) {
                toast.error("Paystack Public Key missing!")
                return
            }
            initializePaystack({
                onSuccess: handleSuccess,
                onClose: () => toast.error("Payment cancelled")
            })
            return
        }

        if (paymentMethod === 'cod') {
            handleSuccess()
        }
    }

    if (cart.length === 0) {
        return (
            <main className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px]">
                <div className="container-custom py-16 md:py-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto"
                    >
                        <div className="w-14 h-14 bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag size={28} className="text-[#64748B]" />
                        </div>
                        <h1 className="text-lg md:text-xl font-bold text-[#0F172A] mb-2">Your cart is empty</h1>
                        <p className="text-[#64748B] text-sm mb-6 leading-relaxed">
                            Add some products before checking out.
                        </p>
                        <Link href="/shop" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white font-semibold text-sm hover:bg-[#1d4ed8] transition-colors">
                            <ArrowLeft size={16} />
                            Back to Shop
                        </Link>
                    </motion.div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px] pb-12">
            <div className="container-custom py-4 md:py-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-6"
                >
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1.5 text-[#64748B] hover:text-[#2563EB] transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <span className="text-[#E2E8F0]">/</span>
                    <span className="text-xs md:text-sm font-semibold text-[#0F172A] uppercase tracking-[0.2em]">Checkout</span>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    {/* Checkout Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7"
                    >
                        <div className="bg-white shadow-sm border border-[#E2E8F0] p-4 md:p-6">
                            <h2 className="text-sm md:text-base font-bold text-[#0F172A] uppercase tracking-[0.2em] mb-1">Contact Details</h2>
                            <p className="text-xs text-[#64748B] mb-5">Fill in your information to complete the order</p>

                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                                <div>
                                    <label className="text-xs font-semibold text-[#64748B] uppercase tracking-widest block mb-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white text-gray-900 border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] outline-none text-sm"
                                        value={details.name}
                                        onChange={e => setDetails(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-widest block mb-1">Email (Optional)</label>
                                        <input
                                            type="email"
                                            className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white text-gray-900 border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] outline-none text-sm"
                                            value={details.email}
                                            onChange={e => setDetails(prev => ({ ...prev, email: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-widest block mb-1">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white text-gray-900 border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] outline-none text-sm"
                                            value={details.phone}
                                            onChange={e => setDetails(prev => ({ ...prev, phone: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-[#64748B] uppercase tracking-widest block mb-1">Delivery Address</label>
                                    <textarea
                                        required
                                        rows={2}
                                        className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white text-gray-900 border border-[#E2E8F0] focus:ring-2 focus:ring-[#2563EB] outline-none text-sm"
                                        value={details.address}
                                        onChange={e => setDetails(prev => ({ ...prev, address: e.target.value }))}
                                    />
                                </div>

                                {/* Payment Method */}
                                <div className="pt-2">
                                    <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Payment Method</h3>
                                    <div className="grid gap-3">
                                        {([
                                            { value: 'paystack' as PaymentMethod, icon: CreditCard, title: 'Pay Online', desc: 'Secure via Paystack' },
                                            { value: 'cod' as PaymentMethod, icon: Banknote, title: 'Pay on Delivery', desc: 'Cash or Momo' },
                                            { value: 'whatsapp' as PaymentMethod, icon: MessageCircle, title: 'WhatsApp Order', desc: 'Chat with support' },
                                        ]).map((method) => (
                                            <label
                                                key={method.value}
                                                className={`cursor-pointer border p-3 md:p-4 flex items-center gap-3 md:gap-4 transition-all ${
                                                    paymentMethod === method.value
                                                        ? 'border-[#2563EB] bg-blue-50'
                                                        : 'border-[#E2E8F0] hover:border-[#2563EB]/40'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value={method.value}
                                                    checked={paymentMethod === method.value}
                                                    onChange={() => setPaymentMethod(method.value)}
                                                    className="w-4 h-4 text-[#2563EB]"
                                                />
                                                <div className="flex-1">
                                                    <div className="text-xs md:text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                                                        <method.icon size={18} className="text-[#2563EB]" />
                                                        {method.title}
                                                    </div>
                                                    <p className="text-xs text-[#64748B] mt-0.5">{method.desc}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {!paystackConfig.publicKey && paymentMethod === 'paystack' && (
                                    <div className="text-xs text-amber-600 bg-amber-50 p-3 flex items-center gap-2 border border-amber-200">
                                        <AlertCircle size={16} />
                                        <span>Paystack setup incomplete (Missing Public Key)</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 md:py-3.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold text-sm uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Processing...' : `Place Order • GH₵${cartTotal.toFixed(2)}`}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5"
                    >
                        <div className="bg-white shadow-sm border border-[#E2E8F0] p-4 md:p-6 sticky top-[130px]">
                            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-[0.2em] mb-4">Order Summary</h3>

                            <div className="space-y-3 mb-4 max-h-[40vh] overflow-y-auto">
                                {cart.map((item) => (
                                    <div key={item.product.id} className="flex gap-3">
                                        <div className="w-14 h-14 bg-[#F1F5F9] flex-shrink-0 overflow-hidden">
                                            <img
                                                src={item.product.images?.[0] || item.product.imageUrl || ''}
                                                alt={item.product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-[#0F172A] truncate">{item.product.title}</p>
                                            <p className="text-xs text-[#64748B]">Qty: {item.quantity}</p>
                                            <p className="text-xs font-bold text-[#2563EB]">GH₵{(item.product.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[#E2E8F0] pt-3 space-y-2">
                                <div className="flex justify-between text-xs text-[#64748B]">
                                    <span>Subtotal</span>
                                    <span>GH₵{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-[#64748B]">
                                    <span>Delivery</span>
                                    <span>To be confirmed</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-[#0F172A] border-t border-[#E2E8F0] pt-2">
                                    <span>Total</span>
                                    <span>GH₵{cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
