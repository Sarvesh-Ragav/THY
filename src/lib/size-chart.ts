export const SIZE_CHART = [
  { size: 'XS', brandSize: 'XS', bust: 32, waist: 26, hips: 35 },
  { size: 'S', brandSize: 'S', bust: 34, waist: 28, hips: 37 },
  { size: 'M', brandSize: 'M', bust: 36, waist: 30, hips: 39 },
  { size: 'L', brandSize: 'L', bust: 38, waist: 32, hips: 41 },
  { size: 'XL', brandSize: 'XL', bust: 40, waist: 34, hips: 43 },
  { size: 'XXL', brandSize: 'XXL', bust: 42, waist: 36, hips: 45 },
  { size: '3XL', brandSize: '3XL', bust: 44, waist: 38, hips: 47 },
  { size: '4XL', brandSize: '4XL', bust: 46, waist: 40, hips: 49 },
  { size: '5XL', brandSize: '5XL', bust: 48, waist: 42, hips: 51 },
  { size: '6XL', brandSize: '6XL', bust: 51, waist: 45, hips: 53 },
  { size: '7XL', brandSize: '7XL', bust: 54, waist: 48, hips: 55 },
] as const;

export type ChartSize = (typeof SIZE_CHART)[number]['size'];
export type SizeUnit = 'in' | 'cm';

export function getSizeRow(size: string) {
  return SIZE_CHART.find((row) => row.size === size) ?? SIZE_CHART[2];
}

export function toSizeUnit(value: number, unit: SizeUnit) {
  return unit === 'cm' ? Math.round(value * 2.54) : value;
}

export function formatSizeMeasurements(size: string, unit: SizeUnit = 'in') {
  const row = getSizeRow(size);
  const suffix = unit === 'cm' ? 'cm' : '"';
  return `Bust ${toSizeUnit(row.bust, unit)}${suffix} · Waist ${toSizeUnit(row.waist, unit)}${suffix} · Hips ${toSizeUnit(row.hips, unit)}${suffix}`;
}
