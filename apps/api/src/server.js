import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());

// API Health Check Endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  
  try {
    const dbRes = await pool.query('SELECT NOW()');
    if (dbRes.rows.length > 0) {
      dbStatus = 'connected';
    }
  } catch (error) {
    dbStatus = 'error';
  }

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    service: 'SyncMavens Core API',
    uptime: process.uptime()
  });
});

// Mock routes / fallbacks for front-end integration testing
app.get('/api/releases', (req, res) => {
  res.json([
    { id: 101, title: 'Midnight Sun', artist: 'Hologram Club', genre: 'Synthwave', duration: '4:12', status: 'Approved' },
    { id: 102, title: 'Resonance', artist: 'Aether Echo', genre: 'Neo-Classical', duration: '3:28', status: 'Approved' }
  ]);
});

app.get('/api/briefs', (req, res) => {
  res.json([
    { id: 1, project_title: 'Untitled Cyberpunk Drama', client_name: 'Netflix Series', budget_fee: 15000, required_genre: 'Synthwave / Dark Techno', required_mood: 'Action / Retro', deadline_text: '3 days left', description: 'Looking for dark, driving synthwave with heavy baseline and retro cyberpunk aesthetic.' },
    { id: 2, project_title: 'Summer Adventure Campaign', client_name: 'Automotive TV Commercial', budget_fee: 45000, required_genre: 'Indie Pop / Uplifting', required_mood: 'Uplifting / Happy', deadline_text: '5 days left', description: 'Uplifting, high-energy indie pop with acoustic guitar or bright synths.' }
  ]);
});

// Start listening
app.listen(port, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 SyncMavens API Server is running on port ${port}`);
  console.log(`🩺 Health check URL: http://localhost:${port}/api/health`);
  console.log(`======================================================\n`);
});
