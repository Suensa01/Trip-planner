const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const documentRoutes = require('./routes/documentRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting Security Middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per 15 minutes
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Limit authentication attempts to 30 requests per 15 minutes
  message: { error: 'Too many login/register attempts, please try again later.' }
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// Register REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    server: 'Quest Decoupled Express Backend',
    database: 'Prisma ORM (PostgreSQL/SQLite)',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Internal Error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Quest Express API Server running on port ${PORT}`);
  console.log(`📊 Prisma Database Client connected`);
  console.log(`=======================================================`);
});
