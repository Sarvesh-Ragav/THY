import { createHash, randomInt, timingSafeEqual } from 'node:crypto';

export function hashValue(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function generateOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, '0');
}

export function valuesMatch(value: string, expectedHash: string): boolean {
  const actual = Buffer.from(hashValue(value), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
