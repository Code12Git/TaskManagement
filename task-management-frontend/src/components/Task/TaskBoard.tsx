"use client";
import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Task, User } from '@/types';
import TaskItem from './TaskItem';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchUser } from '@/redux/actions/userAction';
import toast from 'react-hot-toast';
import { socket } from '@/helpers/socket';

const TaskBoard = ({ tasks }: { tasks: Task[] }) => {
  const dispatch = useAppDispatch();
  const { filteredData } = useAppSelector((state) => state.tasks);
  const { userData } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [taskItems, setTaskItems] = useState<Task[]>(tasks);

  useEffect(() => {
    setTaskItems(tasks);
  }, [tasks]);

  const groupedTasks = tasks.reduce((acc: Record<string, Task[]>, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {});

  const groupedFilteredTasks = filteredData?.reduce((acc: Record<string, Task[]>, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {}) || {};

  useEffect(() => {
    const getUser = async () => {
      const res = await dispatch(fetchUser());
      if (res && res.data) {
        setUsers(Array.isArray(res.data) ? res.data : [res.data]);
      }
    };
    getUser();
  }, [dispatch]);

  useEffect(() => {
    if (!userData?._id) return;
    socket.emit('join', userData._id);
    const handleTaskAssigned = (data: { title: string }) => {
      toast.success(`New task assigned to you: ${data.title}`);
    };
    socket.on('taskAssigned', handleTaskAssigned);
    return () => {
      socket.off('taskAssigned', handleTaskAssigned);
    };
  }, [userData?._id]);

   const getTasksToDisplay = (status: string) => {
    if (filteredData && filteredData.length > 0) {
       return groupedFilteredTasks[status] || [];
    }
     return groupedTasks[status] || [];
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or if the item was dropped back to its original position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    // Find the task that was dragged
    const startColumn = source.droppableId;
    const finishColumn = destination.droppableId;

    // If moving within the same column
    if (startColumn === finishColumn) {
      const newTasks = Array.from(groupedTasks[startColumn]);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      setTaskItems(prevTasks => 
        prevTasks.map(task => 
          task.status === startColumn ? 
          { ...task, order: newTasks.findIndex(t => t._id === task._id) } : 
          task
        )
      );
      return;
    }

    // If moving to a different column
    const startTasks = Array.from(groupedTasks[startColumn] || []);
    const finishTasks = Array.from(groupedTasks[finishColumn] || []);
    const [removed] = startTasks.splice(source.index, 1);

    // Update the status of the moved task
    const updatedTask = { ...removed, status: finishColumn };
    finishTasks.splice(destination.index, 0, updatedTask);

    setTaskItems(prevTasks => 
      prevTasks.map(task => {
        if (task._id === draggableId) {
          return { ...task, status: finishColumn };
        }
        return task;
      })
    );

    // Here you would typically also make an API call to update the task status in your backend
  };

  return (
    <div className="min-h-screen w-screen mb-12 rounded bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-8xl mx-auto"
      >
        <DragDropContext onDragEnd={onDragEnd} >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Task Dashboard
          </h1>
          <div className="flex gap-2">
            {['Not Started', 'In Progress', 'Completed'].map((status) => (
              <div key={status} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${
                  status === 'Not Started' ? 'bg-red-500' :
                  status === 'In Progress' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <span className="text-sm text-gray-600">{status}</span>
              </div>
            ))}
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { status: 'not-started', title: 'Not Started', color: 'red' },
              { status: 'in-progress', title: 'In Progress', color: 'amber' },
              { status: 'completed', title: 'Completed', color: 'emerald' }
            ].map((column) => (
              <Droppable key={column.status} droppableId={column.status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="h-full"
                  >
                    <Column 
                      title={column.title}
                      status={column.status}
                      color={column.color}
                      tasks={getTasksToDisplay(column.status)}
                      users={users}
                      isFiltering={!!filteredData && filteredData.length > 0}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </motion.div>
    </div>
  );
};

interface ColumnProps {
  title: string;
  status: string;
  color: string;
  tasks: Task[];
  users: User[];
  isFiltering: boolean;
}

const Column = ({ 
  title, 
  color,
  tasks, 
  users,
  isFiltering
}: ColumnProps) => {
  const colorMap = {
    red: { bg: 'bg-red-500', bgLight: 'bg-red-100', text: 'text-red-800', hover: 'hover:bg-red-600' },
    amber: { bg: 'bg-amber-500', bgLight: 'bg-amber-100', text: 'text-amber-800', hover: 'hover:bg-amber-600' },
    emerald: { bg: 'bg-emerald-500', bgLight: 'bg-emerald-100', text: 'text-emerald-800', hover: 'hover:bg-emerald-600' }
  };

  const colorClass = colorMap[color as keyof typeof colorMap];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-full flex flex-col w-full"
    >
      <div className={`border-t-4 ${colorClass.bg} bg-white rounded-lg shadow-sm h-full flex flex-col`}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${colorClass.bg}`}></div>
              {title}
            </h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass.bgLight} ${colorClass.text}`}>
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              {isFiltering && tasks.length === 0 && ' (filtered)'}
            </span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItem key={task._id} task={task} users={users} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              {isFiltering ? 'No matching tasks' : 'No tasks in this column'}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-2 text-sm font-medium rounded-md ${colorClass.bg} text-white ${colorClass.hover} transition-colors`}
          >
            + Add Task
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskBoard;