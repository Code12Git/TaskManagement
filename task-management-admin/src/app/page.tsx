'use client';

import { motion } from 'framer-motion';
import UserChart from "@/components/Users/UserChart";
 import { useEffect, useState } from 'react';
 import { privateRequest } from '@/helpers/axios';
import { userInfo } from '@/types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {

  const [userInfo,setUserInfo] = useState<userInfo>()

  useEffect(()=>{
    const fetchUserInfo = async() => {
      const res = await privateRequest.get('/user/info')
      console.log(res)
      setUserInfo(res.data.data)
    }
    fetchUserInfo()
  },[])

  console.log(userInfo)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={item} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">User Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track and analyze user growth and engagement</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
                   { title: "Total Users", value: userInfo?.totalUsers, change: userInfo?.change?.totalUsers?.change, trend:userInfo?.change?.totalUsers?.trend },
                   { title: "New Users", value: userInfo?.newUser, change: userInfo?.change?.newUser?.change, trend:userInfo?.change?.newUser?.trend },
                   { title: "Active Users", value: userInfo?.activeUsers, change: userInfo?.change?.activeUsers?.change, trend:userInfo?.change?.activeUsers?.trend },
                   { title: "Churn Rate", value: userInfo?.churnRate, change: userInfo?.change?.churnRate?.change, trend: userInfo?.change?.churnRate?.trend },
          ].map((stat, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <span className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                  {stat.trend === 'up' ? (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

       <UserChart />
      </motion.div>
    </div>
  );
}