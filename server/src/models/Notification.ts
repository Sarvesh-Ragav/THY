import { Schema, model, type Document, type InferSchemaType, Types } from 'mongoose';

const UserNotificationSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    audience: {
      type: String,
      enum: ['customer', 'tailor'],
      required: true,
      index: true,
    },
    eventKey: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['order', 'quotation', 'chat', 'pickup', 'delivery', 'request', 'message', 'payout', 'system'],
      default: 'chat',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    linkUrl: {
      type: String,
      default: '',
    },
    threadId: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
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

UserNotificationSchema.index({ userId: 1, eventKey: 1 }, { unique: true });
UserNotificationSchema.index({ userId: 1, createdAt: -1 });

export type IUserNotification = InferSchemaType<typeof UserNotificationSchema> & Document;
export const UserNotification = model<IUserNotification>('UserNotification', UserNotificationSchema);
