'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useShop } from '@/context/ShopContext'
import { X, CreditCard, Banknote, MessageCircle, AlertCircle } from 'lucide-react'
import { usePaystackPayment } from 'react-paystack'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { getDb } from '@/lib/firebase'
import { toast } from 'react-hot-toast'
import { useSiteConfig } from '@/lib/site-config'

type PaymentMethod = 'paystack' | 'cod' | 'whatsapp'

interface CheckoutModalProps {
    isOpen: boolean
    onClose: () => void
}

export const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
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

    // Paystack Configuration
    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: details.email,
        amount: Math.round(cartTotal * 100), // Amount in kobo/pesewas
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

            // Create Order
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
            onClose()
        } catch (error) {
            console.error("Order error:", error)
            toast.error("Failed to place order. Please contact support.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (paymentMethod === 'whatsapp') {
            const whatsappNumber = config.contactPhone.replace(/\D/g, '')
            const itemsList = cart.map(item => `- ${item.product.title} (${item.quantity}x) @ GH₵${item.product.price}`).join('%0A')
            const message = `*New Order Request*%0A%0A*Name:* ${details.name}%0A*Phone:* ${details.phone}%0A*Address:* ${details.address}%0A%0A*Items:*%0A${itemsList}%0A%0A*Total:* GH₵${cartTotal.toFixed(2)}`
            window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
            handleSuccess() // Log order even for WhatsApp
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

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Checkout</h3>
                                <p className="text-sm text-gray-500">Complete your order</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* User Details */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 border-b pb-2">Contact Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                            value={details.name}
                                            onChange={e => setDetails(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="text-sm font-medium text-gray-700">Email (Optional)</label>
                                        <input
                                            type="email"
                                            className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                            value={details.email}
                                            onChange={e => setDetails(prev => ({ ...prev, email: e.target.value }))}
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                            value={details.phone}
                                            onChange={e => setDetails(prev => ({ ...prev, phone: e.target.value }))}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-700">Delivery Address</label>
                                        <textarea
                                            required
                                            rows={2}
                                            className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                            value={details.address}
                                            onChange={e => setDetails(prev => ({ ...prev, address: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 border-b pb-2">Payment Method</h4>
                                <div className="grid gap-3">
                                    <label className={`cursor-pointer border p-4 rounded-xl flex items-center gap-4 transition-all ${paymentMethod === 'paystack' ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600' : 'border-gray-200 hover:border-purple-300'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="paystack"
                                            checked={paymentMethod === 'paystack'}
                                            onChange={() => setPaymentMethod('paystack')}
                                            className="w-5 h-5 text-purple-600"
                                        />
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                                                <CreditCard size={18} />
                                                Pay Online (Card / Mobile Money)
                                            </div>
                                            <p className="text-sm text-gray-500">Secure payment via Paystack</p>
                                        </div>
                                    </label>

                                    <label className={`cursor-pointer border p-4 rounded-xl flex items-center gap-4 transition-all ${paymentMethod === 'cod' ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600' : 'border-gray-200 hover:border-purple-300'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={() => setPaymentMethod('cod')}
                                            className="w-5 h-5 text-purple-600"
                                        />
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                                                <Banknote size={18} />
                                                Pay on Delivery
                                            </div>
                                            <p className="text-sm text-gray-500">Pay cash/momo when items arrive</p>
                                        </div>
                                    </label>

                                    <label className={`cursor-pointer border p-4 rounded-xl flex items-center gap-4 transition-all ${paymentMethod === 'whatsapp' ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600' : 'border-gray-200 hover:border-purple-300'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="whatsapp"
                                            checked={paymentMethod === 'whatsapp'}
                                            onChange={() => setPaymentMethod('whatsapp')}
                                            className="w-5 h-5 text-purple-600"
                                        />
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                                                <MessageCircle size={18} />
                                                Order on WhatsApp
                                            </div>
                                            <p className="text-sm text-gray-500">Chat with us to complete order</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {!paystackConfig.publicKey && paymentMethod === 'paystack' && (
                                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    <span>Paystack setup incomplete (Missing Public Key)</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSubmitting ? 'Processing...' : `Place Order (GH₵${cartTotal.toFixed(2)})`}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
