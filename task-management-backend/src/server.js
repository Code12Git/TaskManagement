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

// Configure CORS properly
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'https://task-management-beta-lime.vercel.app',
  'http://localhost:3000' // Add localhost for development
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Socket.io configuration
const io = new socketIo.Server(server, {
  cors: corsOptions
});
new SocketService(io); 

const PORT = fromEnv('PORT') || 3002;

connectDB().catch(err => {
  logger.error('Database connection failed', err);
  process.exit(1);
});

app.use(express.json());
app.options('*', cors(corsOptions)); // Enable preflight for all routes

app.use('/api', routes); 

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'Your Service Name'
  });
});

app.set('io', io);

server.listen(PORT, () => {
  logger.info(`🚀 Server running at PORT: ${PORT}`);
});

module.exports = { server, io };