const {responseManager, taskManager} = require('../services')

const create = async(request,response) => {
    try{
        const result = await taskManager.create(request.body,request.user)
        return responseManager.sendSuccessResponse(response,result,'Task Created Successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Cannot Create Task')
    }
}


const update = async(request,response) => {
    try{
        const result = await taskManager.update(request.body,request.params)
        return responseManager.sendSuccessResponse(response,result,'Task Updated Successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Cannot Update Task')
    }
}

const deleteOne = async(request,response) => {
    try{
        const result = await taskManager.deleteOne(request.params)
        return responseManager.sendSuccessResponse(response,result,'Task Deleted Successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Cannot Delete Task')
    }
}

const get = async(request,response) => {
        try{
            const result = await taskManager.get(request.params)
            return responseManager.sendSuccessResponse(response,result,'Task fetched Successfully!')
        }catch(err){
            throw responseManager.sendErrorResponse(response,err,'Cannot fetch task')
        }
}

const getAllTaskByUser = async(request,response) => {
    try{
        const result = await taskManager.getAllTaskByUser(request.user)
        return responseManager.sendSuccessResponse(response,result,'Task fetched Successfully!')  
    }catch(err){
        throw responseManager.sendErrorResponse(response,err,'Cannot fetch tasks')
        
    }
}

const getAll = async(request,response) => {
    try{
        const result = await taskManager.getAll()
        return responseManager.sendSuccessResponse(response,result,'All Tasks fetched successfully!')
    }catch(err){
        throw responseManager.sendErrorResponse(response,err,'No task found')
    }
}



module.exports = {create,update,deleteOne,get,getAll,getAllTaskByUser}