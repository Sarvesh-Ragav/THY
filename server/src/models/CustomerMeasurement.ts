import { Schema, model, type Document, type InferSchemaType, Types } from 'mongoose';

const CustomerMeasurementSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
      default: 'Saved Measurement Set',
    },
    category: {
      type: String,
      enum: ['sarees', 'salwars', 'sherwanis', 'lehengas', 'general', 'other'],
      default: 'general',
      index: true,
    },
    // Dynamic measurement values dictionary (e.g., { bust: 36, waist: 30, shoulder: 14.5 })
    values: {
      type: Map,
      of: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    unit: {
      type: String,
      enum: ['inch', 'cm'],
      default: 'inch',
    },
    notes: {
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

CustomerMeasurementSchema.index({ userId: 1, category: 1 });
CustomerMeasurementSchema.index({ userId: 1, isDefault: -1 });

export type ICustomerMeasurement = InferSchemaType<typeof CustomerMeasurementSchema> & Document;
export const CustomerMeasurement = model<ICustomerMeasurement>('CustomerMeasurement', CustomerMeasurementSchema);
