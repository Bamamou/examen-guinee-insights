import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { DatabaseManager } from './database/database';
import { CSVImporter } from './utils/csvImporter';
import examRoutes from './routes/examRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  'http://localhost:8080', 
  'http://localhost:8081', 
  'http://localhost:5173', 
  'http://localhost:3000', 
  'http://127.0.0.1:5173', 
  'http://127.0.0.1:8080',
  'https://bamamou.github.io',
  'https://bamamou.github.io/examen-guinee-insights'
];

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://bamamou.github.io', 'https://bamamou.github.io/examen-guinee-insights']
    : allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/exam', examRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Guinea Exam Insights API is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/exam'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Guinea Exam Insights API'
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    console.log('Initializing database...');
    const db = DatabaseManager.getInstance();
    await db.initialize();
    console.log('✅ Database initialized successfully');

    // Check if database has data, if not import it
    const database = db.getDatabase();
    const result = await database.get('SELECT COUNT(*) as count FROM exam_results');
    
    if (result.count === 0) {
      console.log('📊 Database is empty, importing data...');
      const dataDir = path.join(__dirname, '../data');
      
      if (fs.existsSync(dataDir)) {
        const importer = new CSVImporter();
        
        // Import BEPC data
        const bepcFiles = fs.readdirSync(dataDir).filter(file => 
          file.includes('BEPC') && file.endsWith('.csv')
        );
        
        if (bepcFiles.length > 0) {
          console.log('📚 Importing BEPC data...');
          for (const file of bepcFiles) {
            await importer.importFromCSV(path.join(dataDir, file), 2025, 'BEPC');
          }
        }
        
        // Import CEE data
        const ceeFiles = fs.readdirSync(dataDir).filter(file => 
          file.includes('CEE') && file.endsWith('.csv')
        );
        
        if (ceeFiles.length > 0) {
          console.log('📚 Importing CEE data...');
          for (const file of ceeFiles) {
            await importer.importFromCSV(path.join(dataDir, file), 2025, 'CEE');
          }
        }
        
        // Import Baccalauréat data
        const bacOptions = ['SE', 'SM', 'SS'];
        for (const option of bacOptions) {
          const bacFile = path.join(dataDir, `${option}.csv`);
          if (fs.existsSync(bacFile)) {
            console.log(`📚 Importing BAC-${option} data...`);
            await importer.importBaccalaureatFromCSV(bacFile, 2025, option);
          }
        }
        
        console.log('✅ Data import completed');
      } else {
        console.log('⚠️ No data directory found, starting with empty database');
      }
    } else {
      console.log(`📊 Database has ${result.count} records`);
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Guinea Exam Insights API is ready`);
      console.log(`🔍 API Documentation: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    const db = DatabaseManager.getInstance();
    await db.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer();
