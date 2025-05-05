const express = require('express');
const taskRoutes = require('./taskRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();
console.log("Task and User routes mounted");

router.use('/tasks',taskRoutes)
router.use('/user',userRoutes)

module.exports = router;