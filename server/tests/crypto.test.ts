import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generateOtp, hashPassword, hashValue, valuesMatch, verifyPassword } from '../src/utils/crypto.js';

describe('OTP primitives', () => {
  it('generates a six-digit OTP and verifies only its hash', () => {
    const otp = generateOtp();
    assert.match(otp, /^\d{6}$/);
    assert.equal(valuesMatch(otp, hashValue(otp)), true);
    assert.equal(valuesMatch('000000', hashValue(otp)), otp === '000000');
  });
});

describe('password hashing', () => {
  it('stores a salted hash and verifies the original password', async () => {
    const hash = await hashPassword('atelier-secret');
    assert.match(hash, /^scrypt:[a-f0-9]+:[a-f0-9]+$/);
    assert.equal(await verifyPassword('atelier-secret', hash), true);
    assert.equal(await verifyPassword('wrong-password', hash), false);
  });
});
