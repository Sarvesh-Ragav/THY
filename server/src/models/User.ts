import { Schema, model, type Document, type InferSchemaType } from 'mongoose';

export type UserRole = 'customer' | 'tailor' | 'admin';
export type AuthProvider = 'phone' | 'google' | 'both';

const UserSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\+[1-9]\d{7,14}$/, 'Phone number must follow international E.164 format (e.g. +919876543210)'],
      index: {
        unique: true,
        partialFilterExpression: { phoneNumber: { $type: 'string' } },
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: {
        unique: true,
        partialFilterExpression: { email: { $type: 'string' } },
      },
    },
    googleId: {
      type: String,
      index: {
        unique: true,
        partialFilterExpression: { googleId: { $type: 'string' } },
      },
    },
    name: {
      type: String,
      trim: true,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ['phone', 'google', 'both'],
      default: 'phone',
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'tailor', 'admin'],
      default: null,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export type IUser = InferSchemaType<typeof UserSchema> & Document;
export const User = model<IUser>('User', UserSchema);
