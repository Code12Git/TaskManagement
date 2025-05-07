import React from 'react'
import {motion} from 'framer-motion'
import { Task } from '@/types';
const TaskSummary = ({ tasks }: { tasks: Task[] }) => {
    const completedCount = tasks.filter((t) => t.status === "completed").length;
    const inProgressCount = tasks.filter(
      (t) => t.status === "in-progress"
    ).length;
    const notStartedCount = tasks.filter(
      (t) => t.status === "not-started"
    ).length;
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center  text-opacity-80 text-sm"
      >
        <div className="flex justify-center gap-4">
          <span>✅ {completedCount} completed</span>
          <span>🔄 {inProgressCount} in progress</span>
          <span>⏳ {notStartedCount} not started</span>
        </div>
        <div className="mt-2">
          {completedCount === tasks.length ? (
            <span className="text-green-300">All tasks completed! 🎉</span>
          ) : (
            <span>{Math.round((completedCount / tasks.length) * 100)}% done</span>
          )}
        </div>
      </motion.div>
    );
  };

export default TaskSummary