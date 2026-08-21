import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ready, isReady } from './coc.js';
import clanRoutes from './routes/clan.js';
import warRoutes from './routes/war.js';
import cwlRoutes from './routes/cwl.js';
import capitalRoutes from './routes/capital.js';
import playerRoutes from './routes/player.js';
import rankingsRoutes from './routes/rankings.js';
import miscRoutes from './routes/misc.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ready: isReady() });
});

// Block API calls until the COC client is logged in.
app.use((req, res, next) => {
  if (req.path === '/api/health') return next();
  if (!isReady()) {
    return res.status(503).json({ error: 'COC client not logged in. Set EMAIL and PASSWORD in .env and restart.' });
  }
  next();
});

app.use('/api/clan', clanRoutes);
app.use('/api/war', warRoutes);
app.use('/api/cwl', cwlRoutes);
app.use('/api/capital', capitalRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/rankings', rankingsRoutes);
app.use('/api/misc', miscRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = err instanceof Error ? err.message : 'Unknown error';
  res.status(500).json({ error: message });
});

export { app };

// Do not start a long-running server when running as a Vercel serverless function.
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`[server] listening on http://localhost:${port}`);
  });
}

ready().catch((err) => {
  console.error('[server] COC login failed (server still running):', err instanceof Error ? err.message : err);
});
