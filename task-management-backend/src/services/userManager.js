const { userModel, taskModel } = require("../models");
const { AppError } = require("../utils");
const uploadImages = require("../utils/cloudinary");
const { NOT_FOUND } = require("../utils/errors");
const {  sendTaskDetailsToAssignees } = require("./emailManager");

const getUser = async () => {
  try {
    const user = await userModel.find();
    if (!user)
      throw new AppError({
        ...NOT_FOUND,
        message: "No user exist in database",
      });
    return user;
  } catch (err) {
    throw err;
  }
};

const deleteUser = async (params) => {
  const { userId } = params;
  console.log(userId);
  try {
    const user = await userModel.findByIdAndDelete(userId);
    console.log(user);
    if (!user) throw new AppError({ ...NOT_FOUND, message: "User not found" });
    console.log(user);
    const task = await taskModel.findById({ assignTo: userId });
    if (!task) throw new AppError({ ...NOT_FOUND, message: "Task not found" });
    task.assignTo = null;
    return user;
  } catch (err) {
    throw err;
  }
};

const assignUser = async (body, user) => {
  const { taskId, userId } = body;
  const { email } = user;
  if (!taskId || !userId) {
    throw new AppError({ 
      ...BAD_REQUEST, 
      message: "Both taskId and userId are required" 
    });
  }

  try {
    const [task, userAssign] = await Promise.all([
      taskModel.findById(taskId),
      userModel.findById(userId)
    ]);



    if (!task) {
      throw new AppError({ ...NOT_FOUND, message: "Task not found" });
    }
    
    if (!userAssign) {
      throw new AppError({ ...NOT_FOUND, message: "User not found" });
    }

    if (task.assignTo && task.assignTo.toString() === userId) {
      return task;
    }
    task.assignTo = userId;
    await task.save();
    sendTaskDetailsToAssignees(task, userAssign.email, email)
    .catch(error => console.error("Failed to send task details:", error));
    
    return task;
  } catch (err) {
    console.error("Error in assignUser:", err);
    throw err instanceof AppError ? err : new AppError({
      ...INTERNAL_SERVER_ERROR,
      message: "Failed to assign user to task"
    });
  }
};

const countUsers = async () => {
  console.log("countUsers");
  try {
    const usersByMonth = await userModel.aggregate([
      {
        $group: {
           _id: {
            year: { $year: "$createdAt" },  
            month: { $month: "$createdAt" },  
          },
          count: { $sum: 1 },  
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },  
      },
      {
        $project: {
           _id: 0,  
          month: {
             $concat: [
               { $toString: "$_id.year" },  
              "-",  
              {
                $cond: [
                   { $lt: ["$_id.month", 10] }, 
                  { $concat: ["0", { $toString: "$_id.month" }] }, 
                  { $toString: "$_id.month" },  
                ],
              },
            ],
          },
          count: 1, 
        },
      },
    ]);
    console.log(usersByMonth);

    if (!usersByMonth)
      throw new AppError({
        ...NOT_FOUND,
        message: "No user exist in database",
      });
    return usersByMonth;
  } catch (err) {
    throw err;
  }
};


const userInfo = async () => {
  try {
    const users = await userModel.find();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Total Users
    const totalUsers = users.length;

    // New Users This Month
    const newUser = users.filter(user => {
      const createdAt = new Date(user.createdAt);
      return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
    }).length;

    // New Users Last Month
    const newUserLastMonth = users.filter(user => {
      const createdAt = new Date(user.createdAt);
      return createdAt.getMonth() === currentMonth - 1 && createdAt.getFullYear() === currentYear;
    }).length;

    // Active Users (last 30 days)
    const activeUsers = users.filter(user => {
      const lastLogin = new Date(user.lastLogin);
      const diffInDays = (currentDate - lastLogin) / (1000 * 60 * 60 * 24);
      return diffInDays <= 30;
    }).length;

     const activeUsersLastMonth = users.filter(user => {
      const lastLogin = new Date(user.lastLogin);
      const diffInDays = (currentDate - lastLogin) / (1000 * 60 * 60 * 24);
      return diffInDays > 30 && diffInDays <= 60;
    }).length;

     const churnRate = totalUsers > 0
      ? (((totalUsers - activeUsers) / totalUsers) * 100).toFixed(2)
      : '0.00';

    const churnRatePrev = totalUsers > 0
      ? (((totalUsers - activeUsersLastMonth) / totalUsers) * 100).toFixed(2)
      : '0.00';

     const getChange = (current, previous) => {
      const c = Number(current);
      const p = Number(previous);
      if (p === 0) return { change: "0%", trend: "up" };
      const diff = (((c - p) / p) * 100).toFixed(2);
      return {
        change: `${diff}%`,
        trend: parseFloat(diff) >= 0 ? "up" : "down"
      };
    };

    return {
      totalUsers: totalUsers.toString(),
      newUser: newUser.toString(),
      activeUsers: activeUsers.toString(),
      churnRate: `${churnRate}%`,
      change: {
        totalUsers: { change: "0%", trend: "up" },  
        newUser: getChange(newUser, newUserLastMonth),
        activeUsers: getChange(activeUsers, activeUsersLastMonth),
        churnRate: getChange(churnRate, churnRatePrev),
      },
    };
  } catch (err) {
    throw err;
  }
};



const changeRole = async (body, params) => {
  const { userId } = params;
  console.log("Body:", body);
  const { role } = body;
  try {
    const userRole = await userModel.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true }
    );
    if (!userRole)
      throw new AppError({ ...NOT_FOUND, message: "User not found" });
    return userRole;
  } catch (err) {
    throw err;
  }
};

const updateUser = async (body, params) => {
  const { name, email, username } = body;
  const { userId } = params;
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, email, username },
      { new: true }
    );
    if (!updatedUser)
      throw new AppError({ ...NOT_FOUND, message: "User Not found" });
    return updatedUser;
  } catch (err) {
    throw err;
  }
};

const uploadAvatar = async (files, userId) => {
  console.log('Entered uploadAvatar');
  console.log("files", files);

  try {
    if (!files || !files.avatarUrl || files.avatarUrl.length === 0) {
      throw new AppError({ ...NOT_FOUND, message: "Avatar file not provided" });
    }

    if (!userId) {
      throw new AppError({ ...BAD_REQUEST, message: "User ID is required" });
    }

    const avatarLocalPath = files.avatarUrl[0].path;

    const uploadedAvatar = await uploadImages(avatarLocalPath);

    if (!uploadedAvatar || !uploadedAvatar.url) {
      throw new AppError({
        ...BAD_REQUEST,
        message: "Failed to upload avatar to Cloudinary",
      });
    }

    // Update existing user with new avatarUrl
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { avatarUrl: uploadedAvatar.url },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new AppError({
        ...NOT_FOUND,
        message: "User not found or failed to update avatar",
      });
    }

    return updatedUser;

  } catch (err) {
    throw err;
  }
};




module.exports = {
  getUser,
  assignUser,
  countUsers,
  deleteUser,
  changeRole,
  updateUser,
  uploadAvatar,
  userInfo
};
