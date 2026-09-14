CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order SMALLINT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS design_catalog_items (
  id VARCHAR(64) PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  title VARCHAR(200) NOT NULL,
  image_url TEXT NOT NULL,
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  is_trending BOOLEAN NOT NULL DEFAULT FALSE,
  display_order SMALLINT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS design_catalog_items_category_idx ON design_catalog_items (category_id, display_order) WHERE is_active;
CREATE INDEX IF NOT EXISTS design_catalog_items_popular_idx ON design_catalog_items (is_popular, display_order) WHERE is_active;
CREATE INDEX IF NOT EXISTS design_catalog_items_trending_idx ON design_catalog_items (is_trending, display_order) WHERE is_active;

ALTER TABLE tailor_profiles ADD COLUMN IF NOT EXISTS public_id VARCHAR(64);
ALTER TABLE tailor_profiles ADD COLUMN IF NOT EXISTS city VARCHAR(120);
ALTER TABLE tailor_profiles ADD COLUMN IF NOT EXISTS directory_image_url TEXT;
ALTER TABLE tailor_profiles ADD COLUMN IF NOT EXISTS is_directory_active BOOLEAN NOT NULL DEFAULT TRUE;
CREATE UNIQUE INDEX IF NOT EXISTS tailor_profiles_public_id_idx ON tailor_profiles (public_id) WHERE public_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS tailor_profiles_directory_city_idx ON tailor_profiles (city) WHERE is_directory_active AND public_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS tailor_specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tailor_user_id UUID NOT NULL REFERENCES tailor_profiles(user_id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  display_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tailor_user_id, name)
);

CREATE TABLE IF NOT EXISTS tailor_portfolio_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tailor_user_id UUID NOT NULL REFERENCES tailor_profiles(user_id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  image_url TEXT NOT NULL,
  display_order SMALLINT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS tailor_portfolio_assets_user_idx ON tailor_portfolio_assets (tailor_user_id, display_order) WHERE is_active;

INSERT INTO categories (slug, name, image_url, display_order)
VALUES
  ('sarees', 'Sarees', '/hero/fabric-charcoal.png', 1),
  ('salwars', 'Salwars & Suits', '/hero/fabric-beige.png', 2),
  ('sherwanis', 'Sherwanis', '/hero/fabric-olive.png', 3),
  ('lehengas', 'Lehengas', '/hero/hero-couple.png', 4)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, image_url = EXCLUDED.image_url, display_order = EXCLUDED.display_order, updated_at = NOW();

INSERT INTO design_catalog_items (id, category_id, title, image_url, is_popular, is_trending, display_order)
SELECT seed.id, category.id, seed.title, seed.image_url, seed.is_popular, seed.is_trending, seed.display_order
FROM (VALUES
  ('d1', 'sarees', 'Kanjeevaram border drape', '/hero/fabric-charcoal.png', TRUE, TRUE, 1),
  ('d2', 'salwars', 'Festive anarkali', '/hero/fabric-beige.png', TRUE, FALSE, 2),
  ('d3', 'sherwanis', 'Olive bandhgala', '/hero/fabric-olive.png', TRUE, TRUE, 3),
  ('d4', 'lehengas', 'Reception lehenga', '/hero/hero-couple.png', FALSE, TRUE, 4),
  ('d5', 'sarees', 'Zari silk saree', '/hero/hero-street.png', TRUE, FALSE, 5),
  ('d6', 'salwars', 'Everyday salwar', '/hero/fabric-beige.png', FALSE, TRUE, 6)
) AS seed(id, category_slug, title, image_url, is_popular, is_trending, display_order)
JOIN categories category ON category.slug = seed.category_slug
ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, title = EXCLUDED.title, image_url = EXCLUDED.image_url, is_popular = EXCLUDED.is_popular, is_trending = EXCLUDED.is_trending, display_order = EXCLUDED.display_order, updated_at = NOW();

INSERT INTO users (id, phone_number, role)
VALUES
  ('a1000000-0000-4000-8000-000000000001', '+919000000001', 'tailor'),
  ('a1000000-0000-4000-8000-000000000002', '+919000000002', 'tailor'),
  ('a1000000-0000-4000-8000-000000000003', '+919000000003', 'tailor'),
  ('a1000000-0000-4000-8000-000000000004', '+919000000004', 'tailor')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tailor_profiles (user_id, full_name, shop_name, years_of_experience, shop_address, public_id, city, directory_image_url)
VALUES
  ('a1000000-0000-4000-8000-000000000001', 'Meera Krishnan', 'Atelier Meera', 12, 'Chennai', 't1', 'Chennai', '/hero/hero-couple.png'),
  ('a1000000-0000-4000-8000-000000000002', 'Arjun Desai', 'Desai House', 10, 'Mumbai', 't2', 'Mumbai', '/hero/fabric-olive.png'),
  ('a1000000-0000-4000-8000-000000000003', 'Farah Qureshi', 'Noor Studio', 11, 'Hyderabad', 't3', 'Hyderabad', '/hero/fabric-beige.png'),
  ('a1000000-0000-4000-8000-000000000004', 'Sana Iyer', 'Thread & Gold', 8, 'Bengaluru', 't4', 'Bengaluru', '/hero/fabric-charcoal.png')
ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name, shop_name = EXCLUDED.shop_name, years_of_experience = EXCLUDED.years_of_experience, shop_address = EXCLUDED.shop_address, public_id = EXCLUDED.public_id, city = EXCLUDED.city, directory_image_url = EXCLUDED.directory_image_url, updated_at = NOW();

INSERT INTO tailor_specialties (tailor_user_id, name, display_order)
VALUES
  ('a1000000-0000-4000-8000-000000000001', 'Kanjeevaram sarees', 1),
  ('a1000000-0000-4000-8000-000000000002', 'Sherwanis & bandhgala', 1),
  ('a1000000-0000-4000-8000-000000000003', 'Bridal lehengas', 1),
  ('a1000000-0000-4000-8000-000000000004', 'Salwars & suits', 1)
ON CONFLICT (tailor_user_id, name) DO UPDATE SET display_order = EXCLUDED.display_order;

INSERT INTO tailor_portfolio_assets (tailor_user_id, title, image_url, display_order)
VALUES
  ('a1000000-0000-4000-8000-000000000001', 'Atelier Meera portfolio', '/hero/hero-couple.png', 1),
  ('a1000000-0000-4000-8000-000000000002', 'Desai House portfolio', '/hero/fabric-olive.png', 1),
  ('a1000000-0000-4000-8000-000000000003', 'Noor Studio portfolio', '/hero/fabric-beige.png', 1),
  ('a1000000-0000-4000-8000-000000000004', 'Thread & Gold portfolio', '/hero/fabric-charcoal.png', 1)
ON CONFLICT DO NOTHING;
