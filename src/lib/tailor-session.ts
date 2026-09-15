export type UserRole = 'tailor' | 'customer' | 'admin';
export type VerificationStatus = 'pending';
export type RequestStatus = 'Pending Quotation' | 'Quotation Submitted';
export type OrderStatus = 'In Progress' | 'Fitting Scheduled' | 'Ready to Stitch/Deliver';

export const WORKING_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export type WorkingDay = (typeof WORKING_DAYS)[number];

export interface TailorProfile {
  fullName: string;
  phone: string;
  shopName: string;
  yearsOfExperience: string;
  shopAddress: string;
}

export const CUSTOMER_SERVICES = ['Stitching', 'Alterations', 'Custom outfits'] as const;
export const CUSTOMER_GARMENT_TYPES = ['Ethnic wear', 'Western wear', 'Formal wear', 'Kids wear'] as const;
export const CUSTOMER_SHOPPING_FOR = ['Myself', 'Family', 'Both'] as const;
export const CUSTOMER_CONTACT_METHODS = ['Phone', 'WhatsApp', 'Email'] as const;

export type CustomerService = (typeof CUSTOMER_SERVICES)[number];
export type CustomerGarmentType = (typeof CUSTOMER_GARMENT_TYPES)[number];
export type CustomerShoppingFor = (typeof CUSTOMER_SHOPPING_FOR)[number];
export type CustomerContactMethod = (typeof CUSTOMER_CONTACT_METHODS)[number];

export interface CustomerProfile {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
}

export interface CustomerPreferences {
  shoppingFor: CustomerShoppingFor;
  contactMethod: CustomerContactMethod;
  services: CustomerService[];
  garmentTypes: CustomerGarmentType[];
}

export interface TailorVerification {
  idType: string;
  idNumber: string;
  documentName: string;
  status: VerificationStatus;
}

export interface TailorAvailability {
  isAvailable: boolean;
  vacationMode: boolean;
  workingDays: Record<WorkingDay, boolean>;
}

export interface TailorQuote {
  price: string;
  estimatedDays: string;
  notes: string;
}

export interface TailorOrderRequest {
  id: string;
  customerName: string;
  garmentType: string;
  fabricProvided: string;
  measurements: string;
  requirements: string;
  status: RequestStatus;
  quote?: TailorQuote;
}

export interface TailorActiveOrder {
  id: string;
  customerName: string;
  garmentType: string;
  status: OrderStatus;
  expectedCompletion: string;
  fabricDetails: string;
  measurements: string;
}

export interface CustomerDesignSave {
  id: string;
  title: string;
  categoryId?: string;
  garment?: string;
  fabric?: string;
  treatments?: string[];
  fabricImage?: string;
  patternImage?: string;
  patternLabel?: string;
  favorite?: boolean;
  createdAt?: string;
}

export interface CustomerOrderSave {
  id: string;
  title: string;
  status: string;
}

export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface TailorSession {
  identifier: string;
  role: UserRole | null;
  isAuthenticated: boolean;
  hasPassword: boolean;
  profile: TailorProfile | null;
  verification: TailorVerification | null;
  customerProfile: CustomerProfile | null;
  customerPreferences: CustomerPreferences | null;
  selectedLocation: string | null;
  locationCoords: LocationCoords | null;
  customerDesigns: CustomerDesignSave[];
  customerOrders: CustomerOrderSave[];
  availability: TailorAvailability;
  requests: TailorOrderRequest[];
  orders: TailorActiveOrder[];
}

export const TAILOR_SESSION_KEY = 'thy-tailor-session';

export const DEFAULT_WORKING_DAYS: Record<WorkingDay, boolean> = {
  Monday: true,
  Tuesday: true,
  Wednesday: true,
  Thursday: true,
  Friday: true,
  Saturday: true,
  Sunday: false,
};

export const DEFAULT_AVAILABILITY: TailorAvailability = {
  isAvailable: true,
  vacationMode: false,
  workingDays: DEFAULT_WORKING_DAYS,
};

export const DEFAULT_REQUESTS: TailorOrderRequest[] = [
  {
    id: 'REQ-101',
    customerName: 'Ananya Sharma',
    garmentType: 'Custom Designer Anarkali',
    fabricProvided: 'Yes (Silk & Net)',
    measurements: 'Bust: 34", Waist: 28", Length: 52"',
    requirements: 'Double inner lining, subtle gold piping on neck.',
    status: 'Pending Quotation',
  },
  {
    id: 'REQ-102',
    customerName: 'Rohan Gupta',
    garmentType: '3-Piece Slim Fit Suit',
    fabricProvided: 'No (Tailor to source Raymond Wool)',
    measurements: 'Chest: 40", Waist: 32", Shoulder: 18"',
    requirements: 'Satin lapel, double vent back, tapered trousers.',
    status: 'Pending Quotation',
  },
];

export const DEFAULT_ORDERS: TailorActiveOrder[] = [
  {
    id: 'ORD-8091',
    customerName: 'Priya Verma',
    garmentType: 'Embroidered Lehenga Choli',
    status: 'In Progress',
    expectedCompletion: '2026-09-18',
    fabricDetails: 'Velvet & Raw Silk',
    measurements: 'Standard Size M (Customized Waist)',
  },
  {
    id: 'ORD-8095',
    customerName: 'Vikram Mehta',
    garmentType: 'Tuxedo Jacket & Trousers',
    status: 'Fitting Scheduled',
    expectedCompletion: '2026-09-14',
    fabricDetails: 'Italian Wool',
    measurements: 'Custom Fitted',
  },
];

// STEP 1 INTEGRATION: Clean default unauthenticated state
export function createDefaultSession(): TailorSession {
  return {
    identifier: '',
    role: null,
    isAuthenticated: false,
    hasPassword: false,
    profile: null,
    verification: null,
    customerProfile: null,
    customerPreferences: null,
    selectedLocation: null,
    locationCoords: null,
    customerDesigns: [],
    customerOrders: [],
    availability: {
      ...DEFAULT_AVAILABILITY,
      workingDays: { ...DEFAULT_WORKING_DAYS },
    },
    requests: [],
    orders: [],
  };
}

export function hasTailorProfile(session: TailorSession): boolean {
  return Boolean(session.profile?.fullName && session.profile.phone && session.profile.shopName);
}

export function hasSubmittedVerification(session: TailorSession): boolean {
  return Boolean(session.verification?.idNumber);
}

export function isTailorOnboardingComplete(session: TailorSession): boolean {
  return hasTailorProfile(session) && hasSubmittedVerification(session);
}

export function hasCustomerProfile(session: TailorSession): boolean {
  return Boolean(
    session.customerProfile?.fullName &&
    session.customerProfile.phone &&
    session.customerProfile.email &&
    session.customerProfile.city &&
    session.customerProfile.address
  );
}

export function hasCustomerPreferences(session: TailorSession): boolean {
  return Boolean(
    session.customerPreferences?.shoppingFor &&
    session.customerPreferences.contactMethod &&
    session.customerPreferences.services.length
  );
}

export function isCustomerOnboardingComplete(session: TailorSession): boolean {
  return hasCustomerProfile(session) && hasCustomerPreferences(session);
}

export function hasCustomerActivity(session: TailorSession): boolean {
  return session.customerDesigns.length > 0 || session.customerOrders.length > 0;
}

export function getCustomerFirstName(session: TailorSession): string {
  const fullName = session.customerProfile?.fullName?.trim();
  if (!fullName) return 'there';
  return fullName.split(/\s+/)[0];
}

// STEP 2 INTEGRATION: Accurate Post-Auth Path evaluation
export function getPostAuthPath(session: TailorSession): string {
  if (session.role === 'customer') {
    if (!hasCustomerProfile(session)) return '/customer-registration';
    if (!hasCustomerPreferences(session)) return '/customer-preferences';
    return '/';
  }

  // Tailor Onboarding Route Guard Logic
  if (!hasTailorProfile(session)) return '/tailor-registration';
  if (!hasSubmittedVerification(session)) return '/tailor-verification';
  return '/tailor-dashboard';
}

export function getPendingRequestCount(session: TailorSession): number {
  return session.requests.filter((request) => request.status === 'Pending Quotation').length;
}

export function isStudioReceivingOrders(session: TailorSession): boolean {
  return session.availability.isAvailable && !session.availability.vacationMode;
}

export function getTailorFirstName(session: TailorSession): string {
  const fullName = session.profile?.fullName?.trim();
  if (!fullName) return 'Tailor';
  return fullName.split(/\s+/)[0];
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function parseStoredCoords(value: unknown): LocationCoords | null {
  if (!value || typeof value !== 'object') return null;
  const lat = Number((value as { lat?: unknown }).lat);
  const lng = Number((value as { lng?: unknown }).lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

export function loadTailorSession(): TailorSession {
  const fallback = createDefaultSession();
  if (!isBrowser()) return fallback;

  try {
    const raw = window.localStorage.getItem(TAILOR_SESSION_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as Partial<TailorSession>;
    return {
      ...fallback,
      ...parsed,
      availability: {
        ...fallback.availability,
        ...parsed.availability,
        workingDays: {
          ...fallback.availability.workingDays,
          ...parsed.availability?.workingDays,
        },
      },
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      profile: parsed.profile ?? null,
      verification: parsed.verification ?? null,
      customerProfile: parsed.customerProfile ?? null,
      customerPreferences: parsed.customerPreferences ?? null,
      selectedLocation: parsed.selectedLocation ?? null,
      locationCoords: parseStoredCoords(parsed.locationCoords),
      hasPassword: Boolean(parsed.hasPassword),
      customerDesigns: Array.isArray(parsed.customerDesigns) ? parsed.customerDesigns : [],
      customerOrders: Array.isArray(parsed.customerOrders) ? parsed.customerOrders : [],
    };
  } catch {
    return fallback;
  }
}

export function persistTailorSession(session: TailorSession): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(TAILOR_SESSION_KEY, JSON.stringify(session));
}