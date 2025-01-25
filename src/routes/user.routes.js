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
router.route("/logout").post(verifyJWT, logoutUser); // bs aise hi krna tha middleware inject to logout
// that's why we wrote next() in verifyJWT middleware so that next method logoutUser can run, similarly we can give many middlewares in between

export default router;
