import mongoose from 'mongoose';
import 'dotenv/config'; // Make sure this is at the top to load .env variables

const connectDB = async () => {
  try {
    // We get the connection string from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;