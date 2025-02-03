const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongoDB = async ()=>{
    try{
        // console.log("MongoDB URI:", process.env.MONGO_DB_URI);
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("connected to mongodb");
    }catch(error){
        console.log("error connectin the mongodb", error.message);
    }
}

module.exports =  connectToMongoDB;