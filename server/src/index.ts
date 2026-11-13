import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from './config/index.js';
import { initializeDatabase, get } from './models/database.js';
import { seed } from './scripts/seed.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Serve static files from client/dist
const clientDistPath = join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', routes);

// 404 handler for API routes
app.use('/api/*', notFoundHandler);

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(join(clientDistPath, 'index.html'));
});

// Global error handler
app.use(errorHandler);

async function startServer() {
  try {
    await initializeDatabase();
    const productCount = get<{ c: number }>('SELECT COUNT(*) AS c FROM products');
    if (!productCount || Number(productCount.c) === 0) {
      console.log('Products table is empty, seeding database...');
      await seed();
      console.log('Database seeded successfully.');
    }
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