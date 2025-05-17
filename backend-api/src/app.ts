import express, { Express } from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/error';
import { authenticate } from './middleware/auth';

// Load environment variables
dotenv.config();

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Parse JSON bodies
app.use(json());

// Authentication middleware
app.use(authenticate);

// Routes
app.use('/api', apiRouter);

// Error handling middleware
app.use(errorHandler);

const PORT: number = Number(process.env.PORT) || 3000;
const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/stockwise';

// Database connection
const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Start server
const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;