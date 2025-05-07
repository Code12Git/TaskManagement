'use client'

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getAll } from "@/redux/actions/taskAction";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiClock, FiList, FiUser, FiUserPlus } from "react-icons/fi";

const TaskDashboardTable = () => {
  const dispatch = useAppDispatch();
  const { taskData } = useAppSelector(state => state.tasks);
  const { userData } = useAppSelector(state => state.auth);
  const [filter, setFilter] = useState<'all' | 'assigned' | 'created' | 'overdue'>('all');
  const [filteredTasks, setFilteredTasks] = useState(taskData || []);

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  useEffect(() => {
    const now = new Date();
    let filtered = [...(taskData || [])];

    switch (filter) {
      case 'assigned':
        filtered = taskData.filter(task => task.assignTo === userData?._id);
        break;
      case 'created':
        filtered = taskData.filter(task => task.userId === userData?._id);  
        break;
      case 'overdue':
        filtered = taskData.filter(task => 
          new Date(task.dueDate) < now && 
          task.status !== 'completed'
        );
        break;
      default:
        filtered = taskData;
    }

    setFilteredTasks(filtered);
  }, [filter, taskData, userData?._id]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const statusColors = {
    completed: "bg-green-100 text-green-800",
    "in-progress": "bg-blue-100 text-blue-800",
    pending: "bg-amber-100 text-amber-800",
    "not-started": "bg-red-100 text-red-800"
  };

  const statusIcons = {
    completed: <FiCheckCircle className="mr-1" />,
    "in-progress": <FiClock className="mr-1" />,
    pending: <FiClock className="mr-1" />,
    "not-started": <FiAlertCircle className="mr-1" />
  };

  const priorityColors = {
    high: "text-red-600",
    medium: "text-amber-600",
    low: "text-indigo-600"
  };

  const priorityIcons = {
    high: <FiAlertCircle className="mr-1" />,
    medium: <FiClock className="mr-1" />,
    low: <FiList className="mr-1" />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Dashboard</h1>
        <p className="text-gray-600 mb-8">Overview of your tasks and responsibilities</p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks?.map((task) => (
                  <motion.tr
                    key={task._id}
                    variants={rowVariants}
                    whileHover={{ scale: 1.01 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[task?.status ?? 'not-started'] || 'bg-gray-100 text-gray-800'}`}>
                        {statusIcons[task.status ?? 'not-started'] || <FiList className="mr-1" />}
                        {task?.status?.replace("-", " ") || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                      {task.status === "not-started" && (
                        <span className="ml-2 text-xs text-red-500">(not started)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span>
                        {task?.assignTo ? 'Assigned' : 'Me'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`inline-flex items-center ${priorityColors[task.priority ?? 'low'] || 'text-gray-600'}`}>
                        {priorityIcons[task.priority ?? 'low'] || <FiList className="mr-1" />}
                        {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'N/A'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!filteredTasks || filteredTasks.length === 0) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500"
            >
              No tasks found
            </motion.div>
          )}
        </motion.div>

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex flex-wrap gap-3"
        >
          <button 
            onClick={() => setFilter('assigned')}
            className={`px-4 py-2 rounded-lg transition flex items-center ${
              filter === 'assigned' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            <FiUserPlus className="mr-2" />
            Assigned to Me
          </button>
          <button 
            onClick={() => setFilter('created')}
            className={`px-4 py-2 rounded-lg transition flex items-center ${
              filter === 'created' 
                ? 'bg-amber-600 text-white hover:bg-amber-700' 
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            <FiUser className="mr-2" />
            Created by Me
          </button>
          <button 
            onClick={() => setFilter('overdue')}
            className={`px-4 py-2 rounded-lg transition flex items-center ${
              filter === 'overdue' 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            <FiAlertCircle className="mr-2" />
            Overdue Tasks
          </button>
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition flex items-center ${
              filter === 'all' 
                ? 'bg-gray-600 text-white hover:bg-gray-700' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <FiList className="mr-2" />
            All Tasks
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TaskDashboardTable;