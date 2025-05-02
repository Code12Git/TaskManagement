const {responseManager, userManager} = require('../services')

const register = async(request,response) => {
    try{
        const result = await userManager.register(request.body)
        return responseManager.sendSuccessResponse(response,result,'User Created Successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Cannot Create User')
    }
}

const login = () => {
    
}


module.exports = {register}