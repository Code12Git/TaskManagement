'use client'
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiTrash2,
  FiEdit2,
  FiClock,
  FiAlertCircle,
  FiFlag,
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { deleteOne,} from "@/redux/actions/taskAction";
import { assignUser, fetchUser } from "@/redux/actions/userAction";
import { socket } from "@/helpers/socket";
import toast from "react-hot-toast";
import { Task } from "@/types";
const TaskItem = ({ task }: { task: Task }) => {
    const dispatch = useAppDispatch();
    const {userData} = useAppSelector(state=>state.auth)
    const { users } = useAppSelector((state) => state.user);
    console.log(users);
    console.log(task)
  
    useEffect(() => {
      dispatch(fetchUser());
      if (!userData) return;
  
    // Join the user's personal room when they load the app
    socket.emit('join', userData._id);
  
    const handleTaskAssigned = (data: {title:string}) => {
      toast.success(`New task assigned to you: ${data.title}`); // Only the assignee sees this
    };
  
    socket.on('taskAssigned', handleTaskAssigned);
  
    return () => {
      socket.off('taskAssigned', handleTaskAssigned);
    };
  }, [userData,dispatch]);
  
    const handleDelete = async (id: string) => {
      await dispatch(deleteOne(id));
    };
  
    const statusColors = {
      completed: "bg-green-500",
      "in-progress": "bg-amber-400",
      "not-started": "bg-red-500",
    };
  
    const priorityIcons = {
      high: <FiAlertCircle className="text-red-400" />,
      medium: <FiFlag className="text-amber-400" />,
      low: <FiClock className="text-blue-400" />,
    };
    const handleAssignies = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const userId = e.target.value;
      const taskId = task._id
      
      try {
        // Join the user's room before dispatching the assignment
        socket.emit('join', userId);
        
        // Dispatch the assignment action
        await dispatch(assignUser(userId, taskId ?? ""));
        
        console.log(`Task ${task._id} assigned to user ${userId}`);
      } catch (error) {
        console.error('Assignment failed:', error);
      }
    };
  
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-4 flex items-center justify-between shadow-lg ${
          task.status === "completed" ? "opacity-80" : ""
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              statusColors[task.status || "not-started"]
            }`}
          >
            {task.status === "completed" && <FiCheck className="" />}
          </div>
  
          <div className="flex flex-col flex-1 min-w-0">
            <span
              className={` truncate ${
                task.status === "completed" ? "line-through opacity-70" : ""
              }`}
            >
              {task.title}
            </span>
            <span className="text-xs  text-opacity-60 truncate">
              {task.description}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs  text-opacity-60">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
              <span className="text-xs  text-opacity-60 flex items-center gap-1">
                {priorityIcons[task.priority || "low"]}
                {task.priority}
              </span>
            </div>
          </div>
        </div>
  
        <div className="flex gap-2 ml-4">
          <p className="text-lg font-bold">Assigned to</p>
          <select onChange={handleAssignies}>
            {users?.map((user, index) => (
              <option value={user._id} key={index}>
                {user.email}
              </option>
            ))}
          </select>
         
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              New assignment!
            </span>
        
  
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className=" hover:text-yellow-300 transition"
          >
            <FiEdit2 />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className=" hover:text-red-300 cursor-pointer transition"
          >
            <FiTrash2 onClick={() => handleDelete(task._id ?? "")} />
          </motion.button>
        </div>
      </motion.div>
    );
  };

export default TaskItem