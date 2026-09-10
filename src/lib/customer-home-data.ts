export const CITIES = ['Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi'] as const;

export const MAIN_NAV = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Categories', href: '/categories' },
  { label: 'Tailors', href: '/tailors' },
  { label: 'My Designs', href: '/my-designs' },
  { label: 'My Orders', href: '/my-orders' },
] as const;

export const PROFILE_MENU = [
  { label: 'My Profile', href: '/profile' },
  { label: 'My Measurements', href: '/my-measurements' },
  { label: 'Saved Addresses', href: '/saved-addresses' },
  { label: 'Payment Methods', href: '/payment-methods' },
  { label: 'Settings', href: '/settings' },
  { label: 'Help & Support', href: '/help' },
  { label: 'About THY', href: '/about' },
] as const;

export const AUTH_PATHS = [
  '/my-designs',
  '/my-orders',
  '/my-measurements',
  '/profile',
  '/saved-addresses',
  '/payment-methods',
  '/settings',
  '/notifications',
] as const;

export interface GarmentCategory {
  id: string;
  title: string;
  image: string;
}

export const GARMENT_CATEGORIES: GarmentCategory[] = [
  { id: 'sarees', title: 'Sarees', image: '/hero/fabric-charcoal.png' },
  { id: 'salwars', title: 'Salwars & Suits', image: '/hero/fabric-beige.png' },
  { id: 'sherwanis', title: 'Sherwanis', image: '/hero/fabric-olive.png' },
  { id: 'lehengas', title: 'Lehengas', image: '/hero/hero-couple.png' },
];

export interface CatalogDesign {
  id: string;
  title: string;
  categoryId: string;
  image: string;
  popular: boolean;
  trending: boolean;
}

export const DESIGNS: CatalogDesign[] = [
  { id: 'd1', title: 'Kanjeevaram border drape', categoryId: 'sarees', image: '/hero/fabric-charcoal.png', popular: true, trending: true },
  { id: 'd2', title: 'Festive anarkali', categoryId: 'salwars', image: '/hero/fabric-beige.png', popular: true, trending: false },
  { id: 'd3', title: 'Olive bandhgala', categoryId: 'sherwanis', image: '/hero/fabric-olive.png', popular: true, trending: true },
  { id: 'd4', title: 'Reception lehenga', categoryId: 'lehengas', image: '/hero/hero-couple.png', popular: false, trending: true },
  { id: 'd5', title: 'Zari silk saree', categoryId: 'sarees', image: '/hero/hero-street.png', popular: true, trending: false },
  { id: 'd6', title: 'Everyday salwar', categoryId: 'salwars', image: '/hero/fabric-beige.png', popular: false, trending: true },
];

export interface DirectoryTailor {
  id: string;
  name: string;
  studio: string;
  city: string;
  specialty: string;
  image: string;
}

export const TAILORS: DirectoryTailor[] = [
  { id: 't1', name: 'Meera Krishnan', studio: 'Atelier Meera', city: 'Chennai', specialty: 'Kanjeevaram sarees', image: '/hero/hero-couple.png' },
  { id: 't2', name: 'Arjun Desai', studio: 'Desai House', city: 'Mumbai', specialty: 'Sherwanis & bandhgala', image: '/hero/fabric-olive.png' },
  { id: 't3', name: 'Farah Qureshi', studio: 'Noor Studio', city: 'Hyderabad', specialty: 'Bridal lehengas', image: '/hero/fabric-beige.png' },
  { id: 't4', name: 'Sana Iyer', studio: 'Thread & Gold', city: 'Bengaluru', specialty: 'Salwars & suits', image: '/hero/fabric-charcoal.png' },
];

export const HERO_VIDEOS = [
  { id: 'video-1', poster: '/hero/hero-couple.png', label: 'Video 1' },
  { id: 'video-2', poster: '/hero/hero-street.png', label: 'Video 2' },
] as const;

export const NOTIFICATION_STATES = [
  { id: 'n1', type: 'New quotation', detail: 'A tailor sent a quotation update.' },
  { id: 'n2', type: 'Order update', detail: 'Your order status was updated.' },
  { id: 'n3', type: 'Tailor response', detail: 'A tailor replied to your request.' },
  { id: 'n4', type: 'Payment / order status', detail: 'Payment or order status changed.' },
] as const;

export function designsByCategory(categoryId: string): CatalogDesign[] {
  return DESIGNS.filter((design) => design.categoryId === categoryId);
}

export function searchCatalog(query: string): { designs: CatalogDesign[]; tailors: DirectoryTailor[] } {
  const q = query.trim().toLowerCase();
  if (!q) return { designs: [], tailors: [] };
  return {
    designs: DESIGNS.filter((design) => design.title.toLowerCase().includes(q) || design.categoryId.includes(q)),
    tailors: TAILORS.filter((tailor) =>
      tailor.name.toLowerCase().includes(q) ||
      tailor.studio.toLowerCase().includes(q) ||
      tailor.specialty.toLowerCase().includes(q) ||
      tailor.city.toLowerCase().includes(q)
    ),
  };
}
