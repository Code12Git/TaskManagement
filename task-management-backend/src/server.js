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

// Configure CORS properly - UPDATED ORIGINS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'https://task-management-frontend-gilt.vercel.app', 
];

// ENHANCED CORS OPTIONS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all Vercel deployments and localhost
    if (!origin || 
        allowedOrigins.some(allowed => origin === allowed || origin.endsWith('.vercel.app')) ||
        origin.includes('localhost')) {
      return callback(null, true);
    }
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Apply CORS middleware - MUST COME BEFORE ROUTES
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Socket.io configuration
const io = new socketIo.Server(server, {
  cors: {
    origin: corsOptions.origin,
    methods: corsOptions.methods,
    credentials: corsOptions.credentials
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
    allowedOrigins: allowedOrigins
  });
});

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 Server running at PORT: ${PORT}`);
  logger.info(`Allowed origins: ${allowedOrigins.join(', ')}`);
});

module.exports = { server, io };