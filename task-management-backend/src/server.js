const express = require('express');
const { fromEnv } = require('./utils');
const { logger } = require('./utils');
const connectDB = require('./config');  
const cors = require('cors');
const app = express();
const PORT = fromEnv('PORT') || 3002;
connectDB();

// Middleware
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});


app.listen(PORT, () => {
  logger.info(`🚀 Server running at PORT: ${PORT}`);
});