'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { publicRequest } from '@/helpers/axios';

const Email = () => {
    const [email,setEmail] = useState('')

    console.log(email)

    const sendforgotLink = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await publicRequest.post('/auth/forgot-password', { email: email });
        toast.success('Reset Password Link Send Successfully!');
    }

  return (
    <motion.div
      className="flex flex-col items-start justify-center mt-24 p-4 max-w-sm mx-auto bg-white shadow-md rounded-2xl space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
        <h1 className=' m-auto font-bold'>Forgot Password</h1>
      <label htmlFor="email" className="text-gray-700 font-medium">
        Email
      </label>
      <input
        id="email"
        type="email"
        onChange={(e)=>setEmail(e.target.value)}
        placeholder="Please Enter your email..."
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <motion.button initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }} 
      onClick={sendforgotLink}
      className='p-2 bg-blue-300  hover:scale-105 delay-150 transition ml-64 cursor-pointer rounded-2xl'>Send Link</motion.button>
    </motion.div>
  );
};

export default Email;
