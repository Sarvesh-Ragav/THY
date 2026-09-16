import { Schema, model, type Document, type InferSchemaType, Types } from 'mongoose';

const TailorPortfolioItemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'general',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true, timestamps: true }
);

const TailorVerificationSchema = new Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    idType: {
      type: String,
      default: 'aadhaar',
    },
    idNumberHash: {
      type: String,
      default: '',
    },
    documentName: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const TailorProfileSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    publicId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
      max: 80,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    shopAddress: {
      type: String,
      required: true,
      trim: true,
    },
    directoryImageUrl: {
      type: String,
      default: '/hero/fabric-charcoal.png',
    },
    specialties: {
      type: [String],
      default: [],
      index: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    pricingStartingAt: {
      type: Number,
      default: 800,
    },
    turnaroundDays: {
      type: Number,
      default: 5,
    },
    isDirectoryActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    vacationMode: {
      type: Boolean,
      default: false,
    },
    maxActiveCapacity: {
      type: Number,
      default: 10,
    },
    schedule: {
      type: [
        {
          day: { type: String, required: true },
          isOpen: { type: Boolean, default: true },
          openTime: { type: String, default: '09:00' },
          closeTime: { type: String, default: '19:00' },
        },
      ],
      default: [],
    },
    verification: {
      type: TailorVerificationSchema,
      default: () => ({}),
    },
    portfolio: {
      type: [TailorPortfolioItemSchema],
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

TailorProfileSchema.index({ city: 1, isDirectoryActive: 1 });
TailorProfileSchema.index({ isDirectoryActive: 1, rating: -1 });

export type ITailorProfile = InferSchemaType<typeof TailorProfileSchema> & Document;
export const TailorProfile = model<ITailorProfile>('TailorProfile', TailorProfileSchema);
