import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchNewsHandler } from './api/fetchNews.js';
import { processLeadHandler } from './api/processLead.js';
import { sendAlertHandler } from './api/telegramService.js';
import { chatHandler } from './api/chatService.js';
import { testLLMHandler } from './api/testLLM.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/fetchNews', fetchNewsHandler);
app.post('/api/processLead', processLeadHandler);
app.post('/api/sendAlert', sendAlertHandler);
app.post('/api/chat', chatHandler);
app.get('/api/test-llm', testLLMHandler);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'HPCL Lead Intelligence API is running',
    llm: 'Local Ollama (qwen2.5:1.5b)'
  });
});

// Serve static frontend files from ../frontend/dist
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🔥 HPCL Lead Intelligence running on port ${PORT}`);
  console.log(`📡 Dashboard: http://localhost:${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🤖 LLM Test: http://localhost:${PORT}/api/test-llm`);
  console.log(`\n💡 Using Local LLM: Ollama with qwen2.5:1.5b`);
});
