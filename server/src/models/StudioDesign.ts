import { Schema, model, type Document, type InferSchemaType, Types } from 'mongoose';

const StudioAttributesSchema = new Schema(
  {
    fabric: { type: String, default: '' },
    color: { type: String, default: '' },
    silhouette: { type: String, default: '' },
    neckline: { type: String, default: '' },
    sleeveStyle: { type: String, default: '' },
    lining: { type: String, default: '' },
    embroidery: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const StudioDesignSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Custom Garment Concept',
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    prompt: {
      type: String,
      default: '',
      trim: true,
    },
    attributes: {
      type: StudioAttributesSchema,
      default: () => ({}),
    },
    previewImageUrl: {
      type: String,
      required: true,
    },
    tryOnImageUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['draft', 'saved', 'ordered'],
      default: 'saved',
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

StudioDesignSchema.index({ userId: 1, createdAt: -1 });

export type IStudioDesign = InferSchemaType<typeof StudioDesignSchema> & Document;
export const StudioDesign = model<IStudioDesign>('StudioDesign', StudioDesignSchema);
