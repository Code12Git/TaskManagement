const { userModel } = require("../models");
const { AppError, fromEnv } = require("../utils");
const {
  CONFLICT,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const register = async (body) => {
  const { name, email, username, password } = body;
  try {
    const user = await userModel.findOne({ email });
    if (user) throw new AppError({ ...CONFLICT, message: "User Already Exists" });
    
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
    if (!user) throw new AppError({ ...UNAUTHORIZED, message: "Invalid email or password" });
    

     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) throw new AppError({ ...UNAUTHORIZED, message: "Invalid email or password" });
    

     const token = jwt.sign({ userId: user._id, email: user.email }, fromEnv('SECRET_KEY'), { expiresIn: "7d" });

    return { user , token };
  } catch (err) {
    throw err;
  }
};


const adminLogin = async() => {
  try{
    const adminCreds = {
      email: fromEnv('ADMIN_EMAIL'),
      password: fromEnv('ADMIN_PASSWORD')
    }
    const admin = await userModel.findOne({ email: adminCreds.email });
    if (!admin) throw new AppError({ ...NOT_FOUND, message: "Admin not found" });
    const isMatch = await bcrypt.compare(adminCreds.password, admin.password);
    if (!isMatch) throw new AppError({ ...UNAUTHORIZED, message: "Invalid email or password" });
    const token = jwt.sign({ userId: adminCreds._id, email: adminCreds.email }, fromEnv('SECRET_KEY'), { expiresIn: "7d" });
    return { admin , token };
  }catch(err){
    throw err;
  }
}



module.exports = { 
  register,
  login,
  adminLogin
};