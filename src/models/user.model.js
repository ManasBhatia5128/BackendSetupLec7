import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // will help in database searching, better optimised option, waise false ho jaata hai
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true, // index soch smj kr, sbke saath nahi
    },
    fullname: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String, // cloudinary url, to get url of image or website
    },
    coverImage: {
      type: String,
    },
    watchHistory: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Video",
        },
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// It is a kind of middleware'
// This encryption and decryption takes time so we have to make it as async function
userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) {
    return next(); // if not modified, return
  }
  this.password = await bcrypt.hash(this.password, 10); // samay lgta hai hashing mein
  next(); // ab agla function/middleware run kr lo
}); // arrow function mein current obj ie "this" ka reference nhi milta, that's why we have to use normal function
// say bande ne apni photo hi change kri, save pr click kra, ab kyunki prehook hai toh save se pehle firse run ho jayegi
// hame sirf password change pr hi code run krna hai ye

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); // check if password (entered password) == encrypted password stored in database, gives true if matched and false if not
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
      username: this.username,
      fullName: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
      username: this.username,
      fullName: this.fullname,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);