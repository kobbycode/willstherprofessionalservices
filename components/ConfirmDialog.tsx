'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, CheckCircle, XCircle } from 'lucide-react'

export type ConfirmDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false
}: ConfirmDialogProps) => {
  const iconMap = {
    danger: XCircle,
    warning: AlertTriangle,
    info: AlertTriangle
  }

  const colorMap = {
    danger: 'text-red-500 bg-red-100',
    warning: 'text-amber-500 bg-amber-100',
    info: 'text-blue-500 bg-blue-100'
  }

  const buttonColorMap = {
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    info: 'bg-blue-500 hover:bg-blue-600 text-white'
  }

  const Icon = iconMap[type]
  const iconBgClass = colorMap[type]
  const buttonClass = buttonColorMap[type]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="p-8">
              <div className={`w-16 h-16 ${iconBgClass} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <Icon className="w-8 h-8" />
              </div>

              <h2 className="text-xl font-bold text-gray-900 text-center mb-3">{title}</h2>
              <p className="text-gray-600 text-center mb-8">{message}</p>

              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3 px-6 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 py-3 px-6 rounded-2xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${buttonClass}`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : type === 'danger' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : null}
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDialog