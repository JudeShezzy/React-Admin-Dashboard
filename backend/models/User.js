import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{ 
        type: String, 
        requied: true, 
        unique: true
    },
    email:{
        type: String,
        requied: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    confirmPassword:{
        type: String,
        requied: true
    }
})

const UserModel = mongoose.model("User", UserSchema)

export {UserModel as User}