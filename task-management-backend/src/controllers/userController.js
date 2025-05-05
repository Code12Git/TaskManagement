const {responseManager, userManager} = require('../services')
const {redisClient} = require('../server')

const register = async(request,response) => {
    try{
        const result = await userManager.register(request.body)
        return responseManager.sendSuccessResponse(response,result,'User Created Successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Cannot Create User')
    }
}

const login = async(request,response) => {
    try{
        const result = await login({
            ...request.body,
            ip: request.ip,
            userAgent: request.headers['user-agent']
          }, redisClient);  // Pass redisClient here        
          return responseManager.sendSuccessResponse(response,result,'User Logged In Successfully!')
    }catch(err){
        return responseManager.sendErrorResponse(response,err,'Cannot login User')
    }
}


module.exports = {register,login}