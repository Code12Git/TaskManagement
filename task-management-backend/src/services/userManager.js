const { userModel } = require("../models");
const { AppError, fromEnv } = require("../utils");
const {
  CONFLICT,
  INVALID_CREDENTIALS,
  UNAUTHORIZED,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const register = async (body) => {
  const { name, email, username, password } = body;
  try {
    console.log(body)
    const user = userModel.findOne({ email });
    if (user) throw new AppError({ ...CONFLICT, message: "User Already Exists" });
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
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

const login = async (body,redisClient) => {
  const { email, password } = body;
  try {
    const user = await userModel.findOne({ email });
    console.log('Triggered')
    if (!user)
      throw new AppError({
        ...INVALID_CREDENTIALS,
        message: "Invalid Credentials",
      });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError({ ...UNAUTHORIZED, message: "Invalid credentials" });
    const sessionId = uuidv4();
    const accessToken = jwt.sign(
      { userId: user._id, sessionId },
      fromEnv("SECRET_KEY"),
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, sessionId },
      fromEnv("JWT_REFRESH_SECRET"),
      { expiresIn: "7d" }
    );
    const sessionData = {
        userId: user._id.toString(),
        email: user.email,
        ip: body.ip || '',
        userAgent: body.userAgent || '',
        createdAt: new Date().toISOString()
    };
    await redisClient.set(
        `session:${sessionId}`,
        JSON.stringify(sessionData),
        {
            EX: 60 * 60 * 24 * 7 // This is equal to 7 days
        }
    );
    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
        }
    };
  } catch (err) {
    throw err;
  }
};

module.exports = { register,login };
