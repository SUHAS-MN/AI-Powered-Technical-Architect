import { Router } from "express";
import rateLimit from "express-rate-limit";
import { prd, tech, refine, projects, getProjectById, exports as exportsZip } from "../controllers/ai.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Strict Rate Limiting for AI endpoints to prevent API quota exhaustion
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 Hour window
    max: 20, // Strict limit: 20 project generations/refinements per hour per IP
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
    message: { success: false, message: "AI Architecture Generation limit exceeded. Please wait 1 hour." }
});

router.use(aiLimiter);

router.use(verifyJWT); // Secure all AI routes

router.route("/prd").post(prd);
router.route("/tech").post(tech);
router.route("/refine").post(refine);
router.route("/projects").get(projects);
router.route("/project/:id").get(getProjectById);
router.route("/export/:id").get(exportsZip);

export default router;
