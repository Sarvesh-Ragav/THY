import type { GarmentSilhouette, StudioGarment } from '@/lib/design-studio';

export const C15_AUDIENCES = ['women', 'men', 'girls', 'boys'] as const;
export type C15Audience = (typeof C15_AUDIENCES)[number];

export interface C15Garment {
  id: string;
  label: string;
  audience: C15Audience;
  silhouette: GarmentSilhouette;
  fabricImage: string;
}

export const C15_AUDIENCE_LABELS: Record<C15Audience, string> = {
  women: 'Women',
  men: 'Men',
  girls: 'Girls',
  boys: 'Boys',
};

export const C15_GARMENTS: C15Garment[] = [
  { id: 'saree-blouse', label: 'Saree Blouse', audience: 'women', silhouette: 'kurti', fabricImage: '/hero/fabric-charcoal.png' },
  { id: 'kurti', label: 'Kurti', audience: 'women', silhouette: 'kurti', fabricImage: '/hero/fabric-beige.png' },
  { id: 'salwar-suit', label: 'Salwar Suit', audience: 'women', silhouette: 'kurti', fabricImage: '/hero/fabric-beige.png' },
  { id: 'anarkali', label: 'Anarkali', audience: 'women', silhouette: 'kurti', fabricImage: '/hero/fabric-olive.png' },
  { id: 'lehenga', label: 'Lehenga', audience: 'women', silhouette: 'lehenga', fabricImage: '/hero/fabric-beige.png' },
  { id: 'dress', label: 'Dress', audience: 'women', silhouette: 'kurti', fabricImage: '/hero/hero-couple.png' },
  { id: 'gown', label: 'Gown', audience: 'women', silhouette: 'lehenga', fabricImage: '/hero/fabric-charcoal.png' },
  { id: 'bridal-wear', label: 'Bridal Wear', audience: 'women', silhouette: 'lehenga', fabricImage: '/hero/hero-couple.png' },
  { id: 'shirt', label: 'Shirt', audience: 'men', silhouette: 'sherwani', fabricImage: '/hero/fabric-olive.png' },
  { id: 't-shirt', label: 'T-Shirt', audience: 'men', silhouette: 'sherwani', fabricImage: '/hero/fabric-beige.png' },
  { id: 'kurta', label: 'Kurta', audience: 'men', silhouette: 'sherwani', fabricImage: '/hero/fabric-olive.png' },
  { id: 'kurta-pajama', label: 'Kurta Pajama', audience: 'men', silhouette: 'sherwani', fabricImage: '/hero/fabric-charcoal.png' },
  { id: 'nehru-jacket', label: 'Nehru Jacket', audience: 'men', silhouette: 'sherwani', fabricImage: '/hero/fabric-olive.png' },
  { id: 'waistcoat', label: 'Waistcoat', audience: 'men', silhouette: 'sherwani', fabricImage: '/hero/fabric-charcoal.png' },
  { id: 'sherwani', label: 'Sherwani', audience: 'men', silhouette: 'sherwani', fabricImage: '/hero/fabric-olive.png' },
  { id: 'suit', label: 'Suit', audience: 'men', silhouette: 'sherwani', fabricImage: '/hero/fabric-charcoal.png' },
  { id: 'trousers', label: 'Trousers', audience: 'men', silhouette: 'sherwani', fabricImage: '/hero/fabric-beige.png' },
  { id: 'frock', label: 'Frock', audience: 'girls', silhouette: 'kurti', fabricImage: '/hero/fabric-beige.png' },
  { id: 'girls-dress', label: 'Girls Dress', audience: 'girls', silhouette: 'kurti', fabricImage: '/hero/hero-couple.png' },
  { id: 'girls-lehenga', label: 'Lehenga', audience: 'girls', silhouette: 'lehenga', fabricImage: '/hero/fabric-beige.png' },
  { id: 'pavada', label: 'Pavadal / Pavada', audience: 'girls', silhouette: 'lehenga', fabricImage: '/hero/fabric-charcoal.png' },
  { id: 'girls-salwar', label: 'Salwar Suit', audience: 'girls', silhouette: 'kurti', fabricImage: '/hero/fabric-beige.png' },
  { id: 'girls-anarkali', label: 'Anarkali', audience: 'girls', silhouette: 'kurti', fabricImage: '/hero/fabric-olive.png' },
  { id: 'skirt-top', label: 'Skirt & Top', audience: 'girls', silhouette: 'kurti', fabricImage: '/hero/hero-couple.png' },
  { id: 'girls-gown', label: 'Gown', audience: 'girls', silhouette: 'lehenga', fabricImage: '/hero/fabric-charcoal.png' },
  { id: 'boys-shirt', label: 'Shirt', audience: 'boys', silhouette: 'sherwani', fabricImage: '/hero/fabric-olive.png' },
  { id: 'boys-tshirt', label: 'T-Shirt', audience: 'boys', silhouette: 'sherwani', fabricImage: '/hero/fabric-beige.png' },
  { id: 'boys-kurta', label: 'Kurta', audience: 'boys', silhouette: 'sherwani', fabricImage: '/hero/fabric-olive.png' },
  { id: 'boys-kurta-pajama', label: 'Kurta Pajama', audience: 'boys', silhouette: 'sherwani', fabricImage: '/hero/fabric-charcoal.png' },
  { id: 'boys-waistcoat', label: 'Waistcoat', audience: 'boys', silhouette: 'sherwani', fabricImage: '/hero/fabric-charcoal.png' },
  { id: 'boys-sherwani', label: 'Sherwani', audience: 'boys', silhouette: 'sherwani', fabricImage: '/hero/fabric-olive.png' },
  { id: 'boys-suit', label: 'Suit', audience: 'boys', silhouette: 'sherwani', fabricImage: '/hero/fabric-charcoal.png' },
  { id: 'boys-trousers', label: 'Trousers', audience: 'boys', silhouette: 'sherwani', fabricImage: '/hero/fabric-beige.png' },
  { id: 'shorts', label: 'Shorts', audience: 'boys', silhouette: 'sherwani', fabricImage: '/hero/fabric-beige.png' },
];

export function isC15Audience(value?: string | null): value is C15Audience {
  return Boolean(value && (C15_AUDIENCES as readonly string[]).includes(value));
}

export function garmentsForAudience(audience: C15Audience) {
  return C15_GARMENTS.filter((garment) => garment.audience === audience);
}

export function searchC15Garments(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return C15_GARMENTS;
  return C15_GARMENTS.filter((garment) => {
    const audience = C15_AUDIENCE_LABELS[garment.audience].toLowerCase();
    return garment.label.toLowerCase().includes(needle) || audience.includes(needle);
  });
}

export function getC15Garment(id?: string | null) {
  return C15_GARMENTS.find((garment) => garment.id === id) ?? null;
}

export function c15ToStudio(garment: C15Garment): StudioGarment {
  return {
    categoryId: garment.id,
    garment: garment.label,
    silhouette: garment.silhouette,
    fabric: 'Customer uploaded fabric',
    fabricImage: garment.fabricImage,
    treatments: ['Colors', 'Prints', 'Texture'],
  };
}

export function c13UploadHref(audience: C15Audience, garmentId: string) {
  return `/stitch-your-outfit/preview?category=${encodeURIComponent(garmentId)}&audience=${audience}`;
}
