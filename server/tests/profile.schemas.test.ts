import assert from 'node:assert/strict';
import test from 'node:test';
import { createAddressSchema, customerPreferencesSchema, customerProfileSchema, tailorProfileSchema, tailorVerificationSchema, updateAddressSchema } from '../src/validators/profile.schemas.js';

test('customer profile accepts the existing onboarding fields', () => {
  assert.deepEqual(customerProfileSchema.parse({ fullName: 'Asha Rao', email: 'asha@example.com', city: 'Chennai' }), { fullName: 'Asha Rao', email: 'asha@example.com', city: 'Chennai' });
  assert.equal(customerProfileSchema.safeParse({}).success, false);
});

test('customer preferences only accept values represented by the frontend', () => {
  assert.equal(customerPreferencesSchema.safeParse({ shoppingFor: 'Myself', contactMethod: 'WhatsApp', services: ['Stitching'], garmentTypes: ['Ethnic wear'] }).success, true);
  assert.equal(customerPreferencesSchema.safeParse({ shoppingFor: 'Everyone', contactMethod: 'Email', services: [], garmentTypes: [] }).success, false);
});

test('address validation distinguishes creation from partial updates', () => {
  assert.equal(createAddressSchema.safeParse({ addressLine1: '12 Market Road', city: 'Chennai' }).success, true);
  assert.equal(updateAddressSchema.safeParse({ isDefault: true }).success, true);
  assert.equal(updateAddressSchema.safeParse({}).success, false);
});

test('tailor profile and verification submissions validate their required fields', () => {
  assert.equal(tailorProfileSchema.safeParse({ fullName: 'Ravi Kumar', shopName: 'Ravi Tailors', yearsOfExperience: '12', shopAddress: '10 MG Road' }).success, true);
  assert.equal(tailorVerificationSchema.safeParse({ idType: 'Aadhaar', idNumber: '123456789012', documentName: 'aadhaar.pdf' }).success, true);
  assert.equal(tailorVerificationSchema.safeParse({ idType: 'Aadhaar', idNumber: '12', documentName: '' }).success, false);
});
