const express = require('express');
const { userSchema } = require('../validation');
const { authController } = require('../controllers');
const {verifyData} = require('../middleware');
const router = express.Router();

router.post('/register',verifyData(userSchema),authController.register)
router.post('/login',verifyData(userSchema),authController.login)
router.post('/admin',verifyData(userSchema),authController.adminLogin)
router.post('/forgot-password',authController.forgotPassword)
router.post('/reset-password',authController.resetPassword)

module.exports = router