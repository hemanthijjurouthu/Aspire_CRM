import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json()); // Must come BEFORE app.use('/api/auth', authRoutes)

// ====== CORS & Request Logging ======
const allowedOrigins = [
  'http://localhost:5173', // local frontend
  'https://<your-frontend-url>.vercel.app' // deployed frontend URL
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // Postman or curl
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`🔥 Incoming Request: ${req.method} ${req.url}`);
  next();
});

// ====== Config ======
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || '';

// ====== MongoDB Connection ======
async function connectDB() {
  if (!MONGO_URI) {
    console.warn('⚠️  MONGO_URI not set. Please add it to .env file.');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
  }
}

// ====== Routes ======

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CRM API is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Serve frontend in production safely
if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendDistPath));

  // ✅ Fix for Express 5 wildcard route
  app.get('/*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// ====== Error Handling ======
app.use(notFound);
app.use(errorHandler);

// ====== Start Server ======
async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}/api`);
    console.log(`🌐 CORS enabled for frontend origin(s): ${allowedOrigins.join(', ')}`);
  });
}

start();
