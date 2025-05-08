'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/hooks';
import { motion } from 'framer-motion';

const Navbar = () => {
  const router = useRouter();
  const { userData, token } = useAppSelector(state => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('persist:root');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            <span className="ml-2 text-xl font-bold">TaskFlow</span>
          </div>

          <div className="hidden sm:flex sm:items-center space-x-6">
            {['/', '/dashboard', '/addtask', '/task'].map((path, i) => (
              <Link
                key={i}
                href={path}
                className="text-sm font-medium hover:text-white hover:underline transition"
              >
                {path === '/' ? 'Homepage' : path.replace('/', '').replace(/^\w/, c => c.toUpperCase())}
              </Link>
            ))}

            {!userData || !token ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-100 transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 transition"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-pink-500 rounded-md hover:bg-pink-600 transition"
              >
                Logout
              </motion.button>
            )}
          </div>

          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white hover:text-indigo-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="sm:hidden px-4 pb-4 text-white"
        >
          {['/', '/dashboard', '/addtask', '/task'].map((path, i) => (
            <Link
              key={i}
              href={path}
              className="block py-2 text-base hover:underline hover:text-white transition"
            >
              {path === '/' ? 'Homepage' : path.replace('/', '').replace(/^\w/, c => c.toUpperCase())}
            </Link>
          ))}
          {!userData || !token ? (
            <>
              <Link href="/login" className="block py-2 mt-4 text-base hover:underline">
                Sign in
              </Link>
              <Link href="/register" className="block py-2 text-base hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="w-full text-left py-2 mt-4 text-base text-pink-100 hover:text-white"
            >
              Logout
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
