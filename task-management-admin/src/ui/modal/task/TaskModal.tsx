'use client';

import { Task } from '@/types';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon, CircleX } from 'lucide-react';

interface TaskProps {
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: Task;
}

export default function TaskModal({ open, setIsOpen, task }: TaskProps) {
  const closeModal = () => setIsOpen(false);

  const handleUpdate = () => {
    // Trigger update logic
    alert('Update clicked');
  };

  const handleDelete = () => {
    // Trigger delete logic
    alert('Delete clicked');
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // Status color mapping
  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    completed: 'bg-emerald-100 text-emerald-800',
    inprogress: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-rose-100 text-rose-800',
  };

  // Priority color mapping
  const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <Transition appear show={open} as={Fragment}>
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
                stiffness: 200
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
                  Task Details
                </Dialog.Title>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                >
                  <CircleX className="h-6 w-6 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                {[
                  { label: 'Title', value: task.title },
                  { label: 'Task ID', value: task._id },
                  { 
                    label: 'Description', 
                    value: task.description,
                    colSpan: 'sm:col-span-2',
                    className: 'whitespace-pre-wrap'
                  },
                  { 
                    label: 'Status', 
                    value: task.status,
                    badge: true,
                    color: statusColors[task.status.toLowerCase()] || 'bg-gray-100 text-gray-800'
                  },
                  { 
                    label: 'Priority', 
                    value: task.priority,
                    badge: true,
                    color: priorityColors[task.priority.toLowerCase()] || 'bg-gray-100 text-gray-800'
                  },
                  { label: 'Due Date', value: formatDate(task.dueDate) },
                  { label: 'Assigned To', value: task.assignTo },
                  { label: 'Created At', value: formatDate(task.createdAt) },
                  { label: 'Updated At', value: formatDate(task.updatedAt) },
                  { label: 'User ID', value: task.userId },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className={`${item.colSpan || ''} ${item.className || ''}`}
                  >
                    <span className="font-medium text-gray-500">{item.label}:</span>
                    {item.badge ? (
                      <span className={`${item.color} text-xs font-medium me-2 px-2.5 py-0.5 rounded-full inline-flex items-center mt-1`}>
                        {String(item.value).charAt(0).toUpperCase() + String(item.value).slice(1)}
                      </span>
                    ) : (
                      <p className="font-semibold text-gray-800">{item.value}</p>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="mt-8 flex justify-end gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDelete}
                  className="flex items-center cursor-pointer gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm"
                  style={{
                    background: 'linear-gradient(to right, #fff, #fff)',
                    boxShadow: '0 1px 3px 0 rgba(239, 68, 68, 0.3)',
                    border: '1px solid #ef4444'
                  }}
                >
                  <TrashIcon className="h-4 w-4  text-red-500" />
                  <span className="bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
                    Delete
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)'
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUpdate}
                  className="flex items-center gap-2 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm"
                  style={{
                    background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                    boxShadow: '0 1px 3px 0 rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <PencilIcon className="h-4 w-4 " />
                  Update
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}