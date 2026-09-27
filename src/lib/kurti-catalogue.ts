import type { GarmentCustomizationDetails } from '@/lib/studio-draft';

export interface KurtiAttributes {
  neckline: string;
  sleeves: string;
  silhouette: string;
  length: string;
}

export interface KurtiCatalogueDesign {
  designCode: string;
  title: string;
  imageUrl: string;
  attributes: KurtiAttributes;
}

const MATCH_FIELDS = ['neckline', 'sleeves', 'silhouette', 'length'] as const;
export type KurtiMatchField = (typeof MATCH_FIELDS)[number];

const DEFAULT_PATTERN_PATH = '/preview/Roundneck_sleeveless_A-line_calflength.png';

const VALUE_ALIASES: Record<KurtiMatchField, Record<string, string>> = {
  neckline: {
    square: 'Square Neck',
    collar: 'Collar Neck',
  },
  sleeves: {
    'half sleeve': 'Short Sleeve',
    'three-quarter': '3/4th Sleeve',
    'three quarter': '3/4th Sleeve',
    'cap sleeve': 'Short Sleeve',
  },
  silhouette: {
    relaxed: 'Straight',
    fitted: 'Straight',
    flared: 'A-Line',
    'fit and flare': 'A-Line',
  },
  length: {
    'above knee': 'Short',
    'ankle length': 'Full Length',
    crop: 'Short',
    waist: 'Short',
    hip: 'Knee Length',
    long: 'Full Length',
  },
};

function same(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

export function canonicalKurtiValue(field: KurtiMatchField, value: string) {
  const trimmed = value.trim();
  return VALUE_ALIASES[field][trimmed.toLowerCase()] ?? trimmed;
}

export function isDefaultPattern(source?: string | null) {
  if (!source) return true;
  return source === DEFAULT_PATTERN_PATH || source.endsWith('Roundneck_sleeveless_A-line_calflength.png');
}

export function normalizeNeckline(raw: string): string {
  const clean = raw.toLowerCase().replace(/[-_]/g, ' ').trim();
  if (clean.includes('round')) return 'Round Neck';
  if (clean.includes('v neck') || clean.includes('v-neck')) return 'V-Neck';
  if (clean.includes('boat')) return 'Boat Neck';
  if (clean.includes('square')) return 'Square Neck';
  if (clean.includes('collar')) return 'Collar Neck';
  return raw;
}

export function normalizeSleeves(raw: string): string {
  const clean = raw.toLowerCase().replace(/[-_]/g, ' ').trim();
  if (clean.includes('3 4') || clean.includes('3/4') || clean.includes('3_4th')) return '3/4th Sleeve';
  if (clean.includes('elbow')) return 'Elbow Sleeve';
  if (clean.includes('full')) return 'Full Sleeve';
  if (clean.includes('short')) return 'Short Sleeve';
  if (clean.includes('sleeveless')) return 'Sleeveless';
  return raw;
}

export function normalizeSilhouette(raw: string): string {
  const clean = raw.toLowerCase().replace(/[-_]/g, ' ').trim();
  if (clean.includes('anarkali')) return 'Anarkali';
  if (clean.includes('princess') || clean.includes('princesscut')) return 'Princess Cut';
  if (clean.includes('straight')) return 'Straight';
  if (clean.includes('a line') || clean.includes('a-line')) return 'A-Line';
  if (clean.includes('flared')) return 'Flared';
  return raw;
}

export function normalizeLength(raw: string): string {
  const clean = raw.toLowerCase().replace(/[-_]/g, ' ').trim();
  if (clean.includes('calf') || clean.includes('calflength')) return 'Calf Length';
  if (clean.includes('knee') || clean.includes('kneelength')) return 'Knee Length';
  if (clean.includes('full') || clean.includes('fulllength')) return 'Full Length';
  if (clean.includes('short')) return 'Short';
  return raw;
}

/** Same filename rules as the kurti seed that fills KurtiDesign. */
export function parseKurtiFilename(fileName: string): KurtiCatalogueDesign | null {
  if (!fileName.toLowerCase().endsWith('.png')) return null;

  const baseNameWithoutExt = fileName.replace(/\.png$/i, '').trim().replace(/[_ ]+$/, '');
  const normalizedFileName = `${baseNameWithoutExt}.png`;
  const parts = baseNameWithoutExt.split('_').filter(Boolean);
  if (parts.length < 4) return null;

  let rawSleeve = '';
  let rawSilhouette = '';
  let rawLength = '';

  if (parts.length === 4) {
    rawSleeve = parts[1];
    rawSilhouette = parts[2];
    rawLength = parts[3];
  } else if (parts.length === 5) {
    if (parts[1] === '3' && (parts[2].startsWith('4') || parts[2].includes('sleeve'))) {
      rawSleeve = `${parts[1]}_${parts[2]}`;
      rawSilhouette = parts[3];
      rawLength = parts[4];
    } else {
      rawSleeve = parts[1];
      rawSilhouette = `${parts[2]}_${parts[3]}`;
      rawLength = parts[4];
    }
  } else {
    rawSleeve = `${parts[1]}_${parts[2]}`;
    rawSilhouette = parts[3];
    rawLength = parts[4];
  }

  const attributes: KurtiAttributes = {
    neckline: normalizeNeckline(parts[0]),
    sleeves: normalizeSleeves(rawSleeve),
    silhouette: normalizeSilhouette(rawSilhouette),
    length: normalizeLength(rawLength),
  };

  const designCode = `kurti-${attributes.neckline}-${attributes.sleeves}-${attributes.silhouette}-${attributes.length}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

  return {
    designCode,
    title: `${attributes.neckline} ${attributes.sleeves} ${attributes.silhouette} Kurti (${attributes.length})`,
    imageUrl: `/stylecraftdb/Kurti/${encodeURIComponent(normalizedFileName)}`,
    attributes,
  };
}

function selectedKurtiValue(details: GarmentCustomizationDetails | null | undefined, field: KurtiMatchField) {
  const raw = details?.[field];
  if (!raw) return '';
  return canonicalKurtiValue(field, raw);
}

export function findKurtiDesign(
  designs: KurtiCatalogueDesign[],
  details: GarmentCustomizationDetails | null | undefined
): KurtiCatalogueDesign | null {
  if (!details?.neckline || !details.sleeves || !details.silhouette || !details.length) return null;
  return (
    designs.find((design) =>
      MATCH_FIELDS.every((field) => same(design.attributes[field], selectedKurtiValue(details, field)))
    ) ?? null
  );
}

/** Exact catalogue row when one exists, otherwise the dress that shares the most selected attributes. */
export function bestKurtiDesign(
  designs: KurtiCatalogueDesign[],
  details: GarmentCustomizationDetails | null | undefined
): KurtiCatalogueDesign | null {
  const exact = findKurtiDesign(designs, details);
  if (exact) return exact;

  let best: { design: KurtiCatalogueDesign; score: number } | null = null;
  let selectedCount = 0;
  for (const field of MATCH_FIELDS) {
    if (selectedKurtiValue(details, field)) selectedCount += 1;
  }
  if (selectedCount === 0) return null;

  for (const design of designs) {
    let score = 0;
    for (const field of MATCH_FIELDS) {
      const wanted = selectedKurtiValue(details, field);
      if (wanted && same(design.attributes[field], wanted)) score += 1;
    }
    if (score === 0) continue;
    if (!best || score > best.score || (score === best.score && design.imageUrl < best.design.imageUrl)) {
      best = { design, score };
    }
  }
  return best?.design ?? null;
}

export function isKurtiOptionAvailable(
  designs: KurtiCatalogueDesign[],
  details: GarmentCustomizationDetails,
  field: KurtiMatchField,
  option: string
) {
  if (designs.length === 0) return true;
  return designs.some((design) =>
    MATCH_FIELDS.every((key) => {
      const selected = key === field ? option : selectedKurtiValue(details, key);
      if (!selected) return true;
      return same(design.attributes[key], selected);
    })
  );
}
