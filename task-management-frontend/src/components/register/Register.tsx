'use client'

import React from 'react';

import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { registerUser } from '@/redux/actions/authAction';
import z from 'zod'
import { useRouter } from 'next/navigation';
import registerValidation from '@/validations/auth/registerValidation';
type registerForm = z.infer<typeof registerValidation>;

const Register = () => {
    const {isLoading,error} = useAppSelector(state=>state.auth)
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {
        register,
        handleSubmit,
        clearErrors,
        reset,
        formState: { errors},
      } = useForm<registerForm>({
        resolver: zodResolver(registerValidation),
        defaultValues: {
          name: '',
          username: '',
          email: '',
          password: '',
        },
      });

  const submitHandler = async (data:registerForm) => {
    try{
  const res = await        dispatch(registerUser(data))
        clearErrors()
        reset()
        if (res && res.statusCode === 200) {
          router.push('/login');
      }    }catch(err){
        throw err;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
            <p className="text-gray-600">Join our community today</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
              role="alert"
            >
              <p>{error}</p>
            </motion.div>
          )}

          <motion.form variants={containerVariants} onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                   type="text"
                  {...register('name')}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="John Doe"
               
                />
              </div>
              {errors?.name&&<p className='text-red-300'>{errors.name.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                   type="text"
                   {...register('username')}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="johndoe123"
                />
              </div>
              {errors?.username&&<p className='text-red-300'>{errors.username.message}</p>}

            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="john@example.com"
                />
              </div>
              {errors?.email&&<p className='text-red-300'>{errors.email.message}</p>}

            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password')}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
              {errors?.password&&<p className='text-red-300'>{errors.password.message}</p>}

            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full cursor-pointer flex justify-center items-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-2 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Register <FiArrowRight className="ml-2" />
                  </span>
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <motion.a
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 inline-flex items-center"
                whileHover={{ x: 2 }}
              >
                Sign in <FiArrowRight className="ml-1" />
              </motion.a>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;