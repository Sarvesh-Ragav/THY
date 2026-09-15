import { connectMongo, disconnectMongo } from './mongo.js';
import {
  User,
  Category,
  DesignCatalogItem,
  TailorProfile,
  CustomerMeasurement,
} from '../models/index.js';

const SEED_CATEGORIES = [
  {
    slug: 'sarees',
    name: 'Sarees',
    description: 'Handloom, Kanjeevaram, and contemporary designer sarees',
    imageUrl: '/hero/fabric-charcoal.png',
    displayOrder: 1,
    isActive: true,
  },
  {
    slug: 'salwars',
    name: 'Salwars & Suits',
    description: 'Everyday cotton suits to festive embroidered anarkalis',
    imageUrl: '/hero/fabric-beige.png',
    displayOrder: 2,
    isActive: true,
  },
  {
    slug: 'sherwanis',
    name: 'Sherwanis',
    description: 'Bandhgala, jodhpuri jackets, and royal wedding groom sherwanis',
    imageUrl: '/hero/fabric-olive.png',
    displayOrder: 3,
    isActive: true,
  },
  {
    slug: 'lehengas',
    name: 'Lehengas',
    description: 'Bridal, sangeet, and reception lehengas with custom flair',
    imageUrl: '/hero/hero-couple.png',
    displayOrder: 4,
    isActive: true,
  },
];

const SEED_DESIGNS = [
  {
    designCode: 'd1',
    categorySlug: 'sarees',
    title: 'Kanjeevaram border drape',
    imageUrl: '/hero/fabric-charcoal.png',
    isPopular: true,
    isTrending: true,
    displayOrder: 1,
    isActive: true,
  },
  {
    designCode: 'd2',
    categorySlug: 'salwars',
    title: 'Festive anarkali',
    imageUrl: '/hero/fabric-beige.png',
    isPopular: true,
    isTrending: false,
    displayOrder: 2,
    isActive: true,
  },
  {
    designCode: 'd3',
    categorySlug: 'sherwanis',
    title: 'Olive bandhgala',
    imageUrl: '/hero/fabric-olive.png',
    isPopular: true,
    isTrending: true,
    displayOrder: 3,
    isActive: true,
  },
  {
    designCode: 'd4',
    categorySlug: 'lehengas',
    title: 'Reception lehenga',
    imageUrl: '/hero/hero-couple.png',
    isPopular: false,
    isTrending: true,
    displayOrder: 4,
    isActive: true,
  },
  {
    designCode: 'd5',
    categorySlug: 'sarees',
    title: 'Zari silk saree',
    imageUrl: '/hero/hero-street.png',
    isPopular: true,
    isTrending: false,
    displayOrder: 5,
    isActive: true,
  },
  {
    designCode: 'd6',
    categorySlug: 'salwars',
    title: 'Everyday salwar',
    imageUrl: '/hero/fabric-beige.png',
    isPopular: false,
    isTrending: true,
    displayOrder: 6,
    isActive: true,
  },
];

const SEED_TAILORS = [
  {
    publicId: 't1',
    phoneNumber: '+919000000001',
    fullName: 'Meera Krishnan',
    shopName: 'Atelier Meera',
    yearsOfExperience: 12,
    city: 'Chennai',
    shopAddress: '18 North Mada Street, Mylapore, Chennai',
    directoryImageUrl: '/hero/hero-couple.png',
    specialties: ['Kanjeevaram sarees', 'Blouse embroidery', 'Temple border styling'],
    rating: 4.9,
    reviewCount: 38,
    pricingStartingAt: 1200,
    turnaroundDays: 5,
    portfolio: [
      { title: 'Atelier Meera Portfolio', imageUrl: '/hero/hero-couple.png', category: 'sarees', displayOrder: 1 },
      { title: 'Silk Blouse Drape', imageUrl: '/hero/fabric-charcoal.png', category: 'sarees', displayOrder: 2 },
    ],
  },
  {
    publicId: 't2',
    phoneNumber: '+919000000002',
    fullName: 'Arjun Desai',
    shopName: 'Desai House',
    yearsOfExperience: 10,
    city: 'Mumbai',
    shopAddress: '45 Linking Road, Bandra West, Mumbai',
    directoryImageUrl: '/hero/fabric-olive.png',
    specialties: ['Sherwanis & bandhgala', 'Tailored suits', 'Groom ensembles'],
    rating: 4.8,
    reviewCount: 29,
    pricingStartingAt: 2500,
    turnaroundDays: 7,
    portfolio: [
      { title: 'Desai House Portfolio', imageUrl: '/hero/fabric-olive.png', category: 'sherwanis', displayOrder: 1 },
    ],
  },
  {
    publicId: 't3',
    phoneNumber: '+919000000003',
    fullName: 'Farah Qureshi',
    shopName: 'Noor Studio',
    yearsOfExperience: 11,
    city: 'Hyderabad',
    shopAddress: '12 Banjara Hills, Road No. 10, Hyderabad',
    directoryImageUrl: '/hero/fabric-beige.png',
    specialties: ['Bridal lehengas', 'Zardozi work', 'Evening gowns'],
    rating: 4.9,
    reviewCount: 44,
    pricingStartingAt: 3500,
    turnaroundDays: 10,
    portfolio: [
      { title: 'Noor Studio Portfolio', imageUrl: '/hero/fabric-beige.png', category: 'lehengas', displayOrder: 1 },
    ],
  },
  {
    publicId: 't4',
    phoneNumber: '+919000000004',
    fullName: 'Sana Iyer',
    shopName: 'Thread & Gold',
    yearsOfExperience: 8,
    city: 'Bengaluru',
    shopAddress: '77 100ft Road, Indiranagar, Bengaluru',
    directoryImageUrl: '/hero/fabric-charcoal.png',
    specialties: ['Salwars & suits', 'Contemporary cuts', 'Custom kurtas'],
    rating: 4.7,
    reviewCount: 21,
    pricingStartingAt: 950,
    turnaroundDays: 4,
    portfolio: [
      { title: 'Thread & Gold Portfolio', imageUrl: '/hero/fabric-charcoal.png', category: 'salwars', displayOrder: 1 },
    ],
  },
];

async function seedDatabase() {
  console.log('🚀 Starting MongoDB initialization and seed for THY...');
  await connectMongo();

  // 1. Seed Categories
  console.log('📂 Seeding Catalog Categories...');
  for (const cat of SEED_CATEGORIES) {
    await Category.findOneAndUpdate(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true, new: true }
    );
  }
  console.log(`✅ ${SEED_CATEGORIES.length} Categories seeded.`);

  // 2. Seed Designs
  console.log('🎨 Seeding Catalog Designs...');
  for (const design of SEED_DESIGNS) {
    await DesignCatalogItem.findOneAndUpdate(
      { designCode: design.designCode },
      { $set: design },
      { upsert: true, new: true }
    );
  }
  console.log(`✅ ${SEED_DESIGNS.length} Designs seeded.`);

  // 3. Seed Tailors
  console.log('✂️ Seeding Verified Tailor Profiles...');
  for (const t of SEED_TAILORS) {
    // Find or create User
    let user = await User.findOne({ phoneNumber: t.phoneNumber });
    if (!user) {
      user = await User.create({
        phoneNumber: t.phoneNumber,
        role: 'tailor',
        isActive: true,
      });
    }

    await TailorProfile.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          publicId: t.publicId,
          fullName: t.fullName,
          shopName: t.shopName,
          yearsOfExperience: t.yearsOfExperience,
          city: t.city,
          shopAddress: t.shopAddress,
          directoryImageUrl: t.directoryImageUrl,
          specialties: t.specialties,
          rating: t.rating,
          reviewCount: t.reviewCount,
          pricingStartingAt: t.pricingStartingAt,
          turnaroundDays: t.turnaroundDays,
          isDirectoryActive: true,
          verification: {
            status: 'approved',
            idType: 'aadhaar',
            documentName: 'verified_tailor_badge.pdf',
            submittedAt: new Date(),
            reviewedAt: new Date(),
          },
          portfolio: t.portfolio,
        },
      },
      { upsert: true, new: true }
    );
  }
  console.log(`✅ ${SEED_TAILORS.length} Tailors seeded.`);

  console.log('🎉 MongoDB Database construction & seeding completed successfully!');
  await disconnectMongo();
}

seedDatabase().catch((error) => {
  console.error('❌ Error seeding MongoDB database:', error);
  process.exit(1);
});
