"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiTrash2,
  FiEdit2,
  FiClock,
  FiAlertCircle,
  FiFlag,
} from "react-icons/fi";
import { useAppDispatch } from "@/hooks/hooks";
import { deleteOne, update } from "@/redux/actions/taskAction";
import { assignUser } from "@/redux/actions/userAction";
import { socket } from "@/helpers/socket";
import { Task, User } from "@/types";
import UpdateTaskModal from "@/ui/modal/task/UpdateTaskModal";
import useAuth from "@/hooks/useAuth";

const TaskItem = ({ task, users }: { task: Task; users: User[] }) => {
  const dispatch = useAppDispatch();
  const {user} = useAuth()
  console.log(user._id)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [assignedUserId, setAssignedUserId] = useState(task.assignTo || "");

// pages/Dashboard.tsx or similar



  const handleSave = async (updatedTask: Task) => {
    console.log("Task updated:", updatedTask);
    dispatch(update(updatedTask, task._id || ""));
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteOne(id));
  };

  console.log(users, task);
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
    const taskId = task._id;
    setAssignedUserId(userId);
  
    try {
      await dispatch(assignUser(userId, taskId ?? ""));
    } catch (error) {
      console.error("Assignment failed:", error);
      setAssignedUserId(task.assignTo || "");
    }
  };
  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`bg-white bg-opacity-20 w-5xl backdrop-blur-md rounded-xl p-4 flex items-center justify-between shadow-lg ${
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
          <select value={assignedUserId} onChange={handleAssignies}>
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
            className=" hover:text-yellow-300 cursor-pointer transition"
          >
            <FiEdit2 onClick={() => setIsModalOpen(true)} />
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
      {isModalOpen && (
        <UpdateTaskModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          task={task}
        />
      )}
    </>
  );
};

export default TaskItem;
