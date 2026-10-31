import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { initializeDatabase } from './models/database.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Disable for development, configure for production
}));

// CORS configuration
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static file serving for uploads
const uploadsPath = config.upload.dir;
app.use('/uploads', express.static(uploadsPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', routes);

// 404 handler for API routes
app.use('/api/*', notFoundHandler);

// Global error handler
app.use(errorHandler);

async function startServer() {
  try {
    await initializeDatabase();
    const server = app.listen(config.port, '0.0.0.0', () => {
      console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
      console.log(`Server address: ${JSON.stringify(server.address())}`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;