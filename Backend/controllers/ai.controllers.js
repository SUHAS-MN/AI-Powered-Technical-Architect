import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import JSZip from "jszip";



const prd = asyncHandler(async (req, res) => {
    const { projectName, prompt: goal } = req.body; // Support 'prompt' from frontend

    if (!projectName || !goal) {
        throw new ApiError(400, "Project name and goal/prompt are required");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    Act as a Senior Product Manager. Your goal is to convert a vague project idea into a professional PRD. You must return ONLY a JSON object.
    
    Generate a PRD for a project named "${projectName}" with the goal: "${goal}".
    Return a JSON object with these keys:
    - summary: A 3-sentence high-level overview.
    - target_audience: A string describing the primary users.
    - features: An array of objects, each with title, description, and priority (P0, P1, or P2).
    - user_stories: An array of 3-5 standard user stories.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    let prdData;
    try {
        prdData = JSON.parse(text);
    } catch (err) {
        throw new ApiError(500, "The Neural Architect returned an invalid data structure. Please try generating again.");
    }

    // Create a new project in DB
    const project = await Project.create({
        userId: req.user._id,
        projectName,
        prd_content: prdData,
        status: "Draft"
    });

    return res.status(201).json(new ApiResponse(201, project, "PRD generated successfully"));
});

const tech = asyncHandler(async (req, res) => {
    const { id: projectId } = req.body; // Support 'id' from frontend

    if (!projectId) {
        throw new ApiError(403, "Project ID is required");
    }

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    Act as a Lead Software Architect. Based on the provided PRD, design the technical backend. You must return ONLY a JSON object.
    
    Using this PRD: ${JSON.stringify(project.prd_content)}, generate the technical architecture.
    Return a JSON object matching this exact structure:
    {
      "mongodb_schema": [ /* array of collections. Each with collection_name and fields (array of objects with name, type, and is_required) */ ],
      "api_endpoints": [ /* array of objects with method, path, purpose, and required_body_fields */ ],
      "logic_flow": { /* React Flow nodes and edges */ },
      "budget_estimate": {
        "hosting": { "cost": 0, "provider": "string" },
        "database": { "cost": 0, "provider": "string" },
        "api_services": { "cost": 0, "provider": "string" },
        "total_monthly_usd": 0
      }
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    // Clean up markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    let techData;
    try {
        techData = JSON.parse(text);
    } catch (err) {
        throw new ApiError(500, "The Neural Architect failed to construct a valid spatial schema. Please try generating again.");
    }

    // Update project with tech data
    project.schema_json = techData.mongodb_schema;
    project.api_json = techData.api_endpoints;
    project.flowchart_json = techData.logic_flow;
    project.budget_estimate = techData.budget_estimate;
    project.status = "Completed";
    await project.save();

    return res.status(200).json(new ApiResponse(200, project, "Technical architecture generated successfully"));
});

const refine = asyncHandler(async (req, res) => {
    const { id, message } = req.body;
    const project = await Project.findOne({ _id: id, userId: req.user._id });
    if (!project) throw new ApiError(404, "Project not found");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    You are a Lead Architect. A user wants to refine their existing technical architecture.
    Existing PRD: ${JSON.stringify(project.prd_content)}
    User Feedback: "${message}"

    Update the technical architecture based on this feedback. You MUST return ONLY a JSON object matching this exact structure:
    {
      "updated_prd": { /* full updated PRD object here */ },
      "mongodb_schema": [ /* updated collections array */ ],
      "api_endpoints": [ /* updated endpoints array */ ],
      "logic_flow": { /* updated React Flow nodes and edges */ },
      "budget_estimate": {
        "hosting": { "cost": 0, "provider": "string" },
        "database": { "cost": 0, "provider": "string" },
        "api_services": { "cost": 0, "provider": "string" },
        "total_monthly_usd": 0
      }
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let updateData;
    try {
        updateData = JSON.parse(text);
    } catch (err) {
        throw new ApiError(500, "The Neural Architect failed to process the override override sequence. Please try again.");
    }

    project.prd_content = updateData.updated_prd;
    project.schema_json = updateData.mongodb_schema;
    project.api_json = updateData.api_endpoints;
    project.flowchart_json = updateData.logic_flow;
    project.budget_estimate = updateData.budget_estimate;
    await project.save();

    return res.status(200).json(new ApiResponse(200, project, "Architecture refined successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findOne({ _id: id, userId: req.user._id });
    if (!project) {
        throw new ApiError(404, "Project not found");
    }
    return res.status(200).json(new ApiResponse(200, project, "Project fetched successfully"));
});

const projects = asyncHandler(async (req, res) => {
    const userProjects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, userProjects, "Projects fetched successfully"));
});

const exportsZip = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const zip = new JSZip();

    // Create a basic Express boilerplate structure
    zip.file("package.json", JSON.stringify({
        name: project.projectName.toLowerCase().replace(/\s+/g, '-'),
        version: "1.0.0",
        main: "index.js",
        type: "module",
        dependencies: {
            express: "^4.18.2",
            mongoose: "^7.0.0",
            dotenv: "^16.0.0",
            cors: "^2.8.5"
        }
    }, null, 2));

    zip.file(".env", "PORT=8000\nMONGODB_URI=mongodb://localhost:27017/mydatabase");
    
    zip.file("index.js", `
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

app.get('/', (req, res) => res.send('${project.projectName} API Running'));

app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
    `.trim());

    // Add Models
    const modelsFolder = zip.folder("models");
    project.schema_json.forEach(coll => {
        const fields = coll.fields.map(f => `    ${f.name}: { type: ${f.type === 'String' ? 'String' : 'Object'}, required: ${f.is_required} }`).join(',\n');
        modelsFolder.file(`${coll.collection_name.toLowerCase()}.model.js`, `
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
${fields}
}, { timestamps: true });

export const ${coll.collection_name} = mongoose.model('${coll.collection_name}', schema);
        `.trim());
    });

    // Add Routes
    const routesFolder = zip.folder("routes");
    let routesCode = `import express from 'express';\nconst router = express.Router();\n\n`;
    project.api_json.forEach(api => {
        routesCode += `// ${api.purpose}\nrouter.${api.method.toLowerCase()}('${api.path}', (req, res) => {\n    res.json({ message: '${api.purpose} endpoint' });\n});\n\n`;
    });
    routesCode += `export default router;`;
    routesFolder.file("api.routes.js", routesCode);

    const content = await zip.generateAsync({ type: "nodebuffer" });

    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', `attachment; filename=${project.projectName.replace(/\s+/g, '_')}_boilerplate.zip`);
    return res.send(content);
});

export {
    prd,
    tech,
    refine,
    getProjectById,
    projects,
    exportsZip as exports
}