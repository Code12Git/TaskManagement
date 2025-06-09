'use client' // Added at the very top

import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { getAllTasks } from '@/redux/actions/taskAction'
import { Task } from '@/types'
import TaskModal from '@/ui/modal/task/TaskModal'
import { format } from 'date-fns'
import { motion, Variants } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar'
import Filtered from './Filtered'

const TaskDetails = () => {
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    dispatch(getAllTasks())
  }, [dispatch])
  
  const [open, setIsOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task>()
  const { tasks, filteredTasks } = useAppSelector(state => state.task)
  
  // Use filteredTasks if they exist, otherwise use all tasks
  const displayedTasks = filteredTasks && filteredTasks.length > 0 ? filteredTasks : tasks

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const taskVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const gradientVariants: Variants = {
    initial: { backgroundPosition: '0% 50%' },
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 8,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear'
      }
    }
  }

  const statusColors: Record<string, string> = {
    'completed': 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'not-started': 'bg-yellow-100 text-yellow-800'
  }

  const priorityColors: Record<string, string> = {
    'high': 'bg-red-100 text-red-800',
    'medium': 'bg-orange-100 text-orange-800',
    'low': 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with animated gradient */}
        <motion.div
          variants={gradientVariants}
          initial="initial"
          animate="animate"
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-[length:300%_100%] rounded-xl p-6 mb-8 shadow-lg"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            Task Dashboard
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-white/90 mt-2"
          >
            View and manage your tasks
          </motion.p>
        </motion.div>
        <SearchBar />
        <Filtered />
        {/* Tasks grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayedTasks.map((task) => (
            <motion.div
              key={task._id}
              variants={taskVariants}
              onClick={() => {
                setIsOpen(true)
                setSelectedTask(task)
              }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white cursor-pointer rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="mt-3 text-gray-600">{task.description.slice(0,50)}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                    {task.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Due: {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No due date'}
                  </span>
                </div>
              </div>

              {/* Animated progress bar */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-1 bg-gradient-to-r from-blue-400 to-purple-500"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative animated elements */}
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
        
        {selectedTask && (
  <TaskModal open={open} setIsOpen={setIsOpen} task={selectedTask} />
)}      </div>
    </div>
  )
}

export default TaskDetails