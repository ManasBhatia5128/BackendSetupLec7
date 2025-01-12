import { asyncHandler } from "../utils/asyncHandler.js";
import {APIError} from "../utils/APIError.js"

const registerUser = asyncHandler(async (req, res) => {
  /*
  1. get user data through a form from frontend
2. check validations, correct email, fields not empty etc
3. check if user already exists (using email or uniqe username)
4. check if files are provided (avatar is compulsary) // multer check
5. when checked upload avatar and image to Cloudinary, (avatar check kro) // Cloudinary check
6. create user object -> create entry in database
7. remove password and refresh token field from response
8. check for user creation
9. return response
   */

  const { username, fullname, email, password } = req.body;
  console.log(email);
  res.sendStatus(200);
});

export { registerUser };
