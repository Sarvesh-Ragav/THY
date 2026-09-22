import type {
  AccountCustomerProfile,
  AccountTailorProfile,
  AuthenticatedUser,
} from '@/lib/auth-api';

export type UserRole = 'tailor' | 'customer' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type RequestStatus = 'Pending Quotation' | 'Quotation Submitted' | 'Declined';
export type OrderStatus = 'In Progress' | 'Fitting Scheduled' | 'Ready to Stitch/Deliver' | 'Completed';
export type StudioNotificationType = 'order' | 'quotation' | 'chat' | 'pickup' | 'delivery' | 'request' | 'message' | 'payout' | 'system';

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
  city?: string;
}

export interface TailorPortfolioSave {
  id: string;
  title: string;
  image: string;
  category: string;
  isFeatured?: boolean;
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

export interface DayHours {
  day: WorkingDay;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface TailorAvailability {
  isAvailable: boolean;
  vacationMode: boolean;
  workingDays: Record<WorkingDay, boolean>;
  maxActiveCapacity: number;
  schedule: DayHours[];
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
  category?: string;
  requestDate?: string;
  fabricProvided: string;
  fabricDetails?: string;
  measurements: string;
  requirements: string;
  budgetEstimate?: string;
  designPreview?: string;
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
  orderedDate?: string;
  price?: number;
  currentStage?: number;
  specialNotes?: string;
  designPreview?: string;
}

export interface StudioNotification {
  id: string;
  type: StudioNotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  linkUrl?: string;
}

export interface StudioPayout {
  id: string;
  orderId: string;
  customerName: string;
  garmentType: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending';
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

export interface CustomerOrderTimeline {
  title: string;
  time: string;
  completed: boolean;
  active?: boolean;
}

export interface CustomerOrderSave {
  id: string;
  title: string;
  status: string;
  tailorName?: string;
  location?: string;
  date?: string;
  total?: number;
  paymentMode?: string;
  deliveryAddress?: string;
  fabric?: string;
  currentStage?: number;
  currentStageText?: string;
  pickupSlot?: string;
  timeline?: CustomerOrderTimeline[];
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
  tailorPortfolio: TailorPortfolioSave[];
  customerDesigns: CustomerDesignSave[];
  customerOrders: CustomerOrderSave[];
  customerNotifications: StudioNotification[];
  availability: TailorAvailability;
  requests: TailorOrderRequest[];
  orders: TailorActiveOrder[];
  notifications: StudioNotification[];
  payouts: StudioPayout[];
  studioBootstrapped: boolean;
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

export const DEFAULT_SCHEDULE: DayHours[] = WORKING_DAYS.map((day) => ({
  day,
  isOpen: day !== 'Sunday',
  openTime: day === 'Saturday' ? '10:00' : '09:00',
  closeTime: day === 'Saturday' ? '17:00' : '19:00',
}));

export const DEFAULT_AVAILABILITY: TailorAvailability = {
  isAvailable: true,
  vacationMode: false,
  workingDays: DEFAULT_WORKING_DAYS,
  maxActiveCapacity: 10,
  schedule: DEFAULT_SCHEDULE,
};

export const DEFAULT_REQUESTS: TailorOrderRequest[] = [
  {
    id: 'REQ-101',
    customerName: 'Ananya Sharma',
    garmentType: 'Custom Designer Anarkali',
    category: 'Ethnicwear',
    requestDate: '2026-09-12',
    fabricProvided: 'Yes (Silk & Net)',
    fabricDetails: 'Silk and net provided by the customer',
    measurements: 'Bust: 34", Waist: 28", Length: 52"',
    requirements: 'Double inner lining, subtle gold piping on neck.',
    budgetEstimate: '₹8,000 - ₹12,000',
    designPreview: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop',
    status: 'Pending Quotation',
  },
  {
    id: 'REQ-102',
    customerName: 'Rohan Gupta',
    garmentType: '3-Piece Slim Fit Suit',
    category: 'Formalwear',
    requestDate: '2026-09-13',
    fabricProvided: 'No (Tailor to source Raymond Wool)',
    fabricDetails: 'Tailor to source Raymond wool',
    measurements: 'Chest: 40", Waist: 32", Shoulder: 18"',
    requirements: 'Satin lapel, double vent back, tapered trousers.',
    budgetEstimate: '₹10,000 - ₹14,000',
    designPreview: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&auto=format&fit=crop',
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
    orderedDate: '10 Sep 2026',
    price: 4500,
    currentStage: 3,
    specialNotes: 'Gold zardozi piping. Extra 1.5 inch waist margin.',
    designPreview: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ORD-8095',
    customerName: 'Vikram Mehta',
    garmentType: 'Tuxedo Jacket & Trousers',
    status: 'Fitting Scheduled',
    expectedCompletion: '2026-09-14',
    fabricDetails: 'Italian Wool',
    measurements: 'Custom Fitted',
    orderedDate: '08 Sep 2026',
    price: 6200,
    currentStage: 2,
    specialNotes: 'Satin lapel, double vent, tapered trousers.',
    designPreview: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ORD-8080',
    customerName: 'Saritha N.',
    garmentType: 'Designer Salwar Set',
    status: 'Completed',
    expectedCompletion: '2026-09-03',
    fabricDetails: 'Cotton silk',
    measurements: 'Bust 36", Waist 30"',
    orderedDate: '22 Aug 2026',
    price: 2100,
    currentStage: 5,
    specialNotes: 'Delivered on time.',
    designPreview: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
  },
];

export const DEFAULT_NOTIFICATIONS: StudioNotification[] = [
  {
    id: 'notif-req-101',
    type: 'order',
    title: 'New estimate request',
    description: 'Ananya Sharma submitted a request for a custom designer Anarkali.',
    timestamp: 'Today',
    isRead: false,
    linkUrl: '/tailor-dashboard/new-requests',
  },
  {
    id: 'notif-req-102',
    type: 'order',
    title: 'New estimate request',
    description: 'Rohan Gupta requested a 3-piece slim fit suit.',
    timestamp: 'Today',
    isRead: false,
    linkUrl: '/tailor-dashboard/new-requests',
  },
  {
    id: 'notif-payout-8080',
    type: 'payout',
    title: 'Payout pending',
    description: '₹1,890 net payout for ORD-8080 is ready after delivery.',
    timestamp: 'Yesterday',
    isRead: true,
    linkUrl: '/tailor-dashboard/earnings',
  },
];

export const DEFAULT_PAYOUTS: StudioPayout[] = [
  {
    id: 'TXN-8080',
    orderId: 'ORD-8080',
    customerName: 'Saritha N.',
    garmentType: 'Designer Salwar Set',
    date: '03 Sep 2026',
    amount: 2100,
    status: 'Paid',
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
    tailorPortfolio: [],
    customerDesigns: [],
    customerOrders: [],
    customerNotifications: [],
    availability: {
      ...DEFAULT_AVAILABILITY,
      workingDays: { ...DEFAULT_WORKING_DAYS },
      schedule: DEFAULT_SCHEDULE.map((day) => ({ ...day })),
    },
    requests: [],
    orders: [],
    notifications: [],
    payouts: [],
    studioBootstrapped: false,
  };
}

export function hasTailorProfile(session: TailorSession): boolean {
  return Boolean(session.profile?.fullName && session.profile.phone && session.profile.shopName);
}

export function hasSubmittedVerification(session: TailorSession): boolean {
  const status = session.verification?.status;
  return Boolean(
    session.verification?.idNumber ||
      session.verification?.documentName ||
      status === 'pending' ||
      status === 'approved' ||
      status === 'rejected'
  );
}

export function isTailorVerified(session: TailorSession): boolean {
  return session.verification?.status === 'approved';
}

export function isTailorOnboardingComplete(session: TailorSession): boolean {
  return hasTailorProfile(session);
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
  // Preferences are collected once during signup, not required again on login.
  return hasCustomerProfile(session);
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
  if (session.role === 'admin') return '/admin';

  if (session.role === 'customer') {
    if (!hasCustomerProfile(session)) return '/customer-registration';
    return '/';
  }

  // Tailor Onboarding Route Guard Logic
  if (!hasTailorProfile(session)) return '/tailor-registration';
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

export function getAccountDisplayName(session: TailorSession): string {
  if (session.role === 'tailor') {
    return session.profile?.fullName || session.profile?.shopName || 'Tailor Account';
  }
  return session.customerProfile?.fullName || 'Account';
}

export function applyAccountToSession(
  current: TailorSession,
  user: AuthenticatedUser,
  customerProfile?: AccountCustomerProfile | null,
  tailorProfile?: AccountTailorProfile | null,
  sessionPatch?: Partial<TailorSession>
): TailorSession {
  const merged: TailorSession = { ...current, ...sessionPatch };
  const identifier =
    sessionPatch?.identifier ||
    user.email ||
    user.phoneNumber ||
    merged.identifier ||
    current.identifier;
  const role = (sessionPatch?.role ?? user.role ?? merged.role ?? current.role) as UserRole | null;

  const nextCustomer =
    sessionPatch?.customerProfile ??
    (customerProfile
      ? {
          fullName: customerProfile.fullName || user.name || current.customerProfile?.fullName || '',
          phone: customerProfile.phone || user.phoneNumber || current.customerProfile?.phone || '',
          email: customerProfile.email || user.email || current.customerProfile?.email || '',
          city: customerProfile.city || current.customerProfile?.city || '',
          address: customerProfile.address || current.customerProfile?.address || '',
        }
      : current.customerProfile
        ? {
            ...current.customerProfile,
            fullName: current.customerProfile.fullName || user.name || '',
            phone: current.customerProfile.phone || user.phoneNumber || '',
            email: current.customerProfile.email || user.email || '',
          }
        : role === 'customer'
          ? {
              fullName: user.name || '',
              phone: user.phoneNumber || '',
              email: user.email || '',
              city: '',
              address: '',
            }
          : current.customerProfile);

  const prefsFromServer = customerProfile?.preferences;
  const nextPreferences =
    sessionPatch?.customerPreferences ??
    (prefsFromServer?.shoppingFor &&
    prefsFromServer.contactMethod &&
    Array.isArray(prefsFromServer.services) &&
    prefsFromServer.services.length
      ? {
          shoppingFor: prefsFromServer.shoppingFor as CustomerShoppingFor,
          contactMethod: prefsFromServer.contactMethod as CustomerContactMethod,
          services: prefsFromServer.services as CustomerService[],
          garmentTypes: (prefsFromServer.garmentTypes || []) as CustomerGarmentType[],
        }
      : current.customerPreferences);

  const nextTailor =
    sessionPatch?.profile ??
    (tailorProfile
      ? {
          fullName: tailorProfile.fullName || user.name || current.profile?.fullName || '',
          phone: tailorProfile.phone || user.phoneNumber || current.profile?.phone || '',
          shopName: tailorProfile.shopName,
          yearsOfExperience: tailorProfile.yearsOfExperience,
          shopAddress: tailorProfile.shopAddress,
          city: tailorProfile.city || current.profile?.city,
        }
      : current.profile);

  const nextPortfolio =
    sessionPatch?.tailorPortfolio ??
    (tailorProfile?.portfolio?.length ? tailorProfile.portfolio : current.tailorPortfolio ?? []);

  const nextVerification =
    sessionPatch?.verification ??
    (tailorProfile?.verification?.submitted
      ? {
          idType: tailorProfile.verification.idType || current.verification?.idType || 'Government ID',
          idNumber: current.verification?.idNumber || 'on-file',
          documentName:
            tailorProfile.verification.documentName ||
            current.verification?.documentName ||
            'Identity proof',
          status: (tailorProfile.verification.status as VerificationStatus) || 'pending',
        }
      : current.verification);

  return {
    ...merged,
    isAuthenticated: true,
    hasPassword: Boolean(sessionPatch?.hasPassword ?? user.hasPassword ?? current.hasPassword),
    role,
    identifier,
    customerProfile: nextCustomer,
    customerPreferences: nextPreferences,
    profile: nextTailor,
    tailorPortfolio: nextPortfolio,
    verification: nextVerification,
    selectedLocation:
      merged.selectedLocation ||
      customerProfile?.city ||
      tailorProfile?.city ||
      current.selectedLocation,
  };
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
        schedule:
          Array.isArray(parsed.availability?.schedule) && parsed.availability.schedule.length
            ? parsed.availability.schedule
            : fallback.availability.schedule,
        maxActiveCapacity: parsed.availability?.maxActiveCapacity ?? fallback.availability.maxActiveCapacity,
      },
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
      payouts: Array.isArray(parsed.payouts) ? parsed.payouts : [],
      studioBootstrapped: Boolean(parsed.studioBootstrapped),
      profile: parsed.profile ?? null,
      verification: parsed.verification ?? null,
      customerProfile: parsed.customerProfile ?? null,
      customerPreferences: parsed.customerPreferences ?? null,
      selectedLocation: parsed.selectedLocation ?? null,
      locationCoords: parseStoredCoords(parsed.locationCoords),
      hasPassword: Boolean(parsed.hasPassword),
      tailorPortfolio: Array.isArray(parsed.tailorPortfolio) ? parsed.tailorPortfolio : [],
      customerDesigns: Array.isArray(parsed.customerDesigns) ? parsed.customerDesigns : [],
      customerOrders: Array.isArray(parsed.customerOrders) ? parsed.customerOrders : [],
      customerNotifications: Array.isArray(parsed.customerNotifications) ? parsed.customerNotifications : [],
    };
  } catch {
    return fallback;
  }
}

export function persistTailorSession(session: TailorSession): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(TAILOR_SESSION_KEY, JSON.stringify(session));
  } catch {
    try {
      const compact: TailorSession = {
        ...session,
        customerDesigns: session.customerDesigns.map((design) => ({
          ...design,
          fabricImage:
            design.fabricImage && design.fabricImage.startsWith('data:')
              ? undefined
              : design.fabricImage,
          patternImage:
            design.patternImage && design.patternImage.startsWith('data:')
              ? undefined
              : design.patternImage,
        })),
      };
      window.localStorage.setItem(TAILOR_SESSION_KEY, JSON.stringify(compact));
    } catch {
      // localStorage quota exceeded; keep the in-memory session.
    }
  }
}