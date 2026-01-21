import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import connectDB from './utils/db.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
const app = express();

app.get('/hello', (req, res) => {
  return res.status(200).json({ message: 'hello' });
});

const allowedOrigins = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

app.use('/user', userRoutes);
app.use('/contact', contactRoutes);
app.use('/admin', adminRoutes);
app.use('/group', groupRoutes);

const PORT = process.env.PORT || '8888';

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});

connectDB();
