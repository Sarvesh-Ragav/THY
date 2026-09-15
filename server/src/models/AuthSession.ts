import { Schema, model, type Document, type InferSchemaType, Types } from 'mongoose';

const AuthSessionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['otp_challenge', 'refresh_token'],
      required: true,
      index: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    phoneNumber: {
      type: String,
      default: null,
      index: true,
    },
    // OTP challenge specific fields
    otpHash: {
      type: String,
      default: null,
    },
    attemptCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
    consumedAt: {
      type: Date,
      default: null,
    },
    // Refresh token specific fields
    tokenHash: {
      type: String,
      index: {
        unique: true,
        partialFilterExpression: { tokenHash: { $type: 'string' } },
      },
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    replacedByTokenId: {
      type: Types.ObjectId,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    requestIp: {
      type: String,
      default: null,
    },
    // TTL expiry timestamp
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatic TTL cleanup index
AuthSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
AuthSessionSchema.index({ phoneNumber: 1, type: 1, createdAt: -1 });

export type IAuthSession = InferSchemaType<typeof AuthSessionSchema> & Document;
export const AuthSession = model<IAuthSession>('AuthSession', AuthSessionSchema);
