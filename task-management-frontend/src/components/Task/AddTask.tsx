'use client';
import { motion } from 'framer-motion';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import taskSchema from '@/validations/task/taskValidation';
import { Task } from '@/types';
import { useAppDispatch } from '@/hooks/hooks';
import { create } from '@/redux/actions/taskAction';
import { useRouter } from 'next/navigation';

const AddTask = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Task>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'not-started',
    },
  });

  const onSubmit: SubmitHandler<Task> = async (formData) => {
    try {
      await dispatch(create(formData));
      router.push('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-lg space-y-6"
      >
        <motion.h1
          className="text-3xl font-bold text-gray-800 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Add New Task
        </motion.h1>

        <div className="space-y-4">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
              Title*
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className={`w-full p-3 rounded-xl border text-gray-800 ${
                errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-purple-400`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className={`w-full p-3 rounded-xl border text-gray-800 ${
                errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-purple-400`}
              placeholder="Enter task description"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Due Date Field */}
          <div>
            <label htmlFor="dueDate" className="block text-gray-700 font-medium mb-1">
              Due Date*
            </label>
            <input
              id="dueDate"
              type="date"
              {...register('dueDate')}
              className={`w-full p-3 rounded-xl border text-gray-800 ${
                errors.dueDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-purple-400`}
            />
            {errors.dueDate && (
              <p className="text-red-600 text-sm mt-1">{errors.dueDate.message}</p>
            )}
          </div>

          {/* Priority Field */}
          <div>
            <label htmlFor="priority" className="block text-gray-700 font-medium mb-1">
              Priority*
            </label>
            <select
              id="priority"
              {...register('priority')}
              className={`w-full p-3 rounded-xl border text-gray-800 ${
                errors.priority ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-purple-400`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p className="text-red-600 text-sm mt-1">{errors.priority.message}</p>
            )}
          </div>

          {/* Status Field */}
          <div>
            <label htmlFor="status" className="block text-gray-700 font-medium mb-1">
              Status*
            </label>
            <select
              id="status"
              {...register('status')}
              className={`w-full p-3 rounded-xl border text-gray-800 ${
                errors.status ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-purple-400`}
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && (
              <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full ${
            isSubmitting ? 'bg-purple-400' : 'bg-purple-600'
          } text-white py-3 rounded-xl font-semibold shadow-md hover:bg-purple-700 transition duration-300`}
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddTask;