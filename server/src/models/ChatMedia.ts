import { Schema, model, type Document, type InferSchemaType, Types } from 'mongoose';

const ChatMediaSchema = new Schema(
  {
    uploadedBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    threadId: {
      type: Types.ObjectId,
      ref: 'ChatThread',
      required: true,
      index: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        delete ret.__v;
        delete ret.data; // Don't serialize the raw buffer by default in JSON
        return ret;
      },
    },
  }
);

export type IChatMedia = InferSchemaType<typeof ChatMediaSchema> & Document;
export const ChatMedia = model<IChatMedia>('ChatMedia', ChatMediaSchema);
