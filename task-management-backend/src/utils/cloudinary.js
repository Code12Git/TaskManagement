const { v2: cloudinary } = require("cloudinary");
const fromEnv = require("./fromEnv");
const fs = require("fs");

const uploadImages = async (localFilePath) => {
  cloudinary.config({
    cloud_name: fromEnv("CLOUD_NAME"),
    api_key: fromEnv("API_KEY"),
    api_secret: fromEnv("API_SECRET"),
  });
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
 
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);  
    return null;
  }
};

module.exports = uploadImages;
