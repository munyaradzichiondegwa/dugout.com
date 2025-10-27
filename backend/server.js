// --------------------------
// 🌍 DugOut Backend Server
// --------------------------

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// --------------------------
// 📦 Import Routes
// --------------------------
import authRoutes from './routes/auth.js';
import vendorRoutes from './routes/vendors.js';
import menuItemRoutes from './routes/menuItems.js';
import cartRoutes from './routes/cart.js';
import walletRoutes from './routes/wallets.js';
import orderRoutes from './routes/orders.js';
import productRoutes from './routes/products.js';
import paymentRoutes from './routes/payments.js';
import reviewRoutes from './routes/reviews.js';
import analyticsRoutes from './routes/analytics.js';

// 🧩 Import Middleware
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------
// 🔒 Security Middleware
// --------------------------
app.use(helmet());

// Dynamically allow multiple origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`⚠️ Blocked CORS request from: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Handle preflight requests globally
app.options('*', cors());

// --------------------------
// 🧠 Request Parsing
// --------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --------------------------
// 🚦 Rate Limiting
// --------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // slightly higher for smoother dev experience
  message: { message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// --------------------------
// 🧩 Database Connection
// --------------------------
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dugout', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --------------------------
// 🌐 API Routes
// --------------------------
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);

// --------------------------
// 💓 Health Check
// --------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// --------------------------
// 🖼️ Serve Frontend (Vite or CRA Build)
// --------------------------

// Detect build folder automatically (Vite = dist, CRA = build)
const vitePath = path.join(__dirname, '../frontend/dist');
const craPath = path.join(__dirname, '../frontend/build');
const frontendPath = process.env.USE_CRA === 'true' ? craPath : vitePath;

app.use(express.static(frontendPath));

// Catch-all for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// --------------------------
// 🚨 Central Error Handler
// --------------------------
app.use(errorHandler);

// --------------------------
// 🚀 Server Launch
// --------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Allowed Origins: ${allowedOrigins.join(', ')}`);
  console.log(
    `🧭 Serving frontend from: ${frontendPath.includes('dist') ? 'Vite (dist)' : 'CRA (build)'}`
  );
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Loaded successfully' : 'Missing!'}`);
});
