const { userModel, taskModel } = require("../models");
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


const deleteUser = async(params) => {
  const {userId} = params;
  console.log(userId)
  try{
    const user = await userModel.findByIdAndDelete(userId)
    console.log(user)
    if(!user) throw new AppError({...NOT_FOUND,message:'User not found'})
      console.log(user)
    const task = await taskModel.findById({assignTo:userId})
    if(!task) throw new AppError({...NOT_FOUND,message:'Task not found'})
    task.assignTo = null
    return user;
  }catch(err){
    throw err;
  }
}

const assignUser = async(body,io) => {
    const {taskId,userId} = body;
    try{
        const task = await taskModel.findById(taskId)
        if(!task) throw new AppError({...NOT_FOUND,message:'Task not found'})
        const user = await userModel.findById(userId);
        if(!user) throw new AppError({...NOT_FOUND,message:'User not found'})
        task.assignTo = userId    
        await task.save()
        return {...task,name:user.name,email:user.email};
    }catch(err){
        throw err;
    }
}



const countUsers = async() => {
  console.log("countUsers");
    try{
      const usersByMonth = await userModel.aggregate([
        {
          $group: { // Group by year and month
            _id: {
              year: { $year: "$createdAt" }, // Extract year from createdAt
              month: { $month: "$createdAt" } // Extract month from createdAt
            },
            count: { $sum: 1 } // Count users in each month
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
        },
        {
          $project: { // Project the desired fields
            _id: 0, // Exclude the default _id field
            month: { // Format month as MM
              $concat: [ // Concatenate year and month
                { $toString: "$_id.year" }, // Convert year to string
                "-", // Add a hyphen
                {
                  $cond: [ // Check if month is less than 10
                    { $lt: ["$_id.month", 10] }, // If month is less than 10
                    { $concat: ["0", { $toString: "$_id.month" }] }, // Add a leading zero
                    { $toString: "$_id.month" } // Otherwise, convert month to string
                  ]
                }
              ]
            },
            count: 1 // Include the count field
          }
        }
      ]);
      console.log(usersByMonth)
      
        if(!usersByMonth) throw new AppError({...NOT_FOUND,message:"No user exist in database"})
        return usersByMonth;
    }catch(err){
      throw err;
    }
}


module.exports = {getUser,assignUser,countUsers,deleteUser}