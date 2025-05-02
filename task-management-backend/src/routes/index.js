const express = require('express');
const taskRoutes = require('./taskRoutes');
const router = express.Router();

router.use('/task',taskRoutes)
module.exports = router;