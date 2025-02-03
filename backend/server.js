require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const   connectToMongoDB  = require("./db/connectToMongoDb");

const userRoutes = require("./routes/user.routes")
const postRoutes = require("./routes/post.routes")
const containerRoutes = require("./routes/container.routes")

app.use(cors());
app.use(cookieParser());
app.use(express.json());

Port = process.env.PORT


app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/containers", containerRoutes);

app.listen(Port,()=>{
    connectToMongoDB();
	console.log(`Server Running on port ${Port}`);
    
})

