const { createClient } = require('redis');
const { fromEnv } = require('../utils');


const REDIS_CONFIG = {
    url: fromEnv('REDIS_URL') || 'redis://localhost:6379',
    socket: {
      reconnectStrategy: (retries) => {
        logger.warn(`Redis connection retry attempt: ${retries}`);
        return Math.min(retries * 100, 5000);
      }
    }
  };
  

  const redisClient = createClient(REDIS_CONFIG);


module.exports = redisClient;