// helpers/socket.ts
import { io } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_API_BASE_URL 

export const socket = io(URL || '', {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  autoConnect: false,
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});