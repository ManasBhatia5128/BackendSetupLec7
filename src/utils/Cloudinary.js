import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // fs is file system used to perform file read write etc information
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
}); // ye delete krna hai ki nhi?

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw Error("File path is not provided");
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // check type of file
    }); // public id, name etc upload options can be further given
    console.log("file has been uploaded successfully");
    console.log(response); // response.URL will store the image / video URL
    // fs.unlinkSync(localFilePath);
    return response;
    // file has been uploaded successfully
  } catch (error) {
    fs.unlinkSync(localFilePath); // removes locally saved temporary files synchronously as upload operation got failed
    console.log(error);
    return null;
  }
};

export { uploadOnCloudinary };
