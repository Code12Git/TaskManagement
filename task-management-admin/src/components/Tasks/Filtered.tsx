'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { filterTasks } from '@/redux/actions/taskAction'
import CreateTask from '@/ui/modal/task/CreateTask'
import { motion } from 'framer-motion'

const Filtered = () => {
  const dispatch = useAppDispatch()

  const [filtered, setFilter] = useState({
    priority: '',
    status: ''
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  useEffect(() => {
    dispatch(filterTasks(filtered))
  }, [filtered, dispatch])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilter((prev) => ({ ...prev, [name]: value }))
  }

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const selectVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  return (
    <motion.div
      className="mb-8 w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Priority Filter */}
      <motion.div
        className="flex flex-col gap-2 w-full sm:w-auto"
        variants={selectVariants}
      >
        <label className="text-sm font-medium text-gray-700">Sort By Priority</label>
        <motion.select
          name="priority"
          value={filtered.priority}
          onChange={handleFilterChange}
          className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:shadow-md"
          whileHover={{ scale: 1.01 }}
          whileFocus={{ scale: 1.02 }}
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </motion.select>
      </motion.div>

      {/* Create Task Button */}
      <motion.div
        className="flex justify-end"
        variants={selectVariants}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2 cursor-pointer bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 hover:scale-105 transition duration-200"
        >
          Create Task
        </button>
      </motion.div>

      {/* Status Filter */}
      <motion.div
        className="flex flex-col gap-2 w-full sm:w-auto"
        variants={selectVariants}
      >
        <label className="text-sm font-medium text-gray-700">Sort By Status</label>
        <motion.select
          name="status"
          value={filtered.status}
          onChange={handleFilterChange}
          className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:shadow-md"
          whileHover={{ scale: 1.01 }}
          whileFocus={{ scale: 1.02 }}
        >
          <option value="">All Statuses</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </motion.select>
      </motion.div>

      {/* Modal */}
      <CreateTask isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </motion.div>
  )
}

export default Filtered
