const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { userController } = require('../controllers');
const router = express.Router();


router.get('/',verifyToken,userController.getUser)
router.post('/assign',verifyToken,userController.assignUser)

module.exports = router