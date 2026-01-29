import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

import connectDB from './utils/db.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import logger from './logger.js';
import { setupSocket } from './handler/index.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

app.get('/hello', (req, res) => {
  return res.status(200).json({ message: 'hello' });
});

const allowedOrigins = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Static files
app.use('/uploads', express.static('uploads'));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// Socket Setup
setupSocket(io);

// Middleware to add io obj in request object to make available globally throughout the app
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/user', userRoutes);
app.use('/contact', contactRoutes);
app.use('/admin', adminRoutes);
app.use('/group', groupRoutes);

// Port
const PORT = process.env.PORT || '8888';

// Server running
server.listen(PORT, () => {
  logger.info(`Server is running on port number: ${PORT}`);
});

// Connection to database
connectDB();
