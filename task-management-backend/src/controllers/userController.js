const {responseManager, userManager} = require('../services')
const NotificationService = require('../services/notificationManager')


// Get User
const getUser = async(request,response) => {
    try{
        const result = await userManager.getUser()
        return responseManager.sendSuccessResponse(response,result,'User details fetched successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Cannot get all user')
    }
}

// taskController.js
const assignUser = async (request, response) => {
    try {
        const io = request.app.get('io');   
        const notificationService = new NotificationService(io);
        
        const result = await userManager.assignUser(request.body);
        
        // Only send notification if assignment was successful
        if (result && result.assignTo) {
            await notificationService.sendTaskAssignment(
                result.assignTo,  
                {
                    _id: result._id || result.taskId,
                    title: result.title,
                    dueDate: result.dueDate,
                    priority: result.priority
                }
            );
        }

        return responseManager.sendSuccessResponse(response, result);
    } catch (error) {
        return responseManager.sendErrorResponse(response, error);
    }
};

// Count Users

const countUsers = async(request,response) => {
    try{
        const result = await userManager.countUsers()
        return responseManager.sendSuccessResponse(response,result,'User count fetched successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Cannot get all user')
    }
}

const deleteUser = async(request,response) => {
    try{
        const result = await userManager.deleteUser(request.params)
        return responseManager.sendSuccessResponse(response,result,'User deleted successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Cannot delete user')
    }
}


module.exports = {getUser,assignUser,countUsers,deleteUser}