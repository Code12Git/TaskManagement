const { userModel, taskModel } = require("../models");
const { AppError } = require("../utils");
const uploadImages = require("../utils/cloudinary");
const { NOT_FOUND } = require("../utils/errors");

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

const assignUser = async (body, io) => {
  const { taskId, userId } = body;
  try {
    const task = await taskModel.findById(taskId);
    if (!task) throw new AppError({ ...NOT_FOUND, message: "Task not found" });
    const user = await userModel.findById(userId);
    if (!user) throw new AppError({ ...NOT_FOUND, message: "User not found" });
    task.assignTo = userId;
    await task.save();
    return { ...task, name: user.name, email: user.email };
  } catch (err) {
    throw err;
  }
};

const countUsers = async () => {
  console.log("countUsers");
  try {
    const usersByMonth = await userModel.aggregate([
      {
        $group: {
          // Group by year and month
          _id: {
            year: { $year: "$createdAt" }, // Extract year from createdAt
            month: { $month: "$createdAt" }, // Extract month from createdAt
          },
          count: { $sum: 1 }, // Count users in each month
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
      },
      {
        $project: {
          // Project the desired fields
          _id: 0, // Exclude the default _id field
          month: {
            // Format month as MM
            $concat: [
              // Concatenate year and month
              { $toString: "$_id.year" }, // Convert year to string
              "-", // Add a hyphen
              {
                $cond: [
                  // Check if month is less than 10
                  { $lt: ["$_id.month", 10] }, // If month is less than 10
                  { $concat: ["0", { $toString: "$_id.month" }] }, // Add a leading zero
                  { $toString: "$_id.month" }, // Otherwise, convert month to string
                ],
              },
            ],
          },
          count: 1, // Include the count field
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
};
