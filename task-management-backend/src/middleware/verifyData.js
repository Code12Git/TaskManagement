const { AppError } = require("../utils");

const verifyData = (schema) => async (req, res, next) => {
  try {
    if (!schema || typeof schema.parse !== "function") {
      throw new Error("Invalid schema: Missing parse method");
    }

    const parsedBody = schema.parse(req.body);
    req.body = parsedBody;
    next();
  } catch (err) {
    next(new AppError("INTERNAL_SERVER_ERROR", "Something went wrong", 500));
  }
};

module.exports = verifyData;
