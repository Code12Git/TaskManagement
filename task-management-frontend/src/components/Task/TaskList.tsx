'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Task } from '@/types'
import TaskItem from './TaskItem'
import { useAppSelector } from '@/hooks/hooks'

const TaskList = ({ tasks}: { tasks: Task[] }) => {
  const {filteredData} = useAppSelector(state=>state.tasks)
  console.log(filteredData)
  return (
  <motion.div layout className="space-y-4">
    {tasks.length === 0 ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-8 text-center"
      >
        <p className="text-lg">No tasks yet. Add one above!</p>
      </motion.div>
    ) : filteredData && filteredData.length > 0 ? (
      filteredData.map((task) => <TaskItem key={task._id} task={task} />)
    ) : (
      tasks.map((task) => <TaskItem key={task._id} task={task} />)
    )}
  </motion.div>)
}

export default TaskList