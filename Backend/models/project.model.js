import mongoose, { Schema } from "mongoose";

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    prd_content: {
        type: Object, // Stores summary, target_audience, features, user_stories
        required: true
    },
    schema_json: {
        type: Array, // Stores mongodb_schema
    },
    api_json: {
        type: Array, // Stores api_endpoints
    },
    flowchart_json: {
        type: Object, // Stores logic_flow (nodes and edges)
    },
    budget_estimate: {
        type: Object, // For P2 feature
    },
    status: {
        type: String,
        enum: ["Draft", "Generating", "Completed"],
        default: "Draft"
    }
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);