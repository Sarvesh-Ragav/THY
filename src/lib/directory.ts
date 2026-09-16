export type DirectoryPortfolioItem = {
  id: string;
  title: string;
  image: string;
  category: string;
  isFeatured: boolean;
};

export type PublicDirectoryTailor = {
  id: string;
  name: string;
  studio: string;
  city: string;
  shopAddress: string;
  image: string;
  bio: string;
  specialty: string;
  specialties: string[];
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  pricingStartingAt: number;
  turnaroundDays: number;
  portfolio: DirectoryPortfolioItem[];
  acceptingOrders?: boolean;
  schedule?: Array<{ day: string; isOpen: boolean; openTime: string; closeTime: string }>;
};

export type DirectoryServicePrice = {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
};

export const DEFAULT_TAILOR_SERVICES: DirectoryServicePrice[] = [
  { id: '1', name: 'Saree Blouse', minPrice: 800, maxPrice: 2500 },
  { id: '2', name: 'Salwar / Kurti', minPrice: 600, maxPrice: 1800 },
  { id: '3', name: 'Anarkali', minPrice: 1500, maxPrice: 4500 },
  { id: '4', name: 'Lehenga', minPrice: 3000, maxPrice: 12000 },
  { id: '5', name: 'Bridal Wear', minPrice: 5000, maxPrice: 25000 },
  { id: '6', name: 'Alterations', minPrice: 200, maxPrice: 800 },
];

export const PORTFOLIO_CATEGORIES = ['All', 'Blouse', 'Kurti', 'Anarkali', 'Lehenga', 'Dress', 'Bridal'] as const;

export function featuredPortfolio(tailor: PublicDirectoryTailor): DirectoryPortfolioItem[] {
  const marked = tailor.portfolio.filter((item) => item.isFeatured);
  return (marked.length > 0 ? marked : tailor.portfolio).slice(0, 3);
}
