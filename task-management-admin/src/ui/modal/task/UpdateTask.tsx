'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, CircleX, ChevronDown } from 'lucide-react';
import { Task, TaskInput } from '@/types';
import { assignUser, fetchAllUsers } from '@/redux/actions/userAction'; // Assuming you have these actions
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { update } from '@/redux/actions/taskAction';
import { socket } from "@/helpers/socket";
import toast from 'react-hot-toast';

interface UpdateProps {
  updateModal: boolean;
  setIsUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  task: Task;
}

const UpdateTask = ({ updateModal, setIsUpdateModal, task }: UpdateProps) => {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector(state => state.user);
   const {adminData} = useAppSelector(state => state.auth);
   const [assignedUserId, setAssignedUserId] = useState(task?.assignTo?._id || "");

  useEffect(()=>{
    dispatch(fetchAllUsers())
  },[dispatch])  
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
  });

  useEffect(() => {
    if (!adminData?._id) return;
    socket.emit("join", adminData._id);
    const handleTaskAssigned = (data: { title: string }) => {
      toast.success(`New task assigned to you: ${data.title}`);
    };
    socket.on("taskAssigned", handleTaskAssigned);
    return () => {
      socket.off("taskAssigned", handleTaskAssigned);
    };
  }, [adminData?._id]);

  useEffect(() => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
  }, [task]);

  const closeModal = () => {
    setIsUpdateModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssignies = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    const taskId = task._id;
    setAssignedUserId(userId);
  
    try {
      await dispatch(assignUser(userId, taskId ?? ""));
    } catch (error) {
      console.error("Assignment failed:", error);
      setAssignedUserId(task.assignTo?._id || "");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (task._id) {
        const updateData:TaskInput = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          dueDate: new Date(formData.dueDate),
        };

        await dispatch(update(updateData, task._id));
        closeModal();
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <Transition appear show={updateModal} as={Fragment}>
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
                  Update Task
                </Dialog.Title>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                  className="focus:outline-none"
                >
                  <CircleX className="h-6 w-6 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Title Field */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Task title"
                      required
                    />
                  </div>

                  {/* Description Field */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Task description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Status Field */}
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="relative">
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
                        >
                          <option value="pending">Pending</option>
                          <option value="inprogress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Priority Field */}
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <div className="relative">
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Due Date Field */}
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="datetime-local"
                        id="dueDate"
                        name="dueDate"
                        value={formatDateForInput(formData.dueDate)}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>

                    {/* Assign To Field */}
                    <div>
                      <label htmlFor="assignTo" className="block text-sm font-medium text-gray-700 mb-1">
                        Assign To
                      </label>
                      <div className="relative">
                        <select
                          id="assignTo"
                          name="assignTo"
                          value={assignedUserId}
                          onChange={handleAssignies}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
                        >
                          <option value="">Unassigned</option>
                          {userData?.map((user) => (
                            <option value={user._id} key={user._id}>
                              {user.email}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
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
                    type="submit"
                    whileHover={{
                      scale: 1.03,
                      boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm"
                    style={{
                      background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                      boxShadow: '0 1px 3px 0 rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    <PencilIcon className="h-4 w-4" />
                    Update Task
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UpdateTask;