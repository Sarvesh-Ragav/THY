import type { SavedMeasurement } from '@/lib/c31';
import type { SavedCustomerMeasurement } from '@/lib/chat-api';

export function formatMeasurementDetails(
  values: Record<string, unknown> | undefined,
  unit = 'in'
): string {
  if (!values) return '';
  return Object.entries(values)
    .filter(([, value]) => value !== '' && value != null)
    .map(([key, value]) => `${key} ${value} ${unit}`)
    .join(' · ');
}

export function valuesFromRecord(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object') return {};
  const entries = raw instanceof Map ? Array.from(raw.entries()) : Object.entries(raw as Record<string, unknown>);
  return Object.fromEntries(entries.map(([key, value]) => [key, String(value)]));
}

export function toSavedMeasurement(item: SavedCustomerMeasurement): SavedMeasurement {
  const values = valuesFromRecord(item.values);
  return {
    id: item.id || item._id,
    label: item.label,
    details: formatMeasurementDetails(values, item.unit === 'inch' ? 'in' : item.unit || 'in'),
    values,
  };
}

export function toShareableMeasurement(item: SavedMeasurement): SavedCustomerMeasurement {
  return {
    _id: item.id,
    id: item.id,
    label: item.label,
    category: 'general',
    values: item.values ?? {},
    unit: 'inch',
  };
}

export function measurementCategoryForGarment(categoryId?: string | null): SavedCustomerMeasurement['category'] {
  const id = (categoryId ?? '').toLowerCase();
  if (id.includes('saree')) return 'sarees';
  if (id.includes('lehenga')) return 'lehengas';
  if (id.includes('sherwani') || id.includes('kurta') || id.includes('blazer') || id.includes('suit')) return 'sherwanis';
  if (id.includes('salwar') || id.includes('kurti') || id.includes('anarkali')) return 'salwars';
  return 'general';
}

export function mergeSavedMeasurements(
  local: SavedMeasurement[],
  remote: SavedMeasurement[]
): SavedMeasurement[] {
  const byId = new Map<string, SavedMeasurement>();
  for (const item of [...remote, ...local]) {
    if (!item.id) continue;
    const existing = byId.get(item.id);
    byId.set(item.id, {
      ...existing,
      ...item,
      values: item.values ?? existing?.values,
    });
  }
  return Array.from(byId.values());
}
