const mongoose = require('mongoose');
const {fromEnv} = require('../utils');  
const {logger} = require('../utils');

async function connectDB() {
    try {
        await mongoose.connect(fromEnv('NOSQL_DATABASE_URL'));
        logger.info('🛢 Connected to database');
    } catch (error) {
        logger.error('Error connecting to database:', error);
    }
}

module.exports = connectDB; 
