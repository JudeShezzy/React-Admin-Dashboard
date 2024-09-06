import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
import { UserRouter } from "./routes/user.js";

const app = express()
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}))
app.use(cookieParser())
app.use('/auth', UserRouter)

mongoose.connect("mongodb://127.0.0.1:27017/authentication")
.then(() => {
    console.log("Connected to MongoDB");
})
.catch(err => {
    console.error("Connection error", err);
});

app.post("/login", async (req, res) => {
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
})

app.listen(process.env.PORT, () => {
    console.log("Server is Running")
})