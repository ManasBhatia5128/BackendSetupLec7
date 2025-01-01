// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
// import express from "express";
// require("dotenv").config({path: "./env.sample"})

import dotenv from "dotenv"
dotenv.config({ path: '.env.sample' });
import { app } from "./app.js";

app.on("error", (error)=>{
    console.log("Error occured: "+ error);
    throw error;
})

import connectDB from "./db/index.js";
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at PORT: ${process.env.PORT}`);
    });
})
.catch((error) => console.log(" MongoDB connection error occured, error message: " + error));
// const app = express();








/*
(async () => { // initial semicoln can be ignored as isse pehle kuch nhi
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("Error: ",error);
            throw error;
        });

        app.listen(process.env.PORT, () => {
            console.log(`Process is listening on port: ${process.env.PORT}`)
            }) ;
    }
    catch(error){
        console.log(error);
    }
})();
*/