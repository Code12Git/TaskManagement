'use client'

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch} from '@/hooks/reduxHooks';
import { deleteUsers, fetchAllUsers } from '@/redux/actions/userAction';
import { User } from '@/types';
import { format } from 'date-fns';
import {Delete,Pencil } from 'lucide-react';

const UserDetails = () => {
  const dispatch = useAppDispatch();
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await dispatch(fetchAllUsers());
        if (Array.isArray(res)) {
          setUsers(res);
        }
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [dispatch]);

  const deleteHandler = async (id: string) => {
    dispatch(deleteUsers(id));
  }

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

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const gradientVariants = {
    initial: { backgroundPosition: '0% 50%' },
    animate: {
      backgroundPosition: '100% 50%',
      transition: {
        duration: 5,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'linear'
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto bg-red-50 rounded-xl shadow-md">
        <div className="text-red-600 font-medium">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="p-6 max-w-md mx-auto bg-blue-50 rounded-xl shadow-md">
        <div className="text-blue-600 font-medium">No users found</div>
      </div>
    );
  }

  // Get filtered keys from the first user (excluding sensitive/irrelevant fields)
  const filteredKeys = users.length > 0 
  ? [...Object.keys(users[0]).filter(key => !['password', '__v', 'updatedAt'].includes(key)), 'actions']
  : [];


  return (
    <div className="p-4 md:p-6 w-full mx-auto max-w-6xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="overflow-hidden rounded-xl shadow-lg border border-gray-100"
      >
        <div className="bg-white p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-600">List of all registered users</p>
        </div>

        <div className="overflow-x-auto">
          <motion.table className="w-full cursor-pointer">
            {/* Animated Gradient Header */}
            <motion.thead
              variants={gradientVariants}
              initial="initial"
              animate="animate"
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[length:300%_100%]"
            >
              <tr>
                {filteredKeys.map((key, index) => (
                  <th 
                    key={index} 
                    className="px-6 py-4 text-left text-white font-bold text-sm uppercase tracking-wider"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </motion.thead>

            {/* Animated Table Body */}
            <motion.tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <motion.tr
                  key={index}
                  variants={rowVariants}
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {filteredKeys.map((key, i) => {
                    console.log(key)
                    return(
                    <td key={i} className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">
                        {key === 'createdAt' || key === 'updatedAt' 
                          ? format(new Date(user[key]), 'PPpp') 
                          : user[key as keyof User]}
                          {key === 'actions' && 
                          <div className='flex items-center gap-4'>
                          <button onClick={()=>deleteHandler(user._id)} className='text-red-400 cursor-pointer'><Delete  /></button>
                          <button className='text-blue-400 cursor-pointer'><Pencil /></button>
                          </div>
                          }
                      </div>
                    </td>
                  )})}
                </motion.tr>
              ))}
            </motion.tbody>
          </motion.table>
        </div>
      </motion.div>

      {/* Floating background decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        className="fixed -z-10 top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
        className="fixed -z-10 bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-pink-400 to-red-400 blur-3xl"
      />
    </div>
  );
};

export default UserDetails;