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
        const result = await authManager.adminLogin(request.body)
        return responseManager.sendSuccessResponse(response,result,'Admin login successfull')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Admin Login Error')
    }
}


const forgotPassword = async(request,response) => {
    try{
        const result = await authManager.forgotPassword(request.body)
        return responseManager.sendSuccessResponse(response,result,'Link Send Successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Password Forgot Error')
    }
}


const resetPassword = async(request,response) => {
    try{
        const result = await authManager.resetPassword(request.body)
        return responseManager.sendSuccessResponse(response,result,'Password Reset Successfully')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Password Reset Error')
    }
}

module.exports = { register,login,adminLogin,forgotPassword,resetPassword }