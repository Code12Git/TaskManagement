import { io } from 'socket.io-client';

const URL =  'https://taskmanagement-mvcu.onrender.com';

export const socket = io(URL || '', {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    autoConnect: false,
    withCredentials: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });