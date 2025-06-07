"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {  getAll } from "@/redux/actions/taskAction";
import LoadingSpinner from "@/app/LoadingSpinner";
import ErrorDisplay from "@/app/ErrorDisplay";
import SearchBar from "./SearchBar";
import TaskSummary from "./TaskSummary";
import TaskBoard from "./TaskBoard";


const Tasks = () => {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    taskData = [],
    error,
  } = useAppSelector((state) => {
    const tasks = state.tasks || {};
    return {
      isLoading: tasks.isLoading || false,
      taskData: Array.isArray(tasks.taskData) ? tasks.taskData : [],
      error: tasks.error || null,
    };
  });

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold  mb-2">Your Tasks</h1>
          <p className="text-lg  text-opacity-80">
            Organize your work and life
          </p>
        </div>
        <SearchBar />
        <TaskBoard initialTasks={taskData}/>

        {taskData.length > 0 && <TaskSummary tasks={taskData} />}
      </motion.div>
    </div>
  );
};






export default Tasks;