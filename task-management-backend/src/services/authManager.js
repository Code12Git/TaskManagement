const { userModel } = require("../models");
const { AppError, fromEnv } = require("../utils");
const { CONFLICT, UNAUTHORIZED, NOT_FOUND } = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResetPasswordLink } = require("./emailManager");

const register = async (body) => {
  const { name, email, username, password } = body;
  try {
    const user = await userModel.findOne({ email });
    if (user)
      throw new AppError({ ...CONFLICT, message: "User Already Exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      username,
    });
    return newUser;
  } catch (err) {
    throw err;
  }
};

const login = async (body) => {
  const { email, password } = body;

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      throw new AppError({
        ...UNAUTHORIZED,
        message: "Invalid email or password",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new AppError({
        ...UNAUTHORIZED,
        message: "Invalid email or password",
      });
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      fromEnv("SECRET_KEY"),
      { expiresIn: "7d" }
    );

    return { user, token, lastLogin: user.lastLogin };
  } catch (err) {
    throw err;
  }
};

const adminLogin = async (body) => {
  const { email, password } = body;

  try {
    const admin = await userModel.findOne({ email }).select("+password");
    if (!admin) {
      throw new AppError({
        ...UNAUTHORIZED,
        message: "Invalid email or password",
      });
    }

    if (admin.role !== "admin") {
      throw new AppError({
        ...UNAUTHORIZED,
        message: "Access denied. Not an admin user.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new AppError({
        ...UNAUTHORIZED,
        message: "Invalid email or password",
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: admin.role },
      fromEnv("SECRET_KEY"),
      { expiresIn: "7d" }
    );

    return {
      admin,
      token,
      lastLogin: admin.lastLogin,
    };
  } catch (err) {
    throw err;
  }
};

const forgotPassword = async (body) => {
  const { email } = body;
  try {
    const jwtToken = jwt.sign({ email: email }, fromEnv("SECRET_KEY"), {
      expiresIn: "15m",
    });
    const resetLink = `http://localhost:3000/reset-password/${jwtToken}`;

    const sendEmail = await sendResetPasswordLink(email, resetLink);
    return sendEmail;
  } catch (err) {
    throw err;
  }
};

const resetPassword = async (body) => {
  const { token, password } = body;
  try {
    const decoded = jwt.verify(token, fromEnv("SECRET_KEY"));
    const { email } = decoded;

    const user = await userModel.findOne({ email });
    if (!user) throw new AppError({ ...NOT_FOUND, message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    return { message: "Password reset successfully" };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError({ ...UNAUTHORIZED, message: "Reset link expired" });
    }
    throw err;
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  forgotPassword,
  resetPassword,
};
