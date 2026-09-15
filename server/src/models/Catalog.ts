import { Schema, model, type Document, type InferSchemaType } from 'mongoose';

// 1. Category Schema
const CategorySchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
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

export type ICategory = InferSchemaType<typeof CategorySchema> & Document;
export const Category = model<ICategory>('Category', CategorySchema);

// 2. Design Catalog Item Schema
const DesignCatalogItemSchema = new Schema(
  {
    designCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    categorySlug: {
      type: String,
      required: true,
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
    },
    isPopular: {
      type: Boolean,
      default: false,
      index: true,
    },
    isTrending: {
      type: Boolean,
      default: false,
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

DesignCatalogItemSchema.index({ categorySlug: 1, isActive: 1, displayOrder: 1 });
DesignCatalogItemSchema.index({ isPopular: 1, isActive: 1 });
DesignCatalogItemSchema.index({ isTrending: 1, isActive: 1 });

export type IDesignCatalogItem = InferSchemaType<typeof DesignCatalogItemSchema> & Document;
export const DesignCatalogItem = model<IDesignCatalogItem>('DesignCatalogItem', DesignCatalogItemSchema);
