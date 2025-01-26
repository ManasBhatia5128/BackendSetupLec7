import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { verify } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    // user.save(); // however with this syntax all fields kick in ie sabhi fields ka hona zaruri hai however token save krte time baaki fields toh hame daale nhi so we write put validateBeforeSave to false again
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new APIError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

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
  const coverImageLocalPath =
    req.files?.coverImage == null ? "" : req.files.coverImage[0]?.path; // undefined[0] will throw an error

  if (!avatarLocalPath) {
    throw new APIError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : "";

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

  await newUser.save();

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

const loginUser = asyncHandler(async (req, res) => {
  /* 
  1.) Check if user already exists (req.body.email or req.body.username) by making call to the database 
  2.) If user doesn't exists, redirect him/her to register page
  3.) If user does exist, check if it has access token (maybe it is stored in cookies), and log him after checking the password
  4.) If time has expired, check for refresh token and authenticate the user and log him
  5.) Bs bcc
   */
  /* 
  Actual steps
  1.) req.body -> data
  2.) find the person by username or email if it exists
  3.) if it exists, log him by verifiying password, if not redirect to reigster page
  4.) generate access and refresh token
  5.) send cookies and successful response message
   */

  const { username, email, password } = req.body;
  console.log(username || "does not exist");
  console.log("Hello");

  console.log(email);
  console.log(password);

  if (!(username || email)) {
    throw new APIError(400, "username or email is required");
  }

  const user = await User.findOne({
    // dono se search kro aur kisi se bhi mil jaaye toh user return kr do
    $or: [{ username }, { email }], // $ or is mongoDB operator, don't write [{username, password}], mongoDB to use array of objects
  });

  if (!user) {
    throw new APIError(400, "User does not exist");
  }

  // User: mongoose object to use methods, user: jo user hame actual mein banaya hai

  const isPasswordValid = await user.isPasswordCorrect(password); // ye vo user jiska data hum access kr rhe hain ie specific user, "User"-> ye model wala User hai
  console.log(isPasswordValid);

  if (!isPasswordValid) {
    throw new APIError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // now we have got access and refresh tokens, now we have to return the user in response and we havd to choices as of now, either update the existing "user", ie hide its password, and update access and refresh tokens as they are generated later OR we can make a new query to database which might be a time and resourse intensive operation, we will go with the second method

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true, // basically now only server can modify the cookies
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options) // It is because of using cookieParser()
    .json(
      new APIResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken, // alag se kyu bhej rhe hain if loggedIn user mein hai but we do it if user (frontend engineer wants to save it in local storage or do something with it)
        },
        "User is logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // We can now access req.user since ab apni process midlleware se pass ho gyi hai
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true, // so we get updated value of refeshToken in new response
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res // res mein mil rha hai uss specific user ka access??
    .status(300)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new APIResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken; // 2nd option for phones
    if (!incomingRefreshToken) {
      throw new APIError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = User.findById(decodedToken?._id);

    if (!user) {
      throw new APIError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new APIError(401, "Refresh token is expired or used");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", options)
      .cookie("newRefreshToken", options)
      .json(
        new APIResponse(200, { accessToken, refreshToken: newRefreshToken })
      );
  } catch (error) {
    throw new APIError(401, error.message || "Invalid refresh token!");
  }
});

export { registerUser, loginUser, logoutUser };
