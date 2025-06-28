import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from the root directory (for the static HTML website)
app.use(express.static(path.join(__dirname, '..')));

// API routes
app.use('/api', routes);

// Health check endpoint for deployment
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the main HTML file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Serve React app for other routes (if client/dist exists)
app.get('*', (req, res) => {
  const clientDistPath = path.join(__dirname, '../client/dist/index.html');
  const staticHtmlPath = path.join(__dirname, '../index.html');
  
  // Try to serve the React app first, fallback to static HTML
  try {
    res.sendFile(clientDistPath);
  } catch (error) {
    res.sendFile(staticHtmlPath);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`RMT Solutions server running on port ${PORT}`);
  console.log(`Health check available at http://0.0.0.0:${PORT}/health`);
});