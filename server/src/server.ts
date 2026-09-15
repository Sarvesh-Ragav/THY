import http from 'node:http';
import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './db/pool.js';
import { connectMongo, disconnectMongo } from './db/mongo.js';
<<<<<<< Updated upstream
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
=======
import { initSocket } from './socket/index.js';
>>>>>>> Stashed changes

// Connect to MongoDB
connectMongo().catch((err) => {
  console.error('Initial MongoDB connection error:', err);
});

const httpServer = http.createServer(app);
initSocket(httpServer);

const server = httpServer.listen(env.PORT, () =>
  console.info(`THY API and Socket.IO listening on http://localhost:${env.PORT}`)
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

