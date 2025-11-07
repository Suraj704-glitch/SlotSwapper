import express from 'express';
import 'dotenv/config'; // Loads .env variables
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import swapRoutes from './routes/swapRoutes.js';

// --- Initialize Server ---
const app = express();
const PORT = process.env.PORT ||5000;

// --- Connect to Database ---
connectDB();

// --- Middleware ---
app.use(cors()); // Allows your React frontend to make requests
app.use(express.json()); // Parses incoming JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded bodies

// --- API Routes ---
// We will create these files in the next step
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/swap', swapRoutes);

// Basic route to check if server is running
app.get('/', (req, res) => {
  res.send('SlotSwapper API is running...');
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});