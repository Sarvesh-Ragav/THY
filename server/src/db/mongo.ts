import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AuthSession } from '../models/AuthSession.js';

let isConnected = false;

export async function connectMongo(): Promise<typeof mongoose> {
  if (isConnected) {
    return mongoose;
  }

  try {
    mongoose.connection.on('connected', () => {
      console.log('📦 Connected to MongoDB:', env.MONGODB_URI);
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      isConnected = false;
    });

    const conn = await mongoose.connect(env.MONGODB_URI, {
      autoIndex: true,               // Build indexes automatically
      serverSelectionTimeoutMS: 10000, // Atlas can take a moment to select a server
      socketTimeoutMS: 45000,        // Close sockets after 45s of inactivity
      maxPoolSize: 10,               // Maintain up to 10 socket connections
    });

    // Clean up explicit null fields and rebuild indexes for User and AuthSession collections
    try {
      const db = conn.connection.db;
      if (db) {
        const usersCol = db.collection('users');
        await usersCol.updateMany({ phoneNumber: null }, { $unset: { phoneNumber: '' } });
        await usersCol.updateMany({ email: null }, { $unset: { email: '' } });
        await usersCol.updateMany({ googleId: null }, { $unset: { googleId: '' } });

        const authSessionsCol = db.collection('authsessions');
        await authSessionsCol.updateMany({ tokenHash: null }, { $unset: { tokenHash: '' } });
      }
      await User.syncIndexes();
      await AuthSession.syncIndexes();
    } catch (syncErr) {
      console.warn('MongoDB index sync notice:', syncErr);
    }

    isConnected = true;
    return conn;
  } catch (error) {
    console.error('Failed to initialize MongoDB connection:', error);
    throw error;
  }
}

export async function disconnectMongo(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log('MongoDB connection closed.');
}

export { mongoose };
