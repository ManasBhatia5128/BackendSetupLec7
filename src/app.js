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
app.use(cookieParser()); // options ka abhi tk use nhi pada hai


// routes

import userRouter from "./routes/user.routes.js";

// routes declaration
// app.get() // we were using this earlier but not thing have seperated
app.use(`/api/v1/users`, userRouter);
// http://localhost:7000/api/v1/users/{route defined in routes, eg register.login}

export {app};