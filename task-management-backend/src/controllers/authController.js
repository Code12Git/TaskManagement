const {responseManager, authManager} = require('../services')

const register = async(request,response) => {
    try{
        const result = await authManager.register(request.body)
        return responseManager.sendSuccessResponse(response,result,'User Created Successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Cannot Create User')
    }
}

const login = async(request,response) => {
    try{
        const result = await authManager.login(request.body)
        return responseManager.sendSuccessResponse(response,result,'User login successfull')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Error login user')
    }
}

const adminLogin = async(request,response) => {
    try{
        const result = await authManager.adminLogin()
        return responseManager.sendSuccessResponse(response,result,'Admin login successfull')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Admin Login Error')
    }
}



module.exports = { register,login,adminLogin }