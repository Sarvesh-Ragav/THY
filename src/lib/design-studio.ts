import { c15ToStudio, getC15Garment } from '@/lib/c15-catalog';

export const STUDIO_STEPS = [
  { id: 'design', label: 'Design', href: '/stitch-your-outfit/preview' },
  { id: 'try-on', label: 'Try On', href: '/stitch-your-outfit/try-on' },
  { id: 'measurements', label: 'Measurements', href: '/stitch-your-outfit/measurements' },
  { id: 'tailor', label: 'Tailor', href: '/tailors' },
  { id: 'estimate', label: 'Estimate', href: '/stitch-your-outfit/estimate' },
  { id: 'cart', label: 'Cart', href: '/stitch-your-outfit/cart' },
] as const;

export type StudioStepId = (typeof STUDIO_STEPS)[number]['id'];
export type GarmentSilhouette = 'saree' | 'kurti' | 'sherwani' | 'lehenga';
export type FabricTreatment = 'Colors' | 'Prints' | 'Motifs' | 'Embroidery' | 'Texture';

export const FABRIC_TREATMENTS: FabricTreatment[] = [
  'Colors',
  'Prints',
  'Motifs',
  'Embroidery',
  'Texture',
];

export interface StudioGarment {
  categoryId: string;
  garment: string;
  silhouette: GarmentSilhouette;
  fabric: string;
  fabricImage: string;
  treatments: FabricTreatment[];
}

export const STUDIO_GARMENTS: Record<string, StudioGarment> = {
  sarees: {
    categoryId: 'sarees',
    garment: 'Kanjeevaram Saree',
    silhouette: 'saree',
    fabric: 'Customer uploaded fabric',
    fabricImage: '/hero/fabric-charcoal.png',
    treatments: ['Colors', 'Prints', 'Motifs'],
  },
  salwars: {
    categoryId: 'salwars',
    garment: 'A-line Kurti',
    silhouette: 'kurti',
    fabric: 'Customer uploaded fabric',
    fabricImage: '/hero/fabric-beige.png',
    treatments: ['Prints', 'Motifs'],
  },
  sherwanis: {
    categoryId: 'sherwanis',
    garment: 'Classic Bandhgala',
    silhouette: 'sherwani',
    fabric: 'Customer uploaded fabric',
    fabricImage: '/hero/fabric-olive.png',
    treatments: ['Colors', 'Texture'],
  },
  lehengas: {
    categoryId: 'lehengas',
    garment: 'Reception Lehenga',
    silhouette: 'lehenga',
    fabric: 'Customer uploaded fabric',
    fabricImage: '/hero/fabric-beige.png',
    treatments: ['Colors', 'Motifs', 'Embroidery'],
  },
};

export function getStudioGarment(categoryId?: string | null): StudioGarment {
  if (categoryId && STUDIO_GARMENTS[categoryId]) {
    return STUDIO_GARMENTS[categoryId];
  }
  const c15 = getC15Garment(categoryId);
  if (c15) return c15ToStudio(c15);
  return STUDIO_GARMENTS.salwars;
}

export function asFabricTreatments(values?: string[]): FabricTreatment[] {
  if (!values) return [];
  return values.filter((value): value is FabricTreatment =>
    FABRIC_TREATMENTS.includes(value as FabricTreatment),
  );
}

export function studioPreviewHref(categoryId: string) {
  return `/stitch-your-outfit/preview?category=${encodeURIComponent(categoryId)}`;
}
