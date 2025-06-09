// components/SocketProvider.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { socket } from '@/helpers/socket';
import { useAuth } from '@/hooks/useAuth';
import customToast from '@/hooks/customToast';

export default function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id) return;

    const connect = () => {
      if (!socket.connected) {
        socket.connect();
      }
    };

    const handleConnect = () => {
      socket.emit('join', user._id);
    };

    const handleError = (err: Error) => {
      console.error('Socket error:', err);
      setTimeout(connect, 5000);
    };

    const handleTaskAssigned = (data: { title: string; message: string }) => {
      customToast(data.title, data.message);
    };

    const handleTaskEdited = (data: { title: string; message: string }) => {
      customToast(data.title, data.message);
    };

    connect();

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleError);
    socket.on('taskAssigned', handleTaskAssigned);
    socket.on('editTask', handleTaskEdited);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleError);
      socket.off('taskAssigned', handleTaskAssigned);
      socket.off('editTask', handleTaskEdited);
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [user?._id]);

  return <>{children}</>;
}