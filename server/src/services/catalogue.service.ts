import { pool } from '../db/pool.js';
import { ApiError } from '../utils/api-error.js';

type CatalogueQuery = { category?: string; q?: string; trending?: boolean; popular?: boolean; page: number; limit: number };
type TailorDirectoryQuery = { city?: string; q?: string; page: number; limit: number };
type CategoryRow = { id: string; slug: string; name: string; description: string | null; image_url: string | null; display_order: number };
type DesignRow = { id: string; title: string; image_url: string; is_popular: boolean; is_trending: boolean; category_slug: string; category_name: string };
type TailorRow = { user_id: string; public_id: string; full_name: string; shop_name: string; city: string; directory_image_url: string | null; years_of_experience: number; specialties: string[] };
type PortfolioRow = { id: string; title: string; image_url: string; display_order: number };

function pagination(page: number, limit: number, total: number) { return { page, limit, total, totalPages: Math.ceil(total / limit) }; }
function escapedLike(value: string): string { return `%${value.replace(/[\\%_]/g, (character) => `\\${character}`)}%`; }

export function toCategory(row: CategoryRow) { return { id: row.id, slug: row.slug, name: row.name, description: row.description, imageUrl: row.image_url, displayOrder: row.display_order }; }
export function toDesign(row: DesignRow) { return { id: row.id, title: row.title, imageUrl: row.image_url, popular: row.is_popular, trending: row.is_trending, category: { slug: row.category_slug, name: row.category_name } }; }
export function toTailor(row: TailorRow) { return { id: row.public_id, name: row.full_name, studio: row.shop_name, city: row.city, specialty: row.specialties[0] ?? null, specialties: row.specialties, imageUrl: row.directory_image_url, yearsOfExperience: row.years_of_experience }; }

export async function listCategories() {
  const result = await pool.query<CategoryRow>('SELECT id, slug, name, description, image_url, display_order FROM categories WHERE is_active = TRUE ORDER BY display_order, name');
  return result.rows.map(toCategory);
}

export async function getCategory(slug: string) {
  const result = await pool.query<CategoryRow>('SELECT id, slug, name, description, image_url, display_order FROM categories WHERE slug = $1 AND is_active = TRUE', [slug]);
  if (!result.rowCount) throw new ApiError(404, 'Category was not found.', 'CATEGORY_NOT_FOUND');
  return toCategory(result.rows[0]);
}

export async function listDesigns(query: CatalogueQuery) {
  const conditions = ['d.is_active = TRUE', 'c.is_active = TRUE'];
  const values: unknown[] = [];
  const add = (clause: string, value: unknown) => { values.push(value); conditions.push(clause.replace('?', `$${values.length}`)); };
  if (query.category) add('c.slug = ?', query.category);
  if (query.q) add(`d.title ILIKE ? ESCAPE '\\'`, escapedLike(query.q));
  if (query.trending !== undefined) add('d.is_trending = ?', query.trending);
  if (query.popular !== undefined) add('d.is_popular = ?', query.popular);
  const where = conditions.join(' AND ');
  const total = await pool.query<{ count: string }>(`SELECT count(*) FROM design_catalog_items d JOIN categories c ON c.id = d.category_id WHERE ${where}`, values);
  values.push(query.limit, (query.page - 1) * query.limit);
  const result = await pool.query<DesignRow>(
    `SELECT d.id, d.title, d.image_url, d.is_popular, d.is_trending, c.slug AS category_slug, c.name AS category_name
     FROM design_catalog_items d JOIN categories c ON c.id = d.category_id WHERE ${where}
     ORDER BY d.display_order, d.title LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  );
  return { items: result.rows.map(toDesign), pagination: pagination(query.page, query.limit, Number(total.rows[0].count)) };
}

const tailorSelect = `SELECT p.user_id, p.public_id, p.full_name, p.shop_name, p.city, p.directory_image_url, p.years_of_experience,
  COALESCE((SELECT array_agg(s.name ORDER BY s.display_order, s.name) FROM tailor_specialties s WHERE s.tailor_user_id = p.user_id), '{}') AS specialties
  FROM tailor_profiles p`;

export async function listTailors(query: TailorDirectoryQuery) {
  const conditions = ['p.is_directory_active = TRUE', 'p.public_id IS NOT NULL', 'p.city IS NOT NULL'];
  const values: unknown[] = [];
  const add = (clause: string, value: unknown) => { values.push(value); conditions.push(clause.replace('?', `$${values.length}`)); };
  if (query.city) add('p.city ILIKE ? ESCAPE \'\\\'', escapedLike(query.city));
  if (query.q) {
    const value = escapedLike(query.q);
    values.push(value);
    const parameter = `$${values.length}`;
    conditions.push(`(p.full_name ILIKE ${parameter} ESCAPE '\\' OR p.shop_name ILIKE ${parameter} ESCAPE '\\' OR p.city ILIKE ${parameter} ESCAPE '\\' OR EXISTS (SELECT 1 FROM tailor_specialties s WHERE s.tailor_user_id = p.user_id AND s.name ILIKE ${parameter} ESCAPE '\\'))`);
  }
  const where = conditions.join(' AND ');
  const total = await pool.query<{ count: string }>(`SELECT count(*) FROM tailor_profiles p WHERE ${where}`, values);
  values.push(query.limit, (query.page - 1) * query.limit);
  const result = await pool.query<TailorRow>(`${tailorSelect} WHERE ${where} ORDER BY p.full_name LIMIT $${values.length - 1} OFFSET $${values.length}`, values);
  return { items: result.rows.map(toTailor), pagination: pagination(query.page, query.limit, Number(total.rows[0].count)) };
}

export async function getTailor(publicId: string) {
  // Detail visibility must match the directory: an incomplete profile cannot be
  // fetched directly just because it has been assigned a public id.
  const result = await pool.query<TailorRow>(`${tailorSelect} WHERE p.public_id = $1 AND p.is_directory_active = TRUE AND p.city IS NOT NULL`, [publicId]);
  if (!result.rowCount) throw new ApiError(404, 'Tailor was not found.', 'TAILOR_NOT_FOUND');
  const row = result.rows[0];
  const portfolio = await pool.query<PortfolioRow>('SELECT id, title, image_url, display_order FROM tailor_portfolio_assets WHERE tailor_user_id = $1 AND is_active = TRUE ORDER BY display_order, title', [row.user_id]);
  return { ...toTailor(row), portfolio: portfolio.rows.map((item) => ({ id: item.id, title: item.title, imageUrl: item.image_url, displayOrder: item.display_order })) };
}
