import { Types } from 'mongoose';
import { TailorProfile } from '../models/TailorProfile.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/api-error.js';

type DirectoryQuery = { city?: string; q?: string; page: number; limit: number };

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
  acceptingOrders: boolean;
  schedule: Array<{ day: string; isOpen: boolean; openTime: string; closeTime: string }>;
};

export type TailorPortfolioInput = {
  id?: string;
  title: string;
  image: string;
  category: string;
  isFeatured?: boolean;
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mapPortfolio(
  items: Array<{
    _id?: { toString(): string };
    title?: string;
    imageUrl?: string;
    category?: string;
    displayOrder?: number;
    isActive?: boolean;
    isFeatured?: boolean;
  }> | undefined
): DirectoryPortfolioItem[] {
  return (items ?? [])
    .filter((item) => item.isActive !== false && item.imageUrl && item.title)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((item, index) => ({
      id: item._id?.toString?.() || `${item.title}-${index}`,
      title: item.title as string,
      image: item.imageUrl as string,
      category: item.category || 'general',
      isFeatured: Boolean(item.isFeatured) || index < 2,
    }));
}

function mapPublicTailor(profile: {
  publicId?: string | null;
  userId: { toString(): string };
  fullName: string;
  shopName: string;
  city: string;
  shopAddress: string;
  directoryImageUrl?: string | null;
  specialties?: string[];
  yearsOfExperience?: number;
  rating?: number;
  reviewCount?: number;
  verification?: { status?: string } | null;
  pricingStartingAt?: number;
  turnaroundDays?: number;
  portfolio?: Parameters<typeof mapPortfolio>[0];
  isAvailable?: boolean;
  vacationMode?: boolean;
  schedule?: Array<{ day?: string; isOpen?: boolean; openTime?: string; closeTime?: string }>;
}): PublicDirectoryTailor {
  const specialties = (profile.specialties ?? []).filter(Boolean);
  const portfolio = mapPortfolio(profile.portfolio);
  const specialty = specialties[0] || 'Custom stitching';
  return {
    id: profile.publicId || `t-${profile.userId.toString()}`,
    name: profile.fullName,
    studio: profile.shopName,
    city: profile.city,
    shopAddress: profile.shopAddress,
    image: profile.directoryImageUrl || portfolio[0]?.image || '/hero/fabric-charcoal.png',
    bio: specialties.length
      ? `Specializing in ${specialties.join(', ')}.`
      : 'Custom stitching, fittings, and alterations.',
    specialty,
    specialties: specialties.length ? specialties : [specialty],
    yearsExperience: profile.yearsOfExperience ?? 0,
    rating: profile.rating ?? 0,
    reviewCount: profile.reviewCount ?? 0,
    verified: profile.verification?.status === 'approved',
    pricingStartingAt: profile.pricingStartingAt ?? 800,
    turnaroundDays: profile.turnaroundDays ?? 5,
    portfolio,
    acceptingOrders: profile.isAvailable !== false && profile.vacationMode !== true,
    schedule: (profile.schedule ?? [])
      .filter((day) => day.day)
      .map((day) => ({
        day: day.day as string,
        isOpen: day.isOpen !== false,
        openTime: day.openTime || '09:00',
        closeTime: day.closeTime || '19:00',
      })),
  };
}

async function activeTailorUserIds(userIds: Array<string | Types.ObjectId>): Promise<Set<string>> {
  if (userIds.length === 0) return new Set();
  const users = await User.find({
    _id: { $in: userIds },
    role: 'tailor',
    isActive: true,
  })
    .select('_id')
    .lean();
  return new Set(users.map((user) => user._id.toString()));
}

export async function listDirectoryTailors(query: DirectoryQuery) {
  const filter: Record<string, unknown> = {
    isDirectoryActive: { $ne: false },
    publicId: { $nin: [null, ''] },
    city: { $nin: [null, ''] },
  };

  if (query.city) {
    filter.city = { $regex: escapeRegex(query.city), $options: 'i' };
  }
  if (query.q) {
    const rx = { $regex: escapeRegex(query.q), $options: 'i' };
    filter.$or = [{ fullName: rx }, { shopName: rx }, { city: rx }, { specialties: rx }, { shopAddress: rx }];
  }

  const profiles = await TailorProfile.find(filter).sort({ rating: -1, fullName: 1 }).lean();
  const allowed = await activeTailorUserIds(profiles.map((profile) => profile.userId));
  const visible = profiles.filter((profile) => allowed.has(profile.userId.toString())).map(mapPublicTailor);
  const start = (query.page - 1) * query.limit;
  const items = visible.slice(start, start + query.limit);
  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total: visible.length,
      totalPages: Math.ceil(visible.length / query.limit) || 0,
    },
  };
}

export async function getDirectoryTailor(publicId: string): Promise<PublicDirectoryTailor> {
  const maybeUserId = publicId.startsWith('t-') && Types.ObjectId.isValid(publicId.slice(2)) ? publicId.slice(2) : null;
  const profile = await TailorProfile.findOne({
    isDirectoryActive: { $ne: false },
    $or: [{ publicId }, ...(maybeUserId ? [{ userId: maybeUserId }] : [])],
  }).lean();
  if (!profile) {
    throw new ApiError(404, 'Tailor was not found.', 'TAILOR_NOT_FOUND');
  }
  const allowed = await activeTailorUserIds([profile.userId]);
  if (!allowed.has(profile.userId.toString())) {
    throw new ApiError(404, 'Tailor was not found.', 'TAILOR_NOT_FOUND');
  }
  return mapPublicTailor(profile);
}

export async function replaceTailorPortfolio(userId: string, items: TailorPortfolioInput[]) {
  const profile = await TailorProfile.findOne({ userId });
  if (!profile) {
    throw new ApiError(404, 'Tailor profile was not found.', 'TAILOR_NOT_FOUND');
  }

  profile.set(
    'portfolio',
    items.map((item, index) => ({
      title: item.title,
      imageUrl: item.image,
      category: item.category || 'general',
      displayOrder: index,
      isFeatured: Boolean(item.isFeatured) || index < 2,
      isActive: true,
    }))
  );

  const cover = items.find((item) => item.isFeatured)?.image || items[0]?.image;
  if (cover && (!profile.directoryImageUrl || profile.directoryImageUrl.startsWith('/hero/'))) {
    profile.directoryImageUrl = cover;
  }

  await profile.save();
  return mapPortfolio(profile.portfolio);
}

function cityFromAddress(address?: string): string {
  if (!address) return '';
  const parts = address.split(',').map((part) => part.trim()).filter(Boolean);
  return parts[parts.length - 1] || address;
}

export async function updateDirectoryTailorDetails(
  userId: string,
  input: {
    fullName?: string;
    shopName?: string;
    yearsOfExperience?: number;
    shopAddress?: string;
    city?: string;
    availability?: {
      isAvailable?: boolean;
      vacationMode?: boolean;
      maxActiveCapacity?: number;
      schedule?: Array<{ day: string; isOpen: boolean; openTime: string; closeTime: string }>;
    };
  }
) {
  const profile = await TailorProfile.findOne({ userId });
  if (!profile) {
    throw new ApiError(404, 'Tailor profile was not found.', 'TAILOR_NOT_FOUND');
  }

  if (input.fullName) profile.fullName = input.fullName;
  if (input.shopName) profile.shopName = input.shopName;
  if (input.yearsOfExperience !== undefined) profile.yearsOfExperience = input.yearsOfExperience;
  if (input.shopAddress) profile.shopAddress = input.shopAddress;
  if (input.city) profile.city = input.city;
  else if (input.shopAddress) profile.city = cityFromAddress(input.shopAddress) || profile.city;

  if (input.availability) {
    if (input.availability.isAvailable !== undefined) profile.isAvailable = input.availability.isAvailable;
    if (input.availability.vacationMode !== undefined) profile.vacationMode = input.availability.vacationMode;
    if (input.availability.maxActiveCapacity !== undefined) {
      profile.maxActiveCapacity = input.availability.maxActiveCapacity;
    }
    if (input.availability.schedule) {
      profile.set('schedule', input.availability.schedule);
    }
    profile.isDirectoryActive = input.availability.isAvailable !== false && input.availability.vacationMode !== true;
  }

  await profile.save();
  return mapPublicTailor(profile);
}
