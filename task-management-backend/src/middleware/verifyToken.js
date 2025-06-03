const { AppError } = require("../utils");
const { fromEnv } = require("../utils");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models");
const { NO_AUTH_HEADER, INVALID_ACCESS_TOKEN, NOT_FOUND } = require("../utils/errors");
const _ = require("lodash");

const verifyToken = async (req, res, next) => {
  try {
      const { authorization } = req.headers;
      if (_.isEmpty(authorization)) {
          const error = NO_AUTH_HEADER;
          throw new AppError(error.code, error.message, error.statusCode);
      }

      const accessToken = authorization.split(" ")[1];
      if (!accessToken) {
          const error = INVALID_ACCESS_TOKEN;
          throw new AppError(error.code, error.message, error.statusCode);
      }
      const decodedToken = jwt.verify(accessToken, fromEnv('SECRET_KEY'));
      const user = await userModel.findOne({ email: decodedToken.email });
      if (_.isEmpty(user)) {
          const error = NOT_FOUND;
          throw new AppError(error.code, error.message, error.statusCode);
      }
      req.user = user;
      next();
  } catch (err) {
      next(err);
  }
};


const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    if (req.user?.role === "admin") {
      return next();
    } else {
      return next(new AppError("You are not allowed to perform this action", 403));
    }
  });
};
module.exports =  {verifyToken,verifyTokenAndAdmin}