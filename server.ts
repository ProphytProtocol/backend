/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors';
import express from 'express';
import marketsRouter from './routes/markets';
import betsRouter from './routes/bets';
import oracleRouter from './routes/oracle';
import usersRouter from './routes/users';
import chartsRouter from './routes/charts';
import { startPriceUpdater } from './services/coingecko-oracle';

const app = express();
app.use(cors());
app.use(express.json());

startPriceUpdater();

app.get('/', async (req, res): Promise<void> => {
  res.send({
    message: '🚀 Prophyt API is functional 🚀',
    version: '1.0.0',
    endpoints: {
      markets: '/api/markets',
      bets: '/api/bets',
      protocols: '/api/protocols',
      oracle: '/api/oracle/price/latest',
      users: '/api/users/:address/bets',
      charts: '/api/charts/market/:id',
    },
  });
});

app.use('/api/markets', marketsRouter);
app.use('/api/bets', betsRouter);
app.use('/api/oracle', oracleRouter);
app.use('/api/users', usersRouter);
app.use('/api/charts', chartsRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

app.use((err: any, req: any, res: any, _next: any) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: err.message,
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Prophyt API Server ready`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`📊 Markets: http://localhost:${PORT}/api/markets`);
  console.log(`🎲 Bets: http://localhost:${PORT}/api/bets`);
  console.log(`🔗 Protocols: http://localhost:${PORT}/api/protocols`);
});
