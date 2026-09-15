import { Schema, model, type Document, type InferSchemaType, Types } from 'mongoose';

// 1. Chat Message Sub-schemas
const ChatProductSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, default: '' },
    fabricRef: { type: String, default: '' },
  },
  { _id: false }
);

const ChatQuotationSchema = new Schema(
  {
    id: { type: String, required: true },
    price: { type: String, required: true },
    notes: { type: String, default: '' },
    sentAt: { type: Date, default: Date.now },
    updated: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending',
    },
  },
  { _id: false }
);

const ChatAttachmentSchema = new Schema(
  {
    kind: {
      type: String,
      enum: ['measurements', 'fabric', 'design'],
      required: true,
    },
    title: { type: String, required: true },
    preview: { type: String, default: null },
    href: { type: String, default: null },
    details: { type: String, default: null },
  },
  { _id: false }
);

// 2. Chat Message Schema (Polymorphic document)
const ChatMessageSchema = new Schema(
  {
    threadId: {
      type: Types.ObjectId,
      ref: 'ChatThread',
      required: true,
      index: true,
    },
    sender: {
      type: String,
      enum: ['customer', 'tailor', 'system'],
      required: true,
      index: true,
    },
    kind: {
      type: String,
      enum: ['text', 'voice', 'product_share', 'measurements', 'quotation', 'attachment', 'system'],
      required: true,
      default: 'text',
      index: true,
    },
    text: {
      type: String,
      default: null,
    },
    product: {
      type: ChatProductSchema,
      default: null,
    },
    // Key-value pairs for measurement cards (e.g. { bust: 36, waist: 30 })
    measurements: {
      type: Map,
      of: Schema.Types.Mixed,
      default: null,
    },
    quotation: {
      type: ChatQuotationSchema,
      default: null,
    },
    attachment: {
      type: ChatAttachmentSchema,
      default: null,
    },
    voiceUrl: {
      type: String,
      default: null,
    },
    voiceDuration: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['sending', 'sent', 'delivered', 'read', 'failed'],
      default: 'sent',
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

ChatMessageSchema.index({ threadId: 1, createdAt: 1 });

export type IChatMessage = InferSchemaType<typeof ChatMessageSchema> & Document;
export const ChatMessage = model<IChatMessage>('ChatMessage', ChatMessageSchema);

// 3. Chat Thread Schema
const OrderRequestSchema = new Schema(
  {
    garment: { type: String, default: '' },
    fabric: { type: String, default: '' },
    measurements: { type: String, default: '' },
    customization: { type: String, default: '' },
    stitching: { type: String, default: '' },
    status: {
      type: String,
      enum: ['sent', 'needs_clarification', 'priced'],
      default: 'sent',
    },
  },
  { _id: false }
);

const ChatThreadSchema = new Schema(
  {
    threadKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    customerId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tailorId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      default: 'Customer',
    },
    tailorName: {
      type: String,
      required: true,
    },
    tailorStudio: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'new',
        'active',
        'request_sent',
        'needs_clarification',
        'price_fixed',
        'quotation_updated',
      ],
      default: 'new',
      index: true,
    },
    lastMessage: {
      text: { type: String, default: '' },
      sender: { type: String, enum: ['customer', 'tailor', 'system'], default: 'customer' },
      kind: { type: String, default: 'text' },
      sentAt: { type: Date, default: Date.now },
    },
    orderRequest: {
      type: OrderRequestSchema,
      default: null,
    },
    activeQuotation: {
      type: ChatQuotationSchema,
      default: null,
    },
    unreadCountCustomer: {
      type: Number,
      default: 0,
      min: 0,
    },
    unreadCountTailor: {
      type: Number,
      default: 0,
      min: 0,
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

ChatThreadSchema.index({ customerId: 1, updatedAt: -1 });
ChatThreadSchema.index({ tailorId: 1, updatedAt: -1 });

export type IChatThread = InferSchemaType<typeof ChatThreadSchema> & Document;
export const ChatThread = model<IChatThread>('ChatThread', ChatThreadSchema);
