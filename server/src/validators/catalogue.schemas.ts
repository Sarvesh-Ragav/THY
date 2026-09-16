import { z } from 'zod';

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

const optionalText = (max: number) => z.string().trim().min(1).max(max).optional();
const optionalBoolean = z.enum(['true', 'false']).transform((value) => value === 'true').optional();

export const catalogueQuerySchema = paginationSchema.extend({
  category: z.string().trim().regex(/^[a-z0-9-]+$/).max(80).optional(),
  q: optionalText(120),
  trending: optionalBoolean,
  popular: optionalBoolean,
});

export const tailorDirectoryQuerySchema = paginationSchema.extend({
  city: optionalText(120),
  q: optionalText(120),
  limit: z.coerce.number().int().min(1).max(50).default(50),
});

export const categorySlugSchema = z.object({ slug: z.string().trim().regex(/^[a-z0-9-]+$/).max(80) });
export const tailorPublicIdSchema = z.object({ id: z.string().trim().regex(/^[A-Za-z0-9_-]+$/).max(64) });
