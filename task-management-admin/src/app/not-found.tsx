'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md"
      >
        <h2 className="text-3xl font-bold text-red-600 mb-4">404 - Page Not Found</h2>
        <p className="text-gray-600 mb-6">Oops! The page you{"'"}re looking for doesn{"'"}t exist.</p>
        <Link
          href="/tasks"
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          View All Tasks
        </Link>
      </motion.div>
    </div>
  )
}
