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
        
        const result = await userManager.assignUser(request.body,request.user);
        console.log("Result:",result)
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

        console.log("Assigning user ID:", request.user._id);
        console.log("Assignee user ID (should receive toast):", result.assignTo);

        return responseManager.sendSuccessResponse(response, result,'User assigned sucessfully!');
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

const changeRole = async(request,response) => {
    try{
        const result = await userManager.changeRole(request.body,request.params)
        return responseManager.sendSuccessResponse(response,result,'Role Changed Successfully')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Error fetching user')
    }
}


const updateUser = async(request,response) => {
    try{
        const result = await userManager.updateUser(request.body,request.params)
        return responseManager.sendSuccessResponse(response,result,'User Updated Successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Error Updating User')
    }
}


const uploadAvatar = async(request,response) => {
    console.log('Entered')
    try{
        const result = await userManager.uploadAvatar(request.files,request.user.id)
        return responseManager.sendSuccessResponse(response,result,'Avatar Uploaded Successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Error Updating Avatar')
    }
}

const userInfo = async(request,response) => {
    try{
        const result = await userManager.userInfo()
        return responseManager.sendSuccessResponse(response,result,'User Info fetched successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Error fetching userInfo')
    }
}


module.exports = {getUser,assignUser,countUsers,deleteUser,changeRole,updateUser,uploadAvatar,userInfo}