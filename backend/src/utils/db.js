import mongoose from 'mongoose';

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('Connected to mongoDB');
  } catch (error) {
    console.error(error);
  }
}

export default connectDB;
