import assert from 'node:assert/strict';
import test from 'node:test';
import { catalogueQuerySchema, categorySlugSchema, tailorDirectoryQuerySchema, tailorPublicIdSchema } from '../src/validators/catalogue.schemas.js';
import { toCategory, toDesign, toTailor } from '../src/services/catalogue.service.js';

test('category retrieval response retains the fixture fields', () => {
  assert.deepEqual(toCategory({ id: 'category-id', slug: 'sarees', name: 'Sarees', description: null, image_url: '/hero/fabric-charcoal.png', display_order: 1 }), { id: 'category-id', slug: 'sarees', name: 'Sarees', description: null, imageUrl: '/hero/fabric-charcoal.png', displayOrder: 1 });
  assert.equal(categorySlugSchema.safeParse({ slug: 'salwars' }).success, true);
  assert.equal(categorySlugSchema.safeParse({ slug: 'Salwars!' }).success, false);
});

test('design filters validate pagination, category, search, and flags', () => {
  const parsed = catalogueQuerySchema.parse({ category: 'sarees', q: 'Zari silk', trending: 'true', popular: 'false', page: '2', limit: '10' });
  assert.deepEqual(parsed, { category: 'sarees', q: 'Zari silk', trending: true, popular: false, page: 2, limit: 10 });
  assert.equal(catalogueQuerySchema.safeParse({ page: '0' }).success, false);
  assert.equal(catalogueQuerySchema.safeParse({ trending: 'yes' }).success, false);
  assert.equal(toDesign({ id: 'd5', title: 'Zari silk saree', image_url: '/hero/hero-street.png', is_popular: true, is_trending: false, category_slug: 'sarees', category_name: 'Sarees' }).category.slug, 'sarees');
});

test('tailor list and detail inputs support directory filtering without exposing verification data', () => {
  assert.deepEqual(tailorDirectoryQuerySchema.parse({ city: 'Chennai', q: 'Meera' }), { city: 'Chennai', q: 'Meera', page: 1, limit: 20 });
  assert.equal(tailorDirectoryQuerySchema.safeParse({ limit: '51' }).success, false);
  assert.equal(tailorPublicIdSchema.safeParse({ id: 't1' }).success, true);
  assert.equal(tailorPublicIdSchema.safeParse({ id: '../private' }).success, false);
  const tailor = toTailor({ user_id: 'user-id', public_id: 't1', full_name: 'Meera Krishnan', shop_name: 'Atelier Meera', city: 'Chennai', directory_image_url: '/hero/hero-couple.png', years_of_experience: 12, specialties: ['Kanjeevaram sarees'] });
  assert.deepEqual(tailor, { id: 't1', name: 'Meera Krishnan', studio: 'Atelier Meera', city: 'Chennai', specialty: 'Kanjeevaram sarees', specialties: ['Kanjeevaram sarees'], imageUrl: '/hero/hero-couple.png', yearsOfExperience: 12 });
});
