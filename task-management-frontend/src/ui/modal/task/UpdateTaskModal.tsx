'use client';

import { FiSave, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import taskSchema from '@/validations/task/taskValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod'
 type TaskModalProps = {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask:Task) => void;
};


type TaskForm = z.infer<typeof taskSchema>;

const UpdateTaskModal = ({ task, onClose,onSave }: TaskModalProps) => {


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title || '',
      description: task.description || '',
      dueDate: task.dueDate &&  new Date(task.dueDate),
      priority: task.priority || 'low',
      status: task.status || 'not-started',
    },
  });


  


  const onSubmit: SubmitHandler<TaskForm> = async (data) => {
    try {
      await onSave(data)
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-gray-900/50 backdrop-blur-sm" />
        
        <motion.div
          key="modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Task</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Close"
            >
              <FiX className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            </button>
          </div>

         <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
                {errors.title && (
                  <span className="text-red-500 text-xs ml-1">
                    {errors.title.message as string}
                  </span>
                )}
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.title ? 'border-red-500' : 'border-gray-300 focus:ring-indigo-500'
                } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                {...register('title')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
                {errors.description && (
                  <span className="text-red-500 text-xs ml-1">
                    {errors.description.message as string}
                  </span>
                )}
              </label>
              <textarea
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.description ? 'border-red-500' : 'border-gray-300 focus:ring-indigo-500'
                } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                {...register('description')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date *
                  {errors.dueDate && (
                    <span className="text-red-500 text-xs ml-1">
                      {errors.dueDate.message as string}
                    </span>
                  )}
                </label>
                <input
                  type="date"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.dueDate ? 'border-red-500' : 'border-gray-300 focus:ring-indigo-500'
                  } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                  {...register('dueDate')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority *
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  {...register('priority')}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status *
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register('status')}
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <FiSave /> {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateTaskModal;