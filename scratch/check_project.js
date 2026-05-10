import mongoose from 'mongoose';
import { Project } from './Backend/models/project.model.js';
import dotenv from 'dotenv';

dotenv.config({ path: './Backend/.env' });

async function checkProject() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const project = await Project.findById('69ee558219f4a0aa41bff551');
        console.log('Project Data:', JSON.stringify(project, null, 2));
        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
}

checkProject();
