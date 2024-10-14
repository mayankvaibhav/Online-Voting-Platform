import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"



const app = express();   

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
})) // when data comes from url they are incoded 
app.use(express.static(
    "public"
))
app.use(cookieParser())   // use to set or read cookies from user browser


// Use election routes with the prefix '/elections'
import electionRoutes from './routes/election.route.js'; // Note the .js extension
app.use('/elections', electionRoutes);


import voteRoutes from './routes/vote.route.js'; // Import vote routes
app.use('/votes', voteRoutes); // Use vote routes with the prefix '/votes'


import userRoutes from './routes/user.route.js'; // Adjust the path as necessary
app.use('/users', userRoutes); // Use user routes with the prefix '/users'


import resultRouter from "./routes/result.route.js";
app.use("/result", resultRouter)


import candidateRoute from "./routes/candidate.route.js";
app.use("/candidate", candidateRoute)

import router from "./routes/fileUpload.route.js";
app.use("/cloudinary", router)  

import imagerouter from "./routes/cloudinaryUpload.route.js";
app.use("/uploadImage", imagerouter)

export { app }