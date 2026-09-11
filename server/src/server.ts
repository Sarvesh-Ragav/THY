import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './db/pool.js';

const server = app.listen(env.PORT, () => console.info(`THY auth API listening on http://localhost:${env.PORT}/api/v1`));
async function shutdown(): Promise<void> { server.close(() => undefined); await pool.end(); }
process.on('SIGINT', () => { void shutdown(); });
process.on('SIGTERM', () => { void shutdown(); });
