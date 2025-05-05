const express = require('express');
const { taskSchema } = require('../validation');
const { taskController } = require('../controllers');
const {verifyData} = require('../middleware')
const router = express.Router();

router.post('/',verifyData(taskSchema),taskController.create)

router.delete('/:id',taskController.deleteOne)

router.put('/:id',verifyData(taskSchema),taskController.update)

router.get('/:id',taskController.get)

router.get('/',taskController.getAll)

module.exports = router