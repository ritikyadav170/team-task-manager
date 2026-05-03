import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
