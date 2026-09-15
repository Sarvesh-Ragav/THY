import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './db/pool.js';
import { connectMongo, disconnectMongo } from './db/mongo.js';

// Connect to MongoDB
connectMongo().catch((err) => {
  console.error('Initial MongoDB connection error:', err);
});

const server = app.listen(env.PORT, () =>
  console.info(`THY API listening on http://localhost:${env.PORT}/api/v1`)
);

async function shutdown(): Promise<void> {
  server.close(() => undefined);
  await disconnectMongo();
  if (env.DATABASE_URL) {
    await pool.end();
  }
}

process.on('SIGINT', () => {
  void shutdown();
});
process.on('SIGTERM', () => {
  void shutdown();
});

