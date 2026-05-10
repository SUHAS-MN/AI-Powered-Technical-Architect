import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        // console.log(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        const uri = process.env.MONGODB_URI.endsWith('/') ? process.env.MONGODB_URI.slice(0, -1) : process.env.MONGODB_URI;
        const connectionInstance = await mongoose.connect(`${uri}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB