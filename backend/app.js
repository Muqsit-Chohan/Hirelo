import dotenv from "dotenv";
dotenv.config({ path: new URL("./.env", import.meta.url), quiet: true });
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import jobRoutes from './routes/job.routes.js'
// import { Cross } from "lucide-react";
import cors from 'cors'
export const app = express();

app.get('/home',(req,res) => {
    return res.status(200).json({
        message: "i am coming from backend",
        sucess:true,
    })
})
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://career-spring.netlify.app",
        "https://career-spring-frontend.netlify.app"  // naya URL
    ],
    credentials: true
}));
app.use(cookieParser());
// app.use(cors(corsOprion));
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/v1/jobs',jobRoutes)
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.code === "LIMIT_FILE_SIZE" ? 413 : error.status || (error.name === "MulterError" ? 400 : 500);
  res.status(status).json({ success: false, message: status === 500 ? "Server error" : error.message });
});
