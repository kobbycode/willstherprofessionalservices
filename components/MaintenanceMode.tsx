'use client'

import { motion } from 'framer-motion'
import { Wrench, Clock, Mail } from 'lucide-react'
import { useSiteConfig } from '@/lib/site-config'
import { memo } from 'react'

const MaintenanceMode = memo(() => {
  const { config } = useSiteConfig()

  if (!config.maintenanceMode) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Under Maintenance</h1>
          <p className="text-gray-600">
            We're currently performing some maintenance on our site. We'll be back shortly!
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Expected completion: Soon</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Need immediate assistance?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Contact us directly for urgent matters
            </p>
            <a
              href={`mailto:${config.contactEmail}`}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Mail className="w-4 h-4" />
              <span>Email us</span>
            </a>
          </div>

          <div className="text-xs text-gray-400">
            <p>Thank you for your patience</p>
            <p className="mt-1">{config.siteName}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
})

MaintenanceMode.displayName = 'MaintenanceMode'

export default MaintenanceMode
