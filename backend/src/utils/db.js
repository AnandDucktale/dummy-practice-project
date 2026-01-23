import mongoose from 'mongoose';

import logger from '../logger.js';
import ApiError from './ApiError.js';

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    logger.info('Connected to Database');
  } catch (error) {
    logger.error(error, 'Error while connecting to server');
    throw new ApiError(500, 'Error while connecting to server');
  }
}

export default connectDB;
