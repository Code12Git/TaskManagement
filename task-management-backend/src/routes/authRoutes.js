const express = require('express');
const { userSchema } = require('../validation');
const { authController } = require('../controllers');
const {verifyData} = require('../middleware');
const router = express.Router();

router.post('/register',verifyData(userSchema),authController.register)
router.post('/login',verifyData(userSchema),authController.login)
module.exports = router