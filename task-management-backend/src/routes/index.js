const express = require('express');
const taskRoutes = require('./taskRoutes');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.use('/tasks',taskRoutes)
router.use('/user',userRoutes)
router.use('/auth',authRoutes)

module.exports = router;