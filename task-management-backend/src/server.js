const express = require('express');
const { fromEnv } = require('./utils');
const { createServer } = require('node:http');
const socketIo = require('socket.io');
const { logger } = require('./utils');
const connectDB = require('./config/connection');  
const routes = require('./routes');
const cors = require('cors');
const SocketService = require('./services/socketService');
const app = express();
const server = createServer(app);

// ✅ Allow all origins for REST API
app.use(cors({
  origin: 'https://task-management-frontend-5hsxo9uol-code12gits-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
// app.options('*', cors()); // Allow preflight for all routes

// ✅ Allow all origins for Socket.io
const io = new socketIo.Server(server, {
  cors: {
    origin: 'https://task-management-frontend-5hsxo9uol-code12gits-projects.vercel.app', // Allow all
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  },
  transports: ['websocket', 'polling']
});
new SocketService(io);

const PORT = fromEnv('PORT') || 3002;

// Database connection
connectDB().catch(err => {
  logger.error('Database connection failed', err);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'Task Management API',
    allowedOrigins: '*'
  });
});

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 Server running at PORT: ${PORT}`);
  logger.info(`Allowed origins: *`);
});

module.exports = { server, io };
