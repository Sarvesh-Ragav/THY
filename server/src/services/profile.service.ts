import { pool } from '../db/pool.js';
import { hashValue } from '../utils/crypto.js';
import { ApiError } from '../utils/api-error.js';

type UserRole = 'customer' | 'tailor' | null;
type CustomerProfileInput = { fullName?: string; email?: string; city?: string };
type CustomerPreferencesInput = { shoppingFor: 'Myself' | 'Family' | 'Both'; contactMethod: 'Phone' | 'WhatsApp' | 'Email'; services: ('Stitching' | 'Alterations' | 'Custom outfits')[]; garmentTypes: ('Ethnic wear' | 'Western wear' | 'Formal wear' | 'Kids wear')[] };
type AddressInput = { label?: string; addressLine1: string; addressLine2?: string; city: string; state?: string; postalCode?: string; isDefault?: boolean };
type AddressUpdateInput = Partial<AddressInput>;
type TailorProfileInput = { fullName?: string; shopName?: string; yearsOfExperience?: number; shopAddress?: string };
type TailorVerificationInput = { idType: string; idNumber: string; documentName: string };

type UserRow = { role: UserRole; phone_number: string };
type CustomerProfileRow = { full_name: string; email: string; city: string; phone_number: string };
type PreferencesRow = { shopping_for: CustomerPreferencesInput['shoppingFor']; contact_method: CustomerPreferencesInput['contactMethod']; services: CustomerPreferencesInput['services']; garment_types: CustomerPreferencesInput['garmentTypes'] };
type AddressRow = { id: string; label: string | null; address_line1: string; address_line2: string | null; city: string; state: string | null; postal_code: string | null; is_default: boolean; created_at: Date; updated_at: Date };
type TailorProfileRow = { full_name: string; shop_name: string; years_of_experience: number; shop_address: string; phone_number: string };
type VerificationRow = { id: string; id_type: string; document_name: string; status: 'pending' | 'approved' | 'rejected'; submitted_at: Date; reviewed_at: Date | null };

function notFound(message: string, code: string): never { throw new ApiError(404, message, code); }

function toAddress(row: AddressRow) {
  return { id: row.id, label: row.label, addressLine1: row.address_line1, addressLine2: row.address_line2, city: row.city, state: row.state, postalCode: row.postal_code, isDefault: row.is_default, createdAt: row.created_at, updatedAt: row.updated_at };
}

export async function getUserRole(userId: string): Promise<UserRole> {
  const result = await pool.query<{ role: UserRole }>('SELECT role FROM users WHERE id = $1 AND is_active = TRUE', [userId]);
  if (!result.rowCount) throw new ApiError(401, 'Authentication is no longer valid.', 'UNAUTHENTICATED');
  return result.rows[0].role;
}

async function claimRole(userId: string, role: Exclude<UserRole, null>): Promise<void> {
  const result = await pool.query<{ role: UserRole }>(
    `UPDATE users SET role = $2, updated_at = NOW() WHERE id = $1 AND is_active = TRUE AND (role IS NULL OR role = $2) RETURNING role`,
    [userId, role],
  );
  if (result.rowCount) return;
  const existing = await getUserRole(userId);
  if (existing) throw new ApiError(403, 'Your account is already registered with a different role.', 'ROLE_CONFLICT');
  throw new ApiError(401, 'Authentication is no longer valid.', 'UNAUTHENTICATED');
}

export async function getCustomerProfile(userId: string) {
  const role = await getUserRole(userId);
  if (role === 'tailor') throw new ApiError(403, 'You are not authorized to access this resource.', 'FORBIDDEN');
  const [profileResult, preferencesResult, addressResult] = await Promise.all([
    pool.query<CustomerProfileRow>('SELECT p.full_name, p.email, p.city, u.phone_number FROM customer_profiles p JOIN users u ON u.id = p.user_id WHERE p.user_id = $1', [userId]),
    pool.query<PreferencesRow>('SELECT shopping_for, contact_method, services, garment_types FROM customer_preferences WHERE user_id = $1', [userId]),
    pool.query<{ exists: boolean }>('SELECT EXISTS(SELECT 1 FROM customer_addresses WHERE user_id = $1) AS exists', [userId]),
  ]);
  const profile = profileResult.rows[0];
  const preferences = preferencesResult.rows[0];
  const profileComplete = Boolean(profile?.full_name && profile.email && profile.city);
  const preferencesComplete = Boolean(preferences?.services?.length);
  const addressComplete = addressResult.rows[0].exists;
  return {
    role,
    profile: profile ? { fullName: profile.full_name, phoneNumber: profile.phone_number, email: profile.email, city: profile.city } : null,
    preferences: preferences ? { shoppingFor: preferences.shopping_for, contactMethod: preferences.contact_method, services: preferences.services, garmentTypes: preferences.garment_types } : null,
    onboarding: { profileComplete, preferencesComplete, addressComplete, complete: profileComplete && preferencesComplete && addressComplete },
  };
}

export async function updateCustomerProfile(userId: string, input: CustomerProfileInput) {
  await claimRole(userId, 'customer');
  const existing = await pool.query<{ full_name: string; email: string; city: string }>('SELECT full_name, email, city FROM customer_profiles WHERE user_id = $1', [userId]);
  const current = existing.rows[0];
  if (!current && (!input.fullName || !input.email || !input.city)) throw new ApiError(400, 'fullName, email, and city are required when creating a profile.', 'VALIDATION_ERROR');
  const result = await pool.query<CustomerProfileRow>(
    `INSERT INTO customer_profiles (user_id, full_name, email, city) VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, city = EXCLUDED.city, updated_at = NOW()
     RETURNING full_name, email, city, (SELECT phone_number FROM users WHERE id = customer_profiles.user_id) AS phone_number`,
    [userId, input.fullName ?? current.full_name, input.email ?? current.email, input.city ?? current.city],
  );
  const row = result.rows[0];
  return { fullName: row.full_name, phoneNumber: row.phone_number, email: row.email, city: row.city };
}

export async function updateCustomerPreferences(userId: string, input: CustomerPreferencesInput) {
  const result = await pool.query<PreferencesRow>(
    `INSERT INTO customer_preferences (user_id, shopping_for, contact_method, services, garment_types) VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id) DO UPDATE SET shopping_for = EXCLUDED.shopping_for, contact_method = EXCLUDED.contact_method, services = EXCLUDED.services, garment_types = EXCLUDED.garment_types, updated_at = NOW()
     RETURNING shopping_for, contact_method, services, garment_types`,
    [userId, input.shoppingFor, input.contactMethod, input.services, input.garmentTypes],
  );
  const row = result.rows[0];
  return { shoppingFor: row.shopping_for, contactMethod: row.contact_method, services: row.services, garmentTypes: row.garment_types };
}

export async function listAddresses(userId: string) {
  const result = await pool.query<AddressRow>('SELECT * FROM customer_addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC', [userId]);
  return result.rows.map(toAddress);
}

export async function createAddress(userId: string, input: AddressInput) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [userId]);
    const existing = await client.query('SELECT id FROM customer_addresses WHERE user_id = $1 FOR UPDATE', [userId]);
    const isDefault = input.isDefault ?? existing.rowCount === 0;
    if (isDefault) await client.query('UPDATE customer_addresses SET is_default = FALSE, updated_at = NOW() WHERE user_id = $1 AND is_default = TRUE', [userId]);
    const result = await client.query<AddressRow>(
      `INSERT INTO customer_addresses (user_id, label, address_line1, address_line2, city, state, postal_code, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, input.label ?? null, input.addressLine1, input.addressLine2 ?? null, input.city, input.state ?? null, input.postalCode ?? null, isDefault],
    );
    await client.query('COMMIT');
    return toAddress(result.rows[0]);
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function updateAddress(userId: string, addressId: string, input: AddressUpdateInput) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query<AddressRow>('SELECT * FROM customer_addresses WHERE id = $1 AND user_id = $2 FOR UPDATE', [addressId, userId]);
    if (!existing.rowCount) notFound('Address was not found.', 'ADDRESS_NOT_FOUND');
    const current = existing.rows[0];
    const isDefault = input.isDefault ?? current.is_default;
    if (isDefault) await client.query('UPDATE customer_addresses SET is_default = FALSE, updated_at = NOW() WHERE user_id = $1 AND id <> $2 AND is_default = TRUE', [userId, addressId]);
    const result = await client.query<AddressRow>(
      `UPDATE customer_addresses SET label = $3, address_line1 = $4, address_line2 = $5, city = $6, state = $7, postal_code = $8, is_default = $9, updated_at = NOW()
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [addressId, userId, input.label ?? current.label, input.addressLine1 ?? current.address_line1, input.addressLine2 ?? current.address_line2, input.city ?? current.city, input.state ?? current.state, input.postalCode ?? current.postal_code, isDefault],
    );
    await client.query('COMMIT');
    return toAddress(result.rows[0]);
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}

export async function deleteAddress(userId: string, addressId: string): Promise<void> {
  const result = await pool.query('DELETE FROM customer_addresses WHERE id = $1 AND user_id = $2 RETURNING id', [addressId, userId]);
  if (!result.rowCount) notFound('Address was not found.', 'ADDRESS_NOT_FOUND');
}

export async function getTailorProfile(userId: string) {
  const result = await pool.query<TailorProfileRow>('SELECT p.full_name, p.shop_name, p.years_of_experience, p.shop_address, u.phone_number FROM tailor_profiles p JOIN users u ON u.id = p.user_id WHERE p.user_id = $1', [userId]);
  const row = result.rows[0];
  return row ? { fullName: row.full_name, phoneNumber: row.phone_number, shopName: row.shop_name, yearsOfExperience: row.years_of_experience, shopAddress: row.shop_address } : null;
}

export async function updateTailorProfile(userId: string, input: TailorProfileInput) {
  await claimRole(userId, 'tailor');
  const existing = await pool.query<{ full_name: string; shop_name: string; years_of_experience: number; shop_address: string }>('SELECT full_name, shop_name, years_of_experience, shop_address FROM tailor_profiles WHERE user_id = $1', [userId]);
  const current = existing.rows[0];
  if (!current && (!input.fullName || !input.shopName || input.yearsOfExperience === undefined || !input.shopAddress)) throw new ApiError(400, 'fullName, shopName, yearsOfExperience, and shopAddress are required when creating a profile.', 'VALIDATION_ERROR');
  await pool.query(
    `INSERT INTO tailor_profiles (user_id, full_name, shop_name, years_of_experience, shop_address) VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name, shop_name = EXCLUDED.shop_name, years_of_experience = EXCLUDED.years_of_experience, shop_address = EXCLUDED.shop_address, updated_at = NOW()`,
    [userId, input.fullName ?? current.full_name, input.shopName ?? current.shop_name, input.yearsOfExperience ?? current.years_of_experience, input.shopAddress ?? current.shop_address],
  );
  return getTailorProfile(userId);
}

export async function submitTailorVerification(userId: string, input: TailorVerificationInput) {
  const result = await pool.query<VerificationRow>(
    `INSERT INTO tailor_verifications (user_id, id_type, id_number_hash, document_name)
     VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO NOTHING
     RETURNING id, id_type, document_name, status, submitted_at, reviewed_at`,
    [userId, input.idType, hashValue(input.idNumber), input.documentName],
  );
  if (!result.rowCount) throw new ApiError(409, 'A verification submission already exists for this tailor.', 'VERIFICATION_ALREADY_SUBMITTED');
  const row = result.rows[0];
  return { id: row.id, idType: row.id_type, documentName: row.document_name, status: row.status, submittedAt: row.submitted_at, reviewedAt: row.reviewed_at };
}
