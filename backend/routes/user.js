import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

router.post('/signup',async (req, res) => {
    const {username, email, password, confirmPassword} = req.body;
    const user = await User.findOne({email})
    if(user){
        return res.json({message: "User already exist"})
    }

    const hashpassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        username,
        email,
        password: hashpassword,
        confirmPassword
    })

    await newUser.save()
    return res.json({status: true, message: "Record registered"})
})

router.post('/login', async (req,res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.json({message: "user is not registered"})
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword){
        return res.json({message: "password is incorrect"})
    }

    const token = jwt.sign({username: user.username}, process.env.KEY, {expiresIn: "1h"})
    res.cookie('token', token, {httpOnly: true, maxAge: 360000})
    return res.json({status: true, message: "login successfully"})
})

router.post('/forgot-password', async (req,res) => {
    const {email} = req.body;
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.json({message: "user not registered"})
        }

        const token = jwt.sign({id: user._id}, process.env.KEY, {expiresIn: '5m'})

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'Judesezgy12@gmail.com',
              pass: 'Jude87889*^#'
            }
        });
          
        var mailOptions = {
            from: 'Judesezgy12@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:3000/resetPassword/${token}`
        };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return res.json({message: "error sending email"})
            } else {
              return res.json({status: true, message: "email sent"})
            }
        });

    }catch(error){
        console.log(error);
    }

})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({status: true})
})

export {router as UserRouter}