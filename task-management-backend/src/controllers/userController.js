const {responseManager, userManager} = require('../services')
const getUser = async(request,response) => {
    try{
        const result = await userManager.getUser()
        return responseManager.sendSuccessResponse(response,result,'User details fetched successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Cannot get all user')
    }
}

const assignUser = async(request,response) => {
    
    try{
        const result = await userManager.assignUser(request.body)
        return responseManager.sendSuccessResponse(response,result,'User Assigned Successfully')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Cannot assign user')
    }
}

module.exports = {getUser,assignUser}