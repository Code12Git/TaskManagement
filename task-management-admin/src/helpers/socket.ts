import { io } from 'socket.io-client';

const URL =
  process.env.NODE_ENV === 'production'
    ? 'https://taskmanagement-mvcu.onrender.com'
    : 'http://localhost:3001';

export const socket = io(URL, {
  path: '/api/socket.io',
  transports: ['websocket', 'polling'],
  autoConnect: false,
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
