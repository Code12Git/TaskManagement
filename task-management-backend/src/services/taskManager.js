const {taskModel} = require('../models')
const _ = require('lodash');
const { AppError } = require('../utils');
const { NOT_FOUND } = require('../utils/errors');

const create = async(body,user) => {
    const {title,description,dueDate,priority,status} = body;
    try{
        const task = await taskModel.create({
            title,
            description,
            dueDate,
            priority,
            status,
            userId:user._id
        })
        return task;
    }catch(err){
        throw err;
    }
}

const update = async (body, params) => {
    const { title, description, dueDate, priority, status } = body;
    const { id } = params;
    
    try {
      const updatedTask = await taskModel.findByIdAndUpdate(
        id,
        {
          title,
          description,
          dueDate: new Date(dueDate), 
          priority,
          status
        },
        { new: true, runValidators: true }  
      );
      
      if (!updatedTask) throw new AppError({ ...NOT_FOUND, message: 'Task not found' });
      
      return updatedTask;
    } catch (err) {
      throw err;
    }
  };
const deleteOne = async(params) => {
    const {id} = params;
    try{
        const deletedTask = await taskModel.findByIdAndDelete(id)
        if(!deletedTask) throw new AppError({...NOT_FOUND,message:'Task not found'})
    }catch(err){
        throw err;
    }
}

const get = async(params) => {
    const {id} = params;
    try{
        const getTask = await taskModel.findById(id)
        if(!getTask) throw new AppError({...NOT_FOUND,message:"Task not present"})
    }catch(err){
        throw err;
    }
}

const getAllTaskByUser = async (user) => {
    try {
      const tasks = await taskModel.find({ userId: user._id });  
      if (!tasks || tasks.length === 0)  throw new AppError({ ...NOT_FOUND, message: 'No tasks found for this user' });
      
      return tasks;
    } catch (err) {
      throw err;
    }
  };
  
const getAll = async() => {
    try{

        const getAllTask = await taskModel.find();
        if(!getAllTask) throw new AppError({...NOT_FOUND,message:"No task is present"});
        return getAllTask;
    }catch(err){
        throw err;
    }
}

module.exports = {create,update,get,getAll,deleteOne,getAllTaskByUser}