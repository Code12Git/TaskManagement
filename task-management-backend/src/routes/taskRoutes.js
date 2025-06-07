const express = require('express');
const { taskSchema } = require('../validation');
const { taskController } = require('../controllers');
const {verifyData} = require('../middleware');
const {verifyToken} = require('../middleware/verifyToken');
const router = express.Router();

router.post('/',verifyData(taskSchema),verifyToken,taskController.create)

router.put('/allTasks',verifyToken,taskController.updateTasks)
router.delete('/:id',verifyToken,taskController.deleteOne)

router.put('/:id',verifyToken,taskController.update)

router.get('/allTasks',taskController.getAll)


router.get('/:id',taskController.get)



router.get('/',verifyToken,taskController.getAllTaskByUser)

module.exports = router