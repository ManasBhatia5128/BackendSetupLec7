import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// cookie parser is used to access and set cookies ie CRUD operations

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json({limit: "16kb"})); // its just saying ki hum itna limit tk json accept krenge, iss syntax se pehle body parser user hota tha
app.use(express.urlencoded({extended: true, limit: "16kb"})); // this is to encode the url like space becomes %20, @becomes %40 etc etc
app.use(express.static("public")); // to store some type of files in your local machine and not on the cloud server
app.use(cookieParser); // options ka abhi tk use nhi pada hai

export {app};