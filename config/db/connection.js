import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todo-list-db";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected successfully");
    }
    catch (error) {
        console.error("Error connecting to MongoDB: ", error.message);
        process.exit(1); // Exit the process with failure
    }
}

mongoose.connection.on("connected", () => {
    console.log("MongoDB connection established");
});

mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error: ", error);
});
mongoose.connection.on("disconnected", () => {
    console.log("MongoDB connection disconnected");
});

export { mongoose };
