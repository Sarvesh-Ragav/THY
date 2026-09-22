import { Schema, model, type Document, type InferSchemaType, Types } from 'mongoose';

const AddressSchema = new Schema(
  {
    label: {
      type: String,
      default: 'Home',
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine2: {
      type: String,
      default: '',
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    postalCode: {
      type: String,
      default: '',
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const CustomerPreferenceSchema = new Schema(
  {
    shoppingFor: {
      type: String,
      enum: ['Myself', 'Family', 'Both'],
      default: 'Myself',
    },
    contactMethod: {
      type: String,
      enum: ['Phone', 'WhatsApp', 'Email'],
      default: 'WhatsApp',
    },
    services: {
      type: [String],
      default: [],
    },
    garmentTypes: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const CustomerProfileSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    preferences: {
      type: CustomerPreferenceSchema,
      default: () => ({}),
    },
    addresses: {
      type: [AddressSchema],
      default: [],
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

export type ICustomerProfile = InferSchemaType<typeof CustomerProfileSchema> & Document;
export const CustomerProfile = model<ICustomerProfile>('CustomerProfile', CustomerProfileSchema);
