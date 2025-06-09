'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { publicRequest } from '@/helpers/axios';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
const EyeIcon = ({ open }: { open: boolean }) => (
  open ? (
    // Eye Open Icon (showing)
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    // Eye Closed Icon (hidden)
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.986 9.986 0 012.233-3.397m1.287-1.364A9.967 9.967 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.967 9.967 0 01-3.16 4.67M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
    </svg>
  )
);

const Page = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter()


  const { token } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please fill both fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    await publicRequest.post('/auth/reset-password',{token,password})

    setSuccess('Password reset successfully!');
    setPassword('');
    setConfirmPassword('');
    router.push('/login')
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Reset Your Password
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="relative">
            <label className="block text-gray-600 text-sm mb-2">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute cursor-pointer top-8 right-3 focus:outline-none"
              tabIndex={-1}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-gray-600 text-sm mb-2">Confirm Password</label>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute cursor-pointer top-8 right-3 focus:outline-none"
              tabIndex={-1}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Page;
