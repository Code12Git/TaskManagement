const express = require('express');
const { fromEnv } = require('./utils');
const { createClient } = require('redis');
const { logger } = require('./utils');
const connectDB = require('./config');  
const routes = require('./routes');
const cors = require('cors');
// const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

// Configuration constants
const SERVER_PORT = fromEnv('PORT') || 3002;
const REDIS_CONFIG = {
  url: fromEnv('REDIS_URL') || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      logger.warn(`Redis connection retry attempt: ${retries}`);
      return Math.min(retries * 100, 5000);
    }
  }
};


// Enhanced CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000'], // Array of allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Critical middleware - ordered correctly
// app.use(helmet()); // Security headers first
app.use(cors(corsOptions)); // CORS before other middleware

app.use(express.json({ limit: '10kb' })); // Body parsing
app.use(express.urlencoded({ extended: true })); // URL-encoded data

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests, please try again later'
    });
  }
});

const redisClient = createClient(REDIS_CONFIG);

async function startServer() {
  // Redis connection
  redisClient.on('error', err => logger.error('Redis Client Error:', err));
  redisClient.on('ready', () => logger.info('Redis client ready'));
  redisClient.on('reconnecting', () => logger.warn('Redis client reconnecting'));
  
  try {
    await redisClient.connect();
    logger.info('✅ Connected to Redis successfully');
  } catch (err) {
    logger.error('❌ Failed to connect to Redis:', err);
    process.exit(1);
  }

  // Database connection
  try {
    await connectDB();
    logger.info('✅ Database connected successfully');
  } catch (err) {
    logger.error('❌ Database connection failed:', err);
    process.exit(1);
  }

  // Apply rate limiting to API routes
  app.use('/api', apiLimiter);
  
  // Attach Redis client to app context
  app.locals.redis = redisClient;
  
  // Routes - moved after all middleware but before error handlers
  app.use('/api',routes);
  
  // Root endpoint
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      redis: redisClient.isReady ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Health check endpoint
  app.get('/health', async (req, res) => {
    try {
      await redisClient.set('healthcheck', 'ok', { EX: 10 });
      const redisValue = await redisClient.get('healthcheck');
      
      res.status(200).json({
        status: 'healthy',
        components: {
          database: true,
          redis: redisValue === 'ok',
          memory: process.memoryUsage(),
          uptime: process.uptime()
        },
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      res.status(503).json({
        status: 'unhealthy',
        error: err.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Not found handler (after all other routes)
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler (must be last middleware)
  app.use((err, req, res, next) => {
    logger.error('Server error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  const server = app.listen(SERVER_PORT, () => {
    logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${SERVER_PORT}`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    
    try {
      await redisClient.quit();
      logger.info('Redis connection closed');
    } catch (err) {
      logger.error('Error closing Redis connection:', err);
    }
    
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    
    setTimeout(() => {
      logger.error('Forcing shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled rejection:', err);
    shutdown('unhandledRejection');
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception:', err);
    shutdown('uncaughtException');
  });
}

startServer().catch(err => {
  logger.error('Fatal error during server startup:', err);
  process.exit(1);
});

module.exports = { app, redisClient };
