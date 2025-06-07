// NotificationService.js
const {logger} = require('../utils')
class NotificationService {
    constructor(io) {
      if (!io) throw new Error('Socket.IO instance is required');
      this.io = io;
    }
  
    async sendTaskAssignment(userId, task) {
        try {
          if (!userId) throw new Error('User ID is required for notification');
          console.log(userId,task)
          this.io.to(String(userId)).emit('taskAssigned', {
            taskId: task._id,
            title: task.title,
            message: `You have been assigned a new task: "${task.title}"`,
            dueDate: task.dueDate,
            priority: task.priority
          });
          console.log("Emitting to userId:", userId); 

          logger.info(`Task assignment notification sent ONLY to user ${userId}`);
        } catch (error) {
          logger.error('Notification failed:', error);
          throw error;
        }
      }

    async editTaskDetails(userId,task){
      try{
        if (!userId) throw new Error('User ID is required for notification');
        this.io.to(String(userId)).emit('editTask', {
          taskId: task._id,
          title: task.title,
          message: `Task Assigned to you  has been edited by the user`,
          dueDate: task.dueDate,
          priority: task.priority
        });
      }catch(error){
        logger.error('Notification failed:', error);
        throw error;
      }
    }  
    }
  
  module.exports = NotificationService;