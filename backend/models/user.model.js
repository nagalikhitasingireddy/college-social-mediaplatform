const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female"]
    },
    profilePic:{
        type:String,
        default:"",
    },
    containerId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Container', 
    },
    //createdAt , updatedAt => Member since createdAt
},{timestamps: true})

const User = mongoose.model("User",userSchema);
module.exports = User;