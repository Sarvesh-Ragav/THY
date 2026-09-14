import { z } from 'zod';

const trimmed = (max: number) => z.string().trim().min(1).max(max);
const optionalTrimmed = (max: number) => z.string().trim().min(1).max(max).optional();

export const customerProfileSchema = z.object({
  fullName: trimmed(120).optional(),
  email: z.string().trim().email().max(254).optional(),
  city: trimmed(120).optional(),
}).refine((value) => Object.values(value).some((item) => item !== undefined), 'At least one profile field is required.');

export const customerPreferencesSchema = z.object({
  shoppingFor: z.enum(['Myself', 'Family', 'Both']),
  contactMethod: z.enum(['Phone', 'WhatsApp', 'Email']),
  services: z.array(z.enum(['Stitching', 'Alterations', 'Custom outfits'])).min(1).max(3),
  garmentTypes: z.array(z.enum(['Ethnic wear', 'Western wear', 'Formal wear', 'Kids wear'])).max(4),
});

const addressFields = {
  label: optionalTrimmed(80),
  addressLine1: trimmed(500),
  addressLine2: optionalTrimmed(500),
  city: trimmed(120),
  state: optionalTrimmed(120),
  postalCode: optionalTrimmed(20),
  isDefault: z.boolean().optional(),
};

export const createAddressSchema = z.object(addressFields);
export const updateAddressSchema = z.object({
  label: optionalTrimmed(80),
  addressLine1: trimmed(500).optional(),
  addressLine2: optionalTrimmed(500),
  city: trimmed(120).optional(),
  state: optionalTrimmed(120),
  postalCode: optionalTrimmed(20),
  isDefault: z.boolean().optional(),
}).refine((value) => Object.values(value).some((item) => item !== undefined), 'At least one address field is required.');

export const addressIdSchema = z.object({ addressId: z.string().uuid() });

export const tailorProfileSchema = z.object({
  fullName: trimmed(120).optional(),
  shopName: trimmed(160).optional(),
  yearsOfExperience: z.coerce.number().int().min(0).max(80).optional(),
  shopAddress: trimmed(1_000).optional(),
}).refine((value) => Object.values(value).some((item) => item !== undefined), 'At least one profile field is required.');

export const tailorVerificationSchema = z.object({
  idType: trimmed(64),
  idNumber: z.string().trim().min(4).max(128),
  documentName: trimmed(255),
});
