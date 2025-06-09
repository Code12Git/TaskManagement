'use client';

import { Dialog, Transition } from '@headlessui/react';
import z from 'zod'
import { Fragment, useEffect, useState } from 'react';
import {  SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { PlusIcon, CircleX, ChevronDown } from 'lucide-react';
import { generateDescription, generatePriority } from '@/helpers/openai';
import taskSchema from '@/validations/taskSchema';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { create, getAllTasks } from '@/redux/actions/taskAction';

interface CreateProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type TaskForm = z.infer<typeof taskSchema>;


const CreateTask = ({ isModalOpen, setIsModalOpen }: CreateProps) => {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: new Date(),
      priority: undefined,
      status: undefined,
    },
  });
  const dispatch = useAppDispatch();

  const title = watch('title')
  const [isGenerating,setIsGenerating] = useState(false)


  useEffect(() => {
    const generateTaskDetails = async () => {
      if (title && title.length > 3 && !watch('description')) {
        setIsGenerating(true);
        try {
          const [generatedDesc, generatedPrior] = await Promise.all([
            generateDescription(title),
            generatePriority(title)
          ]);
          
          setValue('description', generatedDesc || '');
          
          // Ensure the priority is one of the valid options
          const validPriorities = ['low', 'medium', 'high'];
          const priority = validPriorities.includes(generatedPrior?.toLowerCase()) 
            ? generatedPrior.toLowerCase()
            : 'medium';
            
          setValue('priority', priority as 'low' | 'medium' | 'high');
        } catch (error) {
          console.error('Failed to generate task details:', error);
        } finally {
          setIsGenerating(false);
        }
      }
    };

    const timer = setTimeout(generateTaskDetails, 1000);
    return () => clearTimeout(timer);
  }, [title, setValue, watch]);


  const closeModal = () => {
    setIsModalOpen(false);
    reset()
  };

  const onSubmit: SubmitHandler<TaskForm> = async (formData) => {
    await dispatch(create(formData))
    await dispatch(getAllTasks());
    closeModal();
  }


  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-gray-900/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 200,
              }}
              className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 text-left shadow-xl shadow-blue-900/10 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title
                  as={motion.h3}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  Create New Task
                </Dialog.Title>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                >
                  <CircleX className="h-6 w-6 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {/* Title Field */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...register('title')}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Task title"
                  />
                </div>
                {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}

                {/* Description Field */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description {isGenerating && <span className="text-blue-500">(Generating...)</span>}
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    {...register('description')}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Task description"
                  />
                </div>
                {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Field */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        id="status"
                        {...register('status')}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
                      >
                        <option value="not-started">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>

                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                    {errors.status && (
              <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
            )}

                  {/* Priority Field */}
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Priority {isGenerating && <span className="text-blue-500">(Generating...)</span>}
                    </label>
                    <div className="relative">
                      <select
                        id="priority"
                        {...register('priority')}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                    {errors.priority && (
              <p className="text-red-600 text-sm mt-1">{errors.priority.message}</p>
            )}

                  {/* Due Date Field */}
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      id="dueDate"
                     {...register('dueDate')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  {errors.dueDate && (
              <p className="text-red-600 text-sm mt-1">{errors.dueDate.message}</p>
            )}                 
                </div>
              </div>

              <motion.div
                className="mt-8 flex justify-end gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={closeModal}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  disabled={isSubmitting || isGenerating}
                  onClick={handleSubmit(onSubmit)}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm"
                  style={{
                    background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                    boxShadow: '0 1px 3px 0 rgba(99, 102, 241, 0.3)',
                  }}
                >
                  <PlusIcon className="h-4 w-4" />
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                  </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateTask;