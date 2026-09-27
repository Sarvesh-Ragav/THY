import { Schema, model, type Document, type InferSchemaType } from 'mongoose';

const KurtiAttributesSchema = new Schema(
  {
    neckline: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    sleeves: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    silhouette: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    length: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  { _id: false }
);

const KurtiDesignSchema = new Schema(
  {
    designCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    garmentType: {
      type: String,
      required: true,
      default: 'kurti',
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    attributes: {
      type: KurtiAttributesSchema,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Compound indexes for exact studio lookup and filtering
KurtiDesignSchema.index({
  'attributes.neckline': 1,
  'attributes.sleeves': 1,
  'attributes.silhouette': 1,
  'attributes.length': 1,
  isActive: 1,
});
KurtiDesignSchema.index({ garmentType: 1, isActive: 1 });

export type IKurtiDesign = InferSchemaType<typeof KurtiDesignSchema> & Document;
export const KurtiDesign = model<IKurtiDesign>('KurtiDesign', KurtiDesignSchema);
