const express = require('express');
const {verifyToken,verifyTokenAndAdmin} = require('../middleware/verifyToken');
const { userController } = require('../controllers');
const { upload } = require('../middleware');
const router = express.Router();


router.get('/',verifyToken,userController.getUser)
router.post('/assign',verifyToken,userController.assignUser)
router.get('/count',verifyTokenAndAdmin,userController.countUsers)
router.delete('/:userId',verifyTokenAndAdmin,userController.deleteUser)
router.put('/:userId',verifyTokenAndAdmin,userController.changeRole)
router.put('/:userId',verifyToken,userController.updateUser)
router.post('/upload-avatar',verifyToken,upload.fields([
    {
        name: "avatarUrl",
        maxCount: 1,
    },
]),userController.uploadAvatar)
router.get('/info',verifyTokenAndAdmin,userController.userInfo)

module.exports = router