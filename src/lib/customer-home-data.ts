export const CUSTOMER_NAV_LINKS = [
  { label: 'Sarees', href: '#sarees' },
  { label: 'Salwars & Suits', href: '#salwars' },
  { label: 'Meet the Tailors', href: '#tailors' },
  { label: 'How It Works', href: '#how-it-works' },
] as const;

export const CATEGORIES = [
  { id: 'sarees', title: 'Sarees', note: 'Kanjeevaram, Banarasi, contemporary drapes', image: '/hero/fabric-charcoal.png' },
  { id: 'salwars', title: 'Salwars & Suits', note: 'Anarkalis, shararas, everyday luxury', image: '/hero/fabric-beige.png' },
  { id: 'sherwanis', title: 'Sherwanis', note: 'Bandhgala, wedding, reception', image: '/hero/fabric-olive.png' },
  { id: 'lehengas', title: 'Lehengas', note: 'Bridal and festive couture', image: '/hero/hero-couple.png' },
  { id: 'alterations', title: 'Alterations', note: 'Perfect the pieces you already love', image: '/hero/hero-street.png' },
] as const;

export const FILTERS = {
  location: ['All cities', 'Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai'],
  rating: ['Any rating', '4.5+', '4.8+'],
  price: ['Any price', 'Under ₹3,000', '₹3,000–₹8,000', '₹8,000+'],
  experience: ['Any experience', '5+ years', '10+ years'],
} as const;

export interface FeaturedTailor {
  id: string;
  name: string;
  studio: string;
  city: string;
  specialty: string;
  rating: number;
  reviews: number;
  startingPrice: string;
  experience: string;
  image: string;
  available: boolean;
}

export const FEATURED_TAILORS: FeaturedTailor[] = [
  {
    id: 't1',
    name: 'Meera Krishnan',
    studio: 'Atelier Meera',
    city: 'Chennai',
    specialty: 'Kanjeevaram sarees',
    rating: 4.9,
    reviews: 128,
    startingPrice: '₹4,200',
    experience: '14 years',
    image: '/hero/hero-couple.png',
    available: true,
  },
  {
    id: 't2',
    name: 'Arjun Desai',
    studio: 'Desai House',
    city: 'Mumbai',
    specialty: 'Sherwanis & bandhgala',
    rating: 4.8,
    reviews: 96,
    startingPrice: '₹6,800',
    experience: '11 years',
    image: '/hero/fabric-olive.png',
    available: true,
  },
  {
    id: 't3',
    name: 'Farah Qureshi',
    studio: 'Noor Studio',
    city: 'Hyderabad',
    specialty: 'Bridal lehengas',
    rating: 4.9,
    reviews: 154,
    startingPrice: '₹9,500',
    experience: '16 years',
    image: '/hero/fabric-beige.png',
    available: false,
  },
  {
    id: 't4',
    name: 'Sana Iyer',
    studio: 'Thread & Gold',
    city: 'Bengaluru',
    specialty: 'Salwars & contemporary suits',
    rating: 4.7,
    reviews: 81,
    startingPrice: '₹2,800',
    experience: '7 years',
    image: '/hero/fabric-charcoal.png',
    available: true,
  },
];

export const HOW_IT_WORKS = [
  { step: '01', title: 'Choose a look', body: 'Browse sarees, salwars, sherwanis, or start from a blank brief.' },
  { step: '02', title: 'Meet a tailor', body: 'Filter by city, rating, and craft. Chat before you commit.' },
  { step: '03', title: 'Share measurements', body: 'Upload photos, saved sizes, or book a fitting with the atelier.' },
  { step: '04', title: 'Wear it', body: 'Approve the quote, track stitching, and receive it at your door.' },
] as const;
