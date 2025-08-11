import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import passport from "passport";    
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
//limit is set to accet the data so check if error 
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(passport.initialize());
import "./config/passport-setup.js"; 
app.use("/api/v1/admin",adminRouter)
import venueRouter from './routes/venue.routes.js'
import userRouter from './routes/user.routes.js'
app.use("/api/v1/users", userRouter)
import adminRouter from './routes/admin.routes.js'
app.use("/api/v1/venues", venueRouter)
import authRouter from "./routes/googleAuth.routes.js";
app.use("/api/v1/auth", authRouter);
import bookingRouter from './routes/booking.routes.js'
import courtRouter from "./routes/court.routes.js"
app.use("/api/v1/courts", courtRouter)
app.use("/api/v1/booking",bookingRouter)
import { errorHandler } from "./middlewares/errorHandler.js";
app.use(errorHandler);
export { app }