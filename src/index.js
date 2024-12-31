// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
import express from "express";
// require("dotenv").config({path: "./env.sample"})

import dotenv from "dotenv"
dotenv.config({ path: '.env.sample' });


const app = express();








/*
(async () => { // initial semicoln can be ignored as isse pehle kuch nhi
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("Error: ",error);
            throw error;
        });

        app.listen(process.env.PORT);
    }
    catch(error){
        console.log(error);
    }
})();
*/