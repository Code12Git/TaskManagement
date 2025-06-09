'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';




const Sidebar = () => {
  const [selectedItem, setSelectedItem] = useState('Dashboard');
  const router = useRouter();
  const menuItems = [
    { name: 'Dashboard', icon: '📊', linkTo: '/' },
    { name: 'Projects', icon: '📁', linkTo: '/projects' },
    { name: 'Tasks', icon: '✅', linkTo: '/tasks' },
    { name: 'Users', icon: '👥', linkTo: '/users' },
    { name: 'Calendar', icon: '📅', linkTo: '/calendar' },
    { name: 'Messages', icon: '💬', linkTo: '/messages' },
    { name: 'Reports', icon: '📈', linkTo: '/reports' },
    { name: 'Settings', icon: '⚙️', linkTo: '/settings' },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
    hover: { scale: 1.03, originX: 0 },
  };


  const logoutHandler = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('token')
    localStorage.removeItem('persist:root');
    router.push('/admin');
  }

  return (
<div className="h-screen fixed flex-col overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hidden md:flex">      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full text-white">
        {/* Header */}
        <div className="p-6 pb-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-1"
          >
            <h1 className="text-2xl font-bold">Task Management</h1>
            <p className="text-sm text-white/80">Admin Panel</p>
          </motion.div>
        </div>

        {/* Scrollable Menu */}
        <div className="flex-1 overflow-y-auto py-2 px-4">
          <motion.ul 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-1"
          >
            {menuItems.map((item) => (
              <motion.li
                key={item.name}
                variants={itemVariants}
                whileHover="hover"
                className={`rounded-lg transition-all ${
                  selectedItem === item.name 
                    ? 'bg-white/20 backdrop-blur-md shadow-lg' 
                    : 'hover:bg-white/10'
                }`}
              >
                <Link 
                  href={item.linkTo}
                  className="flex items-center gap-3 px-4 py-3 w-full h-full"
                  onClick={() => setSelectedItem(item.name)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                  {selectedItem === item.name && (
                    <motion.div 
                      layoutId="activeItem"
                      className="w-1 h-6 bg-white rounded-full ml-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
    className="flex items-center gap-3"
  >
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2 items-center'>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold backdrop-blur-md">
          U
        </div>
        <div>
          <p className="text-sm font-medium">User Admin</p>
          <p className="text-xs text-white/70">admin@example.com</p>
        </div>
      </div>
      <div>
        <motion.button 
          onClick={logoutHandler}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="ml-10 mt-1 cursor-pointer px-4 py-2 text-sm text-white bg-white/10 hover:bg-white/20 rounded-md backdrop-blur-md transition-all border border-white/10"
        >
          Logout
        </motion.button>
      </div>
    </div>
  </motion.div>
</div>

      </div>
    </div>
  );
};

export default Sidebar;