import type { GarmentSilhouette, StudioGarment } from '@/lib/design-studio';

export const C15_AUDIENCES = ['women', 'boys'] as const;
export type C15Audience = 'women' | 'men' | 'girls' | 'boys';

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
  boys: 'Gents',
};

const categoryImage = (file: string) => `/garment_categories/${encodeURIComponent(file)}`;

export const C15_GARMENTS: C15Garment[] = [
  { id: 'blouse', label: 'Blouse', audience: 'women', silhouette: 'kurti', fabricImage: categoryImage('blouse.jpg') },
  { id: 'kurti', label: 'Kurti', audience: 'women', silhouette: 'kurti', fabricImage: categoryImage('kurti.jpg') },
  { id: 'salwar-suit', label: 'Salwar Suit', audience: 'women', silhouette: 'kurti', fabricImage: categoryImage('salwar suit.jpg') },
  { id: 'frock', label: 'Frock', audience: 'women', silhouette: 'kurti', fabricImage: categoryImage('frock.jpg') },
  { id: 'top', label: 'Top', audience: 'women', silhouette: 'kurti', fabricImage: categoryImage('top.jpg') },
  { id: 'boys-shirt', label: 'Shirt', audience: 'boys', silhouette: 'sherwani', fabricImage: categoryImage('shirt.jpg') },
  { id: 'boys-blazer', label: 'Blazer', audience: 'boys', silhouette: 'sherwani', fabricImage: categoryImage('blazer.jpg') },
  { id: 'boys-kurta', label: 'Kurta', audience: 'boys', silhouette: 'sherwani', fabricImage: categoryImage('kurta.jpg') },
  { id: 'boys-sherwani', label: 'Sherwani', audience: 'boys', silhouette: 'sherwani', fabricImage: categoryImage('sherwani.jpg') },
  { id: 'boys-pant', label: 'Pant', audience: 'boys', silhouette: 'sherwani', fabricImage: categoryImage('pant.jpg') },
];

export function isC15Audience(value?: string | null): value is C15Audience {
  return Boolean(value && ['women', 'men', 'girls', 'boys'].includes(value));
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
