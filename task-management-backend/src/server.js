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

const allowedOrigins = [
  'https://task-management-pi-virid.vercel.app/',
  /\.vercel\.app$/, 
  /\.now\.sh$/,    
  'http://localhost:3000', 
 
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
     if (!origin) return callback(null, true);
    
     if (allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') {
        return origin === pattern;
      } else if (pattern instanceof RegExp) {
        return pattern.test(origin);
      }
      return false;
    })) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

app.use(cors(corsOptions));

const io = socketIo(server, {
  cors: corsOptions,
  path: '/api/socket.io',
    transports: ["websocket", "polling"],  
    pingTimeout: 60000,
    pingInterval: 25000,
    cookie: false
});

new SocketService(io);


const PORT = fromEnv('PORT') || 3001;

connectDB().catch(err => {
  logger.error('Database connection failed', err);
  process.exit(1);
});

app.use(express.json());
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