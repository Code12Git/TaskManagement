const { userModel, taskModel } = require("../models");
const { io } = require("../server");
const { AppError} = require("../utils");
const {
  NOT_FOUND,
} = require("../utils/errors");

const getUser = async() => {
    try{
      const user = await userModel.find()
      if(!user) throw new AppError({...NOT_FOUND,message:"No user exist in database"})
        return user;
    }catch(err){
      throw err;
    }
}

const assignUser = async(body,io) => {
    console.log(body)
    const {taskId,userId} = body;
    try{
        const task = await taskModel.findById(taskId)
        if(!task) throw new AppError({...NOT_FOUND,message:'Task not found'})
        const user = await userModel.findById(userId)
        if(!user) throw new AppError({...NOT_FOUND,message:'User not found'})
        task.assignTo = userId    
        await task.save()
        return task;
    }catch(err){
        throw err;
    }
}


module.exports = {getUser,assignUser}