const { userModel } = require("../models");
const { AppError, fromEnv } = require("../utils");
const { CONFLICT, UNAUTHORIZED, NOT_FOUND } = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {sendResetPasswordLink} = require("./emailManager");

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

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      fromEnv("SECRET_KEY"),
      { expiresIn: "7d" }
    );

    return { user, token };
  } catch (err) {
    throw err;
  }
};

const adminLogin = async () => {
  try {
    const adminCreds = {
      email: fromEnv("ADMIN_EMAIL"),
      password: fromEnv("ADMIN_PASSWORD"),
    };
    const admin = await userModel.findOne({ email: adminCreds.email });
    if (!admin)
      throw new AppError({ ...NOT_FOUND, message: "Admin not found" });
    const isMatch = await bcrypt.compare(adminCreds.password, admin.password);
    if (!isMatch)
      throw new AppError({
        ...UNAUTHORIZED,
        message: "Invalid email or password",
      });
    const token = jwt.sign(
      { userId: adminCreds._id, email: adminCreds.email },
      fromEnv("SECRET_KEY"),
      { expiresIn: "7d" }
    );
    return { admin, token };
  } catch (err) {
    throw err;
  }
};

const forgotPassword = async (body) => {
  const { email } = body;
  try {

    const jwtToken = jwt.sign(
      { email: email },
      fromEnv("SECRET_KEY"),
      { expiresIn: "15m" }
    );
    const resetLink = `http://localhost:3000/reset-password/${jwtToken}`;

    const sendEmail = await sendResetPasswordLink(email, resetLink);
    return sendEmail;
  } catch (err) {
    throw err;
  }
};


const resetPassword = async (body) => {
  console.log(body)
  // console.log(token,newPassword)
  const {token,password} = body;
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
    if (err.name === 'TokenExpiredError') {
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
  resetPassword
};
