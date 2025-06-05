// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Task, User } from '@/types';
import TaskItem from './TaskItem';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { fetchUser } from '@/redux/actions/userAction';
import toast from 'react-hot-toast';
import { socket } from '@/helpers/socket';

interface TaskListProps {
  tasks: Task[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  const dispatch = useAppDispatch();
  const { filteredData } = useAppSelector((state) => state.tasks);
  const { userData } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const res = await dispatch(fetchUser());
      if (res && res.data) {
        setUsers(res.data);
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
  
  return (
    <motion.div layout className="space-y-4">
      {tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-8 text-center"
        >
          <p className="text-lg">No tasks yet. Add one above!</p>
        </motion.div>
      ) : filteredData && filteredData.length > 0 ? (
        filteredData.map((task) => (
          <TaskItem key={task._id} task={task} users={users} />
        ))
      ) : (
        tasks.map((task) => <TaskItem key={task._id} task={task} users={users} />)
      )}
    </motion.div>
  );
};

export default TaskList;