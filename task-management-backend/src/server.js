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

const io = new socketIo.Server(server, {
  cors: {
    origin: ["http://localhost:3000","http://localhost:3002"],  
    methods: ["GET", "POST","PUT"],
    credentials: true
  }
});

new SocketService(io); 

const PORT = fromEnv('PORT') || 3001;

connectDB().catch(err => {
  logger.error('Database connection failed', err);
  process.exit(1);
});

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000","http://localhost:3002"], 
  credentials: true
}));
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