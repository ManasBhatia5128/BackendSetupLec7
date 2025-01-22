import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  /*
  1. get user data through a form from frontend
2. check validations, correct email, fields not empty etc
3. check if user already exists (using email or uniqe username)
4. check if files are provided (avatar is compulsary) // multer check
5. when checked upload avatar and image to Cloudinary, (avatar check kro) // Cloudinary check
6. create user object -> create entry in database
7. remove password and refresh token field from response (response frontend wale ko bhi bhjena hai)
8. check for user creation
9. return response
   */

  const { username, fullname, email, password } = req.body; // express method used to get user data from form
  console.log(username);
  console.log(email);
  console.log(password);

  // Validations:

  // check if email is correctly written
  if (!email.includes("@")) {
    throw new APIError(400, "Email must be valid");
  }

  if (password.length < 8) {
    throw new APIError(400, "Password must contain at least 8 characters");
  }

  // check if fields are empty
  if (
    [username, fullname, email, password].some((field) => field.trim() === "") // kind of map function hai, basically sb fields ke liye ye condition check hogi
  ) {
    throw new APIError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    // pehla user jo mila if exists
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new APIError(409, "User with same username or email already exists");
  }

  // ?. means optional chaining, that is if exist nhi krti toh error nhi ayega

  // avatarLocalPath: local path ka route hai, cloudinary pr jaane se pehle
  if (!req.files || !req.files.avatar || !req.files.avatar[0]) {
    throw new APIError(400, "Avatar file is required");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path; // req.files is option given by multer to handle files, .body is given by express
  const coverImageLocalPath = req.files?.coverImage == null ? "" : req.files.coverImage[0]?.path; // undefined[0] will throw an error

  if (!avatarLocalPath) {
    throw new APIError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    // double check
    throw new APIError(400, "Avatar file is required");
  }

  const newUser = await User.create({
    // time required in creation
    fullname,
    username,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", // since it is not a required field
  });


  // iss se ek database call extra jaa rahi hai but confirm ho jayega ki user create hua hai ki nhi
  // also iss se hum select kr paa rhe hain ki konse fields nhi chaiye (though .create wale mein bhi kr skte the like password: undefined)
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  ); // _id mongoDB bana leta hai har field ki
  // jo fields nhi chaiye vo likh do

  if (!createdUser) {
    throw new APIError(500, "Something went wrong while registering the user"); // or "Internal server error"
  }
  return res
    .status(201)
    .json(new APIResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };