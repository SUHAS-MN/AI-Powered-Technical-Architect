import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

const app = express()
app.set("trust proxy", 1);

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
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim().replace(/\/$/, ''))
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];

app.use(cors({
    origin: function (origin, callback) {
        const cleanOrigin = origin ? origin.replace(/\/$/, '') : origin;
        if (!cleanOrigin || allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            console.error(`CORS BLOCKED: Origin ${origin} not in allowed list: ${allowedOrigins}`);
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

// Root Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "TechArch API is live and running perfectly!",
        environment: process.env.NODE_ENV || "development"
    });
});

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
