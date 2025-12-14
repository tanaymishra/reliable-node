import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Server } from 'http';
import { connect } from '../config/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Cross-Origin Resource Sharing
app.use(morgan('dev')); // Logger
app.use(express.json()); // JSON Body Parser
app.use(express.urlencoded({ extended: true })); // URL Encoded Body Parser

// Routes
import masterRoutes from './routes/master.routes';
app.use('/api/v1', masterRoutes);


//Connect to DAtabase
connect()

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is healthy and running smoothly!',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});
import { Server as SocketIOServer } from 'socket.io';

// Start Server
const server: Server = app.listen(PORT, () => {
    console.log(`\n🚀 Server is running responsibly on port ${PORT}`);
    console.log(`👉 http://localhost:${PORT}`);
});

import { socketManager } from './socket/socketManager';

const io = new SocketIOServer(server, {
    cors: {
        origin: "*", // Adjust in production
        methods: ["GET", "POST"]
    }
});

// Initialize Socket Manager
socketManager.initialize(io);

export { io };

// Graceful Shutdown
const shutdown = (signal: string) => {
    console.log(`\n${signal} signal received: closing HTTP server`);
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle unexpected errors preventing crash
process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); // Exit with failure
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});
