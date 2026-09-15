export type GeoCoords = { lat: number; lng: number };

export const CITY_COORDS: Record<string, GeoCoords> = {
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 },
};

const CITY_ALIASES: Record<string, string> = {
  chennai: 'Chennai',
  madras: 'Chennai',
  bengaluru: 'Bengaluru',
  bangalore: 'Bengaluru',
  hyderabad: 'Hyderabad',
  mumbai: 'Mumbai',
  bombay: 'Mumbai',
  delhi: 'Delhi',
  'new delhi': 'Delhi',
  'nct': 'Delhi',
};

export const NEAR_ME_RADIUS_KM = 80;

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

export function haversineKm(from: GeoCoords, to: GeoCoords) {
  const earthKm = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthKm * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function matchKnownCity(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const key = value?.trim().toLowerCase();
    if (key && CITY_ALIASES[key]) return CITY_ALIASES[key];
  }
  return null;
}

export function nearestCity(coords: GeoCoords) {
  return Object.entries(CITY_COORDS)
    .map(([city, point]) => ({ city, km: haversineKm(coords, point) }))
    .sort((a, b) => a.km - b.km)[0];
}

export function coordsForCity(city: string): GeoCoords | null {
  return CITY_COORDS[city] ?? null;
}

export function cityFromLocation(label: string | null | undefined, coords: GeoCoords | null | undefined) {
  if (label) {
    const exact = matchKnownCity(label);
    if (exact) return exact;
    const lower = label.toLowerCase();
    for (const city of Object.keys(CITY_COORDS)) {
      if (lower.includes(city.toLowerCase())) return city;
    }
    for (const [alias, city] of Object.entries(CITY_ALIASES)) {
      if (alias.length > 2 && lower.includes(alias)) return city;
    }
  }
  if (coords) return nearestCity(coords).city;
  return null;
}

export function distanceToCity(from: GeoCoords, city: string) {
  const point = CITY_COORDS[city];
  if (!point) return null;
  return haversineKm(from, point);
}

export function isWithinNearMe(from: GeoCoords, city: string, radiusKm = NEAR_ME_RADIUS_KM) {
  const km = distanceToCity(from, city);
  return km != null && km <= radiusKm;
}

export function parseCoords(value: unknown): GeoCoords | null {
  if (!value || typeof value !== 'object') return null;
  const lat = Number((value as { lat?: unknown }).lat);
  const lng = Number((value as { lng?: unknown }).lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

export function formatDistanceKm(km: number) {
  if (km < 1) return 'Under 1 km';
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export function readBrowserPosition(): Promise<GeoCoords> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Location is not available on this device.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error('Location permission was denied.'));
          return;
        }
        reject(new Error('Could not read your location.'));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 5 * 60 * 1000 }
    );
  });
}

export async function reverseGeocode(coords: GeoCoords): Promise<{ label: string; city: string }> {
  const fallback = nearestCity(coords);
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.lat}&longitude=${coords.lng}&localityLanguage=en`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('geocode failed');
    const data = (await response.json()) as {
      city?: string;
      locality?: string;
      principalSubdivision?: string;
    };
    const city =
      matchKnownCity(data.city, data.locality, data.principalSubdivision) ?? fallback.city;
    const locality = data.locality?.trim() || data.city?.trim();
    const label =
      locality && city && !locality.toLowerCase().includes(city.toLowerCase())
        ? `${locality}, ${city}`
        : city;
    return { label, city };
  } catch {
    return { label: fallback.city, city: fallback.city };
  }
}
