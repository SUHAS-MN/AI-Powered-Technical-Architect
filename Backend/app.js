import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

const app = express()

// Security Headers
app.use(helmet())

// Global Rate Limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
    standardHeaders: true, 
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(globalLimiter);

// Dynamic CORS for deployment
const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',') 
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))
console.log(`CORS configured for: ${allowedOrigins.join(', ')}`);

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import userRouter from './routes/user.routes.js'
import aiRouter from './routes/ai.routes.js'

// routes declaration
app.use("/api/auth", userRouter)
app.use("/api/generate", aiRouter)

// Error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
    });
});

export { app }
