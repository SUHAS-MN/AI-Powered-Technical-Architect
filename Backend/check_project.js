import mongoose from 'mongoose';
import { Project } from './models/project.model.js';
import { DB_NAME } from './constants.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkProject() {
    try {
        const uri = process.env.MONGODB_URI.endsWith('/') ? process.env.MONGODB_URI.slice(0, -1) : process.env.MONGODB_URI;
        await mongoose.connect(`${uri}/${DB_NAME}`);
        const project = await Project.findById('69ee558219f4a0aa41bff551');
        console.log('Project Data Found:', !!project);
        if (project) {
            console.log('Budget Estimate Type:', typeof project.budget_estimate);
            console.log('Budget Estimate Content:', JSON.stringify(project.budget_estimate, null, 2));
        }
        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
}

checkProject();
