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
  '/chat',
  '/estimate-details',
  '/checkout/address',
  '/checkout/summary',
  '/checkout/payment',
  '/checkout/confirmation',
  '/stitch-your-outfit/cart',
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

export type TailorAvailability = 'accepting' | 'limited' | 'waitlist';

export interface TailorExperience {
  title: string;
  studio: string;
  years: string;
  summary: string;
}

export interface TailorReview {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface DirectoryTailor {
  id: string;
  name: string;
  studio: string;
  city: string;
  specialty: string;
  image: string;
  headline: string;
  about: string;
  state: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  ordersCompleted: number;
  availability: TailorAvailability;
  skills: string[];
  languages: string[];
  coverImage: string;
  experience: TailorExperience[];
  reviews: TailorReview[];
  portfolio: string[];
}

export const TAILOR_AVAILABILITY_LABELS: Record<TailorAvailability, string> = {
  accepting: 'Accepting orders',
  limited: 'Limited slots',
  waitlist: 'Waitlist',
};

export const TAILORS: DirectoryTailor[] = [
  {
    id: 't1',
    name: 'Meera Krishnan',
    studio: 'Atelier Meera',
    city: 'Chennai',
    state: 'Tamil Nadu',
    specialty: 'Kanjeevaram sarees',
    image: '/hero/hero-couple.png',
    coverImage: '/hero/fabric-charcoal.png',
    headline: 'Master weaver & Kanjeevaram specialist · Bridal and heritage drape',
    about:
      'I work with families across generations on Kanjeevaram sarees, temple borders, and heirloom restorations. Remote orders include a fabric consult, motif placement, and a measured blouse finish.',
    verified: true,
    rating: 4.9,
    reviewCount: 128,
    yearsExperience: 14,
    ordersCompleted: 640,
    availability: 'accepting',
    skills: ['Kanjeevaram', 'Blouse stitching', 'Zari work', 'Heritage restoration'],
    languages: ['Tamil', 'English', 'Hindi'],
    experience: [
      { title: 'Principal tailor', studio: 'Atelier Meera', years: '2016 — Present', summary: 'Bespoke Kanjeevaram drapes and bridal blouses for remote and in-studio clients.' },
      { title: 'Senior stitch lead', studio: 'Kanchipuram Loom House', years: '2011 — 2016', summary: 'Led finishing and blouse teams for temple-border silks.' },
    ],
    reviews: [
      { author: 'Ananya S.', rating: 5, text: 'The blouse sat perfectly. Meera checked every measurement before cutting.', date: 'Aug 2026' },
      { author: 'Lakshmi R.', rating: 5, text: 'Treated our family silk with so much care. Delivery was on time.', date: 'Jun 2026' },
    ],
    portfolio: ['/hero/hero-couple.png', '/hero/fabric-charcoal.png', '/hero/fabric-beige.png'],
  },
  {
    id: 't2',
    name: 'Arjun Desai',
    studio: 'Desai House',
    city: 'Mumbai',
    state: 'Maharashtra',
    specialty: 'Sherwanis & bandhgala',
    image: '/hero/fabric-olive.png',
    coverImage: '/hero/fabric-olive.png',
    headline: 'Menswear tailor · Sherwanis, bandhgala, and occasion suits',
    about:
      'Structured ethnic menswear with a clean shoulder and a sharp bandhgala line. I tailor for weddings, receptions, and groomsmen sets, including outstation fittings from photos and measurement cards.',
    verified: true,
    rating: 4.8,
    reviewCount: 96,
    yearsExperience: 11,
    ordersCompleted: 410,
    availability: 'limited',
    skills: ['Sherwani', 'Bandhgala', 'Indo-western', 'Alterations'],
    languages: ['Hindi', 'English', 'Gujarati'],
    experience: [
      { title: 'Founder', studio: 'Desai House', years: '2018 — Present', summary: 'Custom sherwanis and bandhgalas for wedding parties across India.' },
      { title: 'Menswear cutter', studio: 'Colaba Atelier', years: '2013 — 2018', summary: 'Pattern cutting for structured jackets and festive wear.' },
    ],
    reviews: [
      { author: 'Rahul M.', rating: 5, text: 'The bandhgala looked boardroom-sharp and still sat easy through the ceremony.', date: 'Jul 2026' },
      { author: 'Vikram P.', rating: 4, text: 'Great finish on the buttons and collar. Would book again for groomsmen.', date: 'May 2026' },
    ],
    portfolio: ['/hero/fabric-olive.png', '/hero/hero-street.png', '/hero/fabric-charcoal.png'],
  },
  {
    id: 't3',
    name: 'Farah Qureshi',
    studio: 'Noor Studio',
    city: 'Hyderabad',
    state: 'Telangana',
    specialty: 'Bridal lehengas',
    image: '/hero/fabric-beige.png',
    coverImage: '/hero/hero-couple.png',
    headline: 'Bridal couture tailor · Lehengas, reception gowns, and heavy embroidery',
    about:
      'I specialise in bridal lehengas with dense embroidery that still moves. Work includes can-can balance, blouse engineering, and lining that holds shape through a long wedding day.',
    verified: true,
    rating: 5,
    reviewCount: 74,
    yearsExperience: 9,
    ordersCompleted: 220,
    availability: 'waitlist',
    skills: ['Bridal lehenga', 'Hand embroidery', 'Gown finishing', 'Blouse engineering'],
    languages: ['Hindi', 'English', 'Urdu'],
    experience: [
      { title: 'Creative director', studio: 'Noor Studio', years: '2019 — Present', summary: 'Bridal commissions with embroidery houses in Hyderabad and Lucknow.' },
    ],
    reviews: [
      { author: 'Zara K.', rating: 5, text: 'The lehenga felt light even with the work. Farah understood the brief immediately.', date: 'Apr 2026' },
    ],
    portfolio: ['/hero/fabric-beige.png', '/hero/hero-couple.png', '/hero/fabric-olive.png'],
  },
  {
    id: 't4',
    name: 'Sana Iyer',
    studio: 'Thread & Gold',
    city: 'Bengaluru',
    state: 'Karnataka',
    specialty: 'Salwars & suits',
    image: '/hero/fabric-charcoal.png',
    coverImage: '/hero/fabric-beige.png',
    headline: 'Everyday ethnic wear · Kurtis, salwars, and office-ready suits',
    about:
      'Clean everyday stitching for kurtis, palazzos, and salwar suits. I keep a strong focus on wash-and-wear finishes, side slits, and measurements that stay true after the first wash.',
    verified: true,
    rating: 4.7,
    reviewCount: 152,
    yearsExperience: 8,
    ordersCompleted: 780,
    availability: 'accepting',
    skills: ['Kurti', 'Salwar suit', 'Palazzo', 'Everyday finishing'],
    languages: ['Kannada', 'English', 'Hindi'],
    experience: [
      { title: 'Studio lead', studio: 'Thread & Gold', years: '2020 — Present', summary: 'High-volume custom kurtis and suits for remote clients.' },
    ],
    reviews: [
      { author: 'Divya N.', rating: 5, text: 'My office kurtis finally sit at the right length. Fast turnaround.', date: 'Aug 2026' },
      { author: 'Priya T.', rating: 4, text: 'Neat seams and a good fit through the shoulder.', date: 'Mar 2026' },
    ],
    portfolio: ['/hero/fabric-charcoal.png', '/hero/fabric-beige.png', '/hero/hero-street.png'],
  },
  {
    id: 't5',
    name: 'Kabir Menon',
    studio: 'Cut & Grain',
    city: 'Delhi',
    state: 'Delhi',
    specialty: 'Sherwanis & bandhgala',
    image: '/hero/hero-street.png',
    coverImage: '/hero/fabric-olive.png',
    headline: 'North Indian menswear · Achkan, sherwani, and nehru jackets',
    about: 'I cut structured achkans and nehru jackets with a Delhi festive line. Remote grooms send a measurement card and a fabric drape; I return a muslin check before the final stitch.',
    verified: true,
    rating: 4.6,
    reviewCount: 61,
    yearsExperience: 10,
    ordersCompleted: 305,
    availability: 'accepting',
    skills: ['Achkan', 'Nehru jacket', 'Sherwani', 'Groom styling'],
    languages: ['Hindi', 'English', 'Punjabi'],
    experience: [
      { title: 'Head cutter', studio: 'Cut & Grain', years: '2017 — Present', summary: 'Wedding menswear for Delhi-NCR and outstation grooms.' },
    ],
    reviews: [
      { author: 'Aditya S.', rating: 5, text: 'The nehru jacket sat clean on the shoulder. Clear updates throughout.', date: 'Jul 2026' },
    ],
    portfolio: ['/hero/hero-street.png', '/hero/fabric-olive.png', '/hero/fabric-charcoal.png'],
  },
  {
    id: 't6',
    name: 'Nandini Rao',
    studio: 'Rao Blouse Co.',
    city: 'Chennai',
    state: 'Tamil Nadu',
    specialty: 'Blouses',
    image: '/hero/fabric-beige.png',
    coverImage: '/hero/hero-couple.png',
    headline: 'Blouse specialist · Deep necks, lining, and precision darting',
    about: 'I stitch blouses that hold a saree in place: padded options, hidden hooks, and necklines that photograph well. Best for Kanjeevaram, Banarasi, and silk sarees sent by post.',
    verified: true,
    rating: 4.9,
    reviewCount: 210,
    yearsExperience: 16,
    ordersCompleted: 1100,
    availability: 'limited',
    skills: ['Saree blouse', 'Princess cut', 'Piping', 'Hook finishing'],
    languages: ['Tamil', 'English'],
    experience: [
      { title: 'Founder', studio: 'Rao Blouse Co.', years: '2012 — Present', summary: 'Dedicated blouse studio serving Chennai and remote silk clients.' },
    ],
    reviews: [
      { author: 'Keerthi V.', rating: 5, text: 'Best blouse I have worn. The back neck sat exactly as sketched.', date: 'Sep 2026' },
    ],
    portfolio: ['/hero/fabric-beige.png', '/hero/hero-couple.png', '/hero/fabric-charcoal.png'],
  },
  {
    id: 't7',
    name: 'Imran Sheikh',
    studio: 'Sheikh & Sons',
    city: 'Hyderabad',
    state: 'Telangana',
    specialty: 'Sherwanis & bandhgala',
    image: '/hero/fabric-olive.png',
    coverImage: '/hero/fabric-charcoal.png',
    headline: 'Hyderabadi sherwani house · Mirror work, buttons, and sherwani sets',
    about: 'A family workshop for Hyderabadi sherwanis with pearl and mirror detailing. We stitch kurta-pajama sets to match and ship pan-India.',
    verified: false,
    rating: 4.5,
    reviewCount: 43,
    yearsExperience: 7,
    ordersCompleted: 180,
    availability: 'accepting',
    skills: ['Sherwani', 'Kurta pajama', 'Mirror work', 'Button finishing'],
    languages: ['Urdu', 'Hindi', 'English'],
    experience: [
      { title: 'Workshop partner', studio: 'Sheikh & Sons', years: '2019 — Present', summary: 'Festival and nikah sherwanis with matching bottoms.' },
    ],
    reviews: [
      { author: 'Omar H.', rating: 4, text: 'Rich work on the collar. Fit was true to the measurement sheet.', date: 'Feb 2026' },
    ],
    portfolio: ['/hero/fabric-olive.png', '/hero/fabric-charcoal.png', '/hero/hero-street.png'],
  },
  {
    id: 't8',
    name: 'Aditi Sharma',
    studio: 'Pallu Atelier',
    city: 'Delhi',
    state: 'Delhi',
    specialty: 'Bridal lehengas',
    image: '/hero/hero-couple.png',
    coverImage: '/hero/fabric-beige.png',
    headline: 'Reception and sangeet wear · Lehengas, gowns, and pre-draped sarees',
    about: 'I build reception looks that can travel: pre-draped sarees, light lehengas, and gowns with a secure inner structure. Ideal for destination weddings.',
    verified: true,
    rating: 4.8,
    reviewCount: 88,
    yearsExperience: 12,
    ordersCompleted: 260,
    availability: 'limited',
    skills: ['Reception lehenga', 'Pre-draped saree', 'Gown', 'Travel-friendly finishing'],
    languages: ['Hindi', 'English'],
    experience: [
      { title: 'Atelier lead', studio: 'Pallu Atelier', years: '2015 — Present', summary: 'Destination wedding outfits with fittings over video.' },
    ],
    reviews: [
      { author: 'Riya D.', rating: 5, text: 'Wore the gown through a late sangeet. Structure held, and it packed well.', date: 'Jan 2026' },
    ],
    portfolio: ['/hero/hero-couple.png', '/hero/fabric-beige.png', '/hero/hero-street.png'],
  },
  {
    id: 't9',
    name: 'Vivek Nair',
    studio: 'South Cut',
    city: 'Bengaluru',
    state: 'Karnataka',
    specialty: 'Salwars & suits',
    image: '/hero/fabric-charcoal.png',
    coverImage: '/hero/hero-street.png',
    headline: 'Contemporary salwars · Anarkali, co-ords, and workwear ethnic',
    about: 'I mix a Bengaluru workwear cut with traditional silhouettes. Anarkalis, co-ord sets, and kurtas that can go from office to a function.',
    verified: true,
    rating: 4.4,
    reviewCount: 37,
    yearsExperience: 6,
    ordersCompleted: 150,
    availability: 'accepting',
    skills: ['Anarkali', 'Co-ords', 'Kurta', 'Workwear ethnic'],
    languages: ['Kannada', 'English', 'Malayalam'],
    experience: [
      { title: 'Founder', studio: 'South Cut', years: '2021 — Present', summary: 'Made-to-measure ethnic workwear for Bengaluru professionals.' },
    ],
    reviews: [
      { author: 'Sneha P.', rating: 4, text: 'The anarkali was wearable, not costume-y. Good for weekday events.', date: 'Jun 2026' },
    ],
    portfolio: ['/hero/fabric-charcoal.png', '/hero/hero-street.png', '/hero/fabric-beige.png'],
  },
  {
    id: 't10',
    name: 'Leela Banerjee',
    studio: 'Banerjee Looms',
    city: 'Mumbai',
    state: 'Maharashtra',
    specialty: 'Kanjeevaram sarees',
    image: '/hero/fabric-beige.png',
    coverImage: '/hero/fabric-charcoal.png',
    headline: 'Silk and drape specialist · Kanjeevaram, Banarasi, and fall-pico finishing',
    about: 'I finish silks with fall, pico, and a blouse that respects the pallu. Clients send a saree; I return it stitched, steamed, and packed for the function.',
    verified: true,
    rating: 4.7,
    reviewCount: 55,
    yearsExperience: 13,
    ordersCompleted: 340,
    availability: 'accepting',
    skills: ['Fall & pico', 'Kanjeevaram', 'Banarasi', 'Saree finishing'],
    languages: ['Bengali', 'Hindi', 'English', 'Marathi'],
    experience: [
      { title: 'Finishing lead', studio: 'Banerjee Looms', years: '2014 — Present', summary: 'Silk finishing and blouses for Mumbai and remote clients.' },
    ],
    reviews: [
      { author: 'Isha B.', rating: 5, text: 'Sent a Banarasi from Kolkata. Came back beautifully finished.', date: 'May 2026' },
    ],
    portfolio: ['/hero/fabric-beige.png', '/hero/fabric-charcoal.png', '/hero/hero-couple.png'],
  },
];

export const TAILOR_SPECIALTIES = Array.from(new Set(TAILORS.map((tailor) => tailor.specialty)));

export function getTailorById(id?: string | null) {
  return TAILORS.find((tailor) => tailor.id === id) ?? null;
}

export function specialtyForCategory(categoryId?: string | null) {
  if (!categoryId) return null;
  if (['sarees', 'saree-blouse'].includes(categoryId)) return 'Kanjeevaram sarees';
  if (['salwars', 'kurti', 'salwar-suit', 'anarkali', 'girls-salwar'].includes(categoryId)) return 'Salwars & suits';
  if (['sherwanis', 'sherwani', 'kurta', 'nehru-jacket', 'suit'].includes(categoryId)) return 'Sherwanis & bandhgala';
  if (['lehengas', 'lehenga', 'bridal-wear', 'gown'].includes(categoryId)) return 'Bridal lehengas';
  return null;
}

export const HERO_VIDEOS = [
  { id: 'video-1', src: '/hero/THY%20Banner.mp4', label: 'THY banner' },
  { id: 'video-2', src: '/hero/THY%20Video.mp4', label: 'THY video' },
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
      tailor.city.toLowerCase().includes(q) ||
      tailor.headline.toLowerCase().includes(q)
    ),
  };
}
