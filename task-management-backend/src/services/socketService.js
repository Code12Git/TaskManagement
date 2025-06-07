const { logger } = require("../utils");

class SocketService {
  constructor(io) {
    if (!io) throw new Error("Socket.IO instance is required");
    this.io = io;
    this.initializeSocketEvents();
  }

  initializeSocketEvents() {
    this.io.on("connection", (socket) => {
      logger.info("New user connected", { socketId: socket.id });

      socket.on("join", (userId) => {
        this.handleJoinRoom(socket, userId);
      });

      socket.on("disconnect", () => {
        this.handleDisconnect(socket);
      });

      socket.on("error", (err) => {
        this.handleSocketError(socket, err);
      });
    });
  }
  handleJoinRoom(socket, userId) {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });

    socket.join(userId);
    logger.info(`User ${userId} joined their room`, { socketId: socket.id });
  }

  handleDisconnect(socket) {
    logger.info("User disconnected", { socketId: socket.id });
  }

  handleSocketError(socket, err) {
    logger.error("Socket error", { socketId: socket.id, error: err });
  }

  emitToUser(userId, event, data) {
    this.io.to(userId).emit(event, data);
  }

  broadcastToAll(event, data, socketId) {
    this.io.except(socketId).emit(event, data);
  }
}

module.exports = SocketService;
