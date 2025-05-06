const { logger } = require('../utils');

class SocketService {
  constructor(io) {
    if (!io) throw new Error('Socket.IO instance is required');
    this.io = io;
    this.initializeSocketEvents();
  }

  initializeSocketEvents() {
    this.io.on('connection', (socket) => {
      logger.info('New user connected', { socketId: socket.id });
      
      socket.on('join', (userId) => {
        this.handleJoinRoom(socket, userId);
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });

      socket.on('error', (err) => {
        this.handleSocketError(socket, err);
      });
    });
  }
// SocketService.js
handleJoinRoom(socket, userId) {
  // Leave any previous rooms to prevent duplicate messages
  const rooms = Object.keys(socket.rooms);
  rooms.forEach(room => {
    if (room !== socket.id) { // Don't leave the default room
      socket.leave(room);
    }
  });
  
  // Join the new room
  socket.join(userId);
  logger.info(`User ${userId} joined their room`, { socketId: socket.id });
}

  handleDisconnect(socket) {
    logger.info('User disconnected', { socketId: socket.id });
  }

  handleSocketError(socket, err) {
    logger.error('Socket error', { socketId: socket.id, error: err });
  }

  // Utility method to emit to specific user
  emitToUser(userId, event, data) {
    this.io.to(userId).emit(event, data);
  }

  // Utility method to broadcast to all except sender
  broadcastToAll(event, data, socketId) {
    this.io.except(socketId).emit(event, data);
  }
}

module.exports = SocketService;