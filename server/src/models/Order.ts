import { Schema, model, type Document, type InferSchemaType, Types } from 'mongoose';

// 1. Order Delivery Address Schema
const OrderDeliveryAddressSchema = new Schema(
  {
    fullName: { type: String, default: '' },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
  },
  { _id: false }
);

// 2. Order Schema
const OrderSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tailorId: {
      type: Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    checkoutKey: {
      type: String,
      required: true,
      index: true,
    },
    sourceThreadId: {
      type: Types.ObjectId,
      ref: 'ChatThread',
      default: null,
    },
    tailorName: {
      type: String,
      required: true,
      trim: true,
    },
    garmentName: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryAddress: {
      type: OrderDeliveryAddressSchema,
      required: true,
    },
    amountPaise: {
      type: Number,
      required: true,
      min: 100, // at least ₹1.00
    },
    currency: {
      type: String,
      enum: ['INR'],
      default: 'INR',
    },
    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    fulfillmentStatus: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
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

OrderSchema.index({ userId: 1, checkoutKey: 1 }, { unique: true });
OrderSchema.index({ userId: 1, createdAt: -1 });

export type IOrder = InferSchemaType<typeof OrderSchema> & Document;
export const Order = model<IOrder>('Order', OrderSchema);

// 3. Payment Schema
const PaymentSchema = new Schema(
  {
    orderId: {
      type: Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    amountPaise: {
      type: Number,
      required: true,
      min: 100,
    },
    currency: {
      type: String,
      enum: ['INR'],
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    failureReason: {
      type: String,
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    webhookPayload: {
      type: Schema.Types.Mixed,
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

export type IPayment = InferSchemaType<typeof PaymentSchema> & Document;
export const Payment = model<IPayment>('Payment', PaymentSchema);
