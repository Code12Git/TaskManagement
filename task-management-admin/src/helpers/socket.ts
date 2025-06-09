import { io } from 'socket.io-client';

const URL =  'https://taskmanagement-mvcu.onrender.com';

export const socket = io(URL);