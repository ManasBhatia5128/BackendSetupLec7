import { APIError } from "../utils/APIError";
import { asyncHandler } from "../utils/asyncHandler";
import { jwt } from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async (req, _, next) => { // jo cheez (res in this case) use nhi ho rhe uski jagah _ likh sakte hain 
    // req: object jisme body jaise aur objects hain, req.cookies -> cookies object
    // res.user => ye hum res object mein ek aur object set karenge
    try {
        const token = req?.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
        if(!token){
            throw new APIError(401, "Unauthorised request");
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user){
            throw new APIError(401, "Invalid access token");
        };
    
        req.user = user;
        next();
    } catch (error) {
        throw new APIError(401, error?.message || "Invalid access token");
        
    }// Select krke sidha try-catch likh kr snippet use kr lo, sidha hi wrap ho jayega try block mein apna selected code

})