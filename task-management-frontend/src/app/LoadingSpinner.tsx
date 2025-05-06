import React from 'react'
import {motion} from 'framer-motion'
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
      />
    </div>
  )

export default LoadingSpinner