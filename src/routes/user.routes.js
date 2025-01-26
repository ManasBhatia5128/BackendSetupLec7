import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  // .array: ek entity ki multiple files
  // .single: ek file
  // .fields: multiple files
  upload.fields([
    {
      name: "avatar", // names should be same as frontend
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);


// Secured routes
router.route("/logout").post(verifyJWT, logoutUser); // bs aise hi krna tha middleware inject to logout
// that's why we wrote next() in verifyJWT middleware so that next method logoutUser can run, similarly we can give many middlewares in between
router.route("/refresh-token").post(refreshAccessToken) // isme verifyJWT middleware ki jarurat nhi padi since hamen verification ke steps controller mein iss method mein hi likh diye hain

export default router;
