const express = require('express');
const {verifyToken,verifyTokenAndAdmin} = require('../middleware/verifyToken');
const { userController } = require('../controllers');
const router = express.Router();


router.get('/',verifyToken,userController.getUser)
router.post('/assign',verifyToken,userController.assignUser)
router.get('/count',verifyTokenAndAdmin,userController.countUsers)
router.delete('/:userId',verifyTokenAndAdmin,userController.deleteUser)
router.put('/:userId',verifyTokenAndAdmin,userController.changeRole)
module.exports = router