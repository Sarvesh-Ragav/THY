import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generateOtp, hashValue, valuesMatch } from '../src/utils/crypto.js';

describe('OTP primitives', () => {
  it('generates a six-digit OTP and verifies only its hash', () => {
    const otp = generateOtp();
    assert.match(otp, /^\d{6}$/);
    assert.equal(valuesMatch(otp, hashValue(otp)), true);
    assert.equal(valuesMatch('000000', hashValue(otp)), otp === '000000');
  });
});
