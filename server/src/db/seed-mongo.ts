import { connectMongo, disconnectMongo } from './mongo.js';
import {
  User,
  Category,
  DesignCatalogItem,
  TailorProfile,
  CustomerProfile,
  CustomerMeasurement,
} from '../models/index.js';
import { hashPassword } from '../utils/crypto.js';

export const SEED_CATEGORIES = [
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

export const SEED_DESIGNS = [
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

export const SEED_TAILORS = [
  {
    publicId: 't1',
    phoneNumber: '+919000000001',
    email: 'meerakrishnan@gmail.com',
    password: 'meerakrishnan',
    fullName: 'Meera Krishnan',
    shopName: 'Atelier Meera',
    yearsOfExperience: 14,
    city: 'Chennai',
    shopAddress: '18 North Mada Street, Mylapore, Chennai, Tamil Nadu',
    directoryImageUrl: '/hero/hero-couple.png',
    specialties: ['Kanjeevaram sarees', 'Blouse embroidery', 'Temple border styling'],
    rating: 4.9,
    reviewCount: 128,
    pricingStartingAt: 1200,
    turnaroundDays: 5,
    portfolio: [
      { title: 'Atelier Meera Portfolio', imageUrl: '/hero/hero-couple.png', category: 'sarees', displayOrder: 1 },
      { title: 'Silk Blouse Drape', imageUrl: '/hero/fabric-charcoal.png', category: 'sarees', displayOrder: 2 },
      { title: 'Beige Zari Border', imageUrl: '/hero/fabric-beige.png', category: 'sarees', displayOrder: 3 },
    ],
  },
  {
    publicId: 't2',
    phoneNumber: '+919000000002',
    email: 'arjundesai@gmail.com',
    password: 'arjundesai',
    fullName: 'Arjun Desai',
    shopName: 'Desai House',
    yearsOfExperience: 11,
    city: 'Mumbai',
    shopAddress: '45 Linking Road, Bandra West, Mumbai, Maharashtra',
    directoryImageUrl: '/hero/fabric-olive.png',
    specialties: ['Sherwanis & bandhgala', 'Tailored suits', 'Groom ensembles'],
    rating: 4.8,
    reviewCount: 96,
    pricingStartingAt: 2500,
    turnaroundDays: 7,
    portfolio: [
      { title: 'Desai House Portfolio', imageUrl: '/hero/fabric-olive.png', category: 'sherwanis', displayOrder: 1 },
      { title: 'Street Ensemble', imageUrl: '/hero/hero-street.png', category: 'sherwanis', displayOrder: 2 },
      { title: 'Charcoal Bandhgala', imageUrl: '/hero/fabric-charcoal.png', category: 'sherwanis', displayOrder: 3 },
    ],
  },
  {
    publicId: 't3',
    phoneNumber: '+919000000003',
    email: 'farahqureshi@gmail.com',
    password: 'farahqureshi',
    fullName: 'Farah Qureshi',
    shopName: 'Noor Studio',
    yearsOfExperience: 9,
    city: 'Hyderabad',
    shopAddress: '12 Banjara Hills, Road No. 10, Hyderabad, Telangana',
    directoryImageUrl: '/hero/fabric-beige.png',
    specialties: ['Bridal lehengas', 'Zardozi work', 'Evening gowns'],
    rating: 5.0,
    reviewCount: 74,
    pricingStartingAt: 3500,
    turnaroundDays: 10,
    portfolio: [
      { title: 'Noor Studio Portfolio', imageUrl: '/hero/fabric-beige.png', category: 'lehengas', displayOrder: 1 },
      { title: 'Bridal Couple Wear', imageUrl: '/hero/hero-couple.png', category: 'lehengas', displayOrder: 2 },
      { title: 'Olive Festive Lehenga', imageUrl: '/hero/fabric-olive.png', category: 'lehengas', displayOrder: 3 },
    ],
  },
  {
    publicId: 't4',
    phoneNumber: '+919000000004',
    email: 'sanaiyer@gmail.com',
    password: 'sanaiyer',
    fullName: 'Sana Iyer',
    shopName: 'Thread & Gold',
    yearsOfExperience: 8,
    city: 'Bengaluru',
    shopAddress: '77 100ft Road, Indiranagar, Bengaluru, Karnataka',
    directoryImageUrl: '/hero/fabric-charcoal.png',
    specialties: ['Salwars & suits', 'Contemporary cuts', 'Custom kurtas'],
    rating: 4.7,
    reviewCount: 152,
    pricingStartingAt: 950,
    turnaroundDays: 4,
    portfolio: [
      { title: 'Thread & Gold Portfolio', imageUrl: '/hero/fabric-charcoal.png', category: 'salwars', displayOrder: 1 },
      { title: 'Beige Kurti Set', imageUrl: '/hero/fabric-beige.png', category: 'salwars', displayOrder: 2 },
      { title: 'Street Style Salwar', imageUrl: '/hero/hero-street.png', category: 'salwars', displayOrder: 3 },
    ],
  },
  {
    publicId: 't5',
    phoneNumber: '+919000000005',
    email: 'kabirmenon@gmail.com',
    password: 'kabirmenon',
    fullName: 'Kabir Menon',
    shopName: 'Cut & Grain',
    yearsOfExperience: 10,
    city: 'Delhi',
    shopAddress: '24 Hauz Khas Village, New Delhi, Delhi',
    directoryImageUrl: '/hero/hero-street.png',
    specialties: ['Sherwanis & bandhgala', 'Achkan', 'Nehru jackets'],
    rating: 4.6,
    reviewCount: 61,
    pricingStartingAt: 2200,
    turnaroundDays: 6,
    portfolio: [
      { title: 'Cut & Grain Portfolio', imageUrl: '/hero/hero-street.png', category: 'sherwanis', displayOrder: 1 },
      { title: 'Festive Olive Coat', imageUrl: '/hero/fabric-olive.png', category: 'sherwanis', displayOrder: 2 },
      { title: 'Classic Bandhgala', imageUrl: '/hero/fabric-charcoal.png', category: 'sherwanis', displayOrder: 3 },
    ],
  },
  {
    publicId: 't6',
    phoneNumber: '+919000000006',
    email: 'nandinirao@gmail.com',
    password: 'nandinirao',
    fullName: 'Nandini Rao',
    shopName: 'Rao Blouse Co.',
    yearsOfExperience: 16,
    city: 'Chennai',
    shopAddress: '5 T. Nagar High Road, Chennai, Tamil Nadu',
    directoryImageUrl: '/hero/fabric-beige.png',
    specialties: ['Blouses', 'Saree blouse', 'Princess cut', 'Precision darting'],
    rating: 4.9,
    reviewCount: 210,
    pricingStartingAt: 800,
    turnaroundDays: 3,
    portfolio: [
      { title: 'Rao Blouse Co. Portfolio', imageUrl: '/hero/fabric-beige.png', category: 'sarees', displayOrder: 1 },
      { title: 'Silk Blouse Drape', imageUrl: '/hero/hero-couple.png', category: 'sarees', displayOrder: 2 },
      { title: 'Charcoal Padded Blouse', imageUrl: '/hero/fabric-charcoal.png', category: 'sarees', displayOrder: 3 },
    ],
  },
  {
    publicId: 't7',
    phoneNumber: '+919000000007',
    email: 'imransheikh@gmail.com',
    password: 'imransheikh',
    fullName: 'Imran Sheikh',
    shopName: 'Sheikh & Sons',
    yearsOfExperience: 7,
    city: 'Hyderabad',
    shopAddress: '88 Charminar Bazaar, Hyderabad, Telangana',
    directoryImageUrl: '/hero/fabric-olive.png',
    specialties: ['Sherwanis & bandhgala', 'Kurta pajama', 'Mirror work'],
    rating: 4.5,
    reviewCount: 43,
    pricingStartingAt: 1800,
    turnaroundDays: 5,
    portfolio: [
      { title: 'Sheikh & Sons Portfolio', imageUrl: '/hero/fabric-olive.png', category: 'sherwanis', displayOrder: 1 },
      { title: 'Charcoal Kurta Set', imageUrl: '/hero/fabric-charcoal.png', category: 'sherwanis', displayOrder: 2 },
      { title: 'Royal Heritage Outfit', imageUrl: '/hero/hero-street.png', category: 'sherwanis', displayOrder: 3 },
    ],
  },
  {
    publicId: 't8',
    phoneNumber: '+919000000008',
    email: 'aditisharma@gmail.com',
    password: 'aditisharma',
    fullName: 'Aditi Sharma',
    shopName: 'Pallu Atelier',
    yearsOfExperience: 12,
    city: 'Delhi',
    shopAddress: '14 Khan Market, New Delhi, Delhi',
    directoryImageUrl: '/hero/hero-couple.png',
    specialties: ['Bridal lehengas', 'Reception lehenga', 'Pre-draped saree'],
    rating: 4.8,
    reviewCount: 88,
    pricingStartingAt: 4000,
    turnaroundDays: 8,
    portfolio: [
      { title: 'Pallu Atelier Portfolio', imageUrl: '/hero/hero-couple.png', category: 'lehengas', displayOrder: 1 },
      { title: 'Beige Reception Gown', imageUrl: '/hero/fabric-beige.png', category: 'lehengas', displayOrder: 2 },
      { title: 'Festive Drape', imageUrl: '/hero/hero-street.png', category: 'lehengas', displayOrder: 3 },
    ],
  },
  {
    publicId: 't9',
    phoneNumber: '+919000000009',
    email: 'viveknair@gmail.com',
    password: 'viveknair',
    fullName: 'Vivek Nair',
    shopName: 'South Cut',
    yearsOfExperience: 6,
    city: 'Bengaluru',
    shopAddress: '22 Koramangala 4th Block, Bengaluru, Karnataka',
    directoryImageUrl: '/hero/fabric-charcoal.png',
    specialties: ['Salwars & suits', 'Anarkali', 'Co-ords', 'Workwear ethnic'],
    rating: 4.4,
    reviewCount: 37,
    pricingStartingAt: 900,
    turnaroundDays: 4,
    portfolio: [
      { title: 'South Cut Portfolio', imageUrl: '/hero/fabric-charcoal.png', category: 'salwars', displayOrder: 1 },
      { title: 'Street Kurti Drape', imageUrl: '/hero/hero-street.png', category: 'salwars', displayOrder: 2 },
      { title: 'Beige Casual Suit', imageUrl: '/hero/fabric-beige.png', category: 'salwars', displayOrder: 3 },
    ],
  },
  {
    publicId: 't10',
    phoneNumber: '+919000000010',
    email: 'leelabanerjee@gmail.com',
    password: 'leelabanerjee',
    fullName: 'Leela Banerjee',
    shopName: 'Banerjee Looms',
    yearsOfExperience: 13,
    city: 'Mumbai',
    shopAddress: '56 Dadar TT Circle, Mumbai, Maharashtra',
    directoryImageUrl: '/hero/fabric-beige.png',
    specialties: ['Kanjeevaram sarees', 'Fall & pico', 'Banarasi', 'Saree finishing'],
    rating: 4.7,
    reviewCount: 55,
    pricingStartingAt: 1100,
    turnaroundDays: 5,
    portfolio: [
      { title: 'Banerjee Looms Portfolio', imageUrl: '/hero/fabric-beige.png', category: 'sarees', displayOrder: 1 },
      { title: 'Charcoal Silk Finish', imageUrl: '/hero/fabric-charcoal.png', category: 'sarees', displayOrder: 2 },
      { title: 'Heritage Saree Look', imageUrl: '/hero/hero-couple.png', category: 'sarees', displayOrder: 3 },
    ],
  },
];

export const SEED_CUSTOMERS = [
  {
    phoneNumber: '+919876543210',
    email: 'customer@thy.local',
    password: 'customer123',
    fullName: 'Priya Sharma',
    city: 'Bengaluru',
    address: '42 Indiranagar 12th Main, Bengaluru, Karnataka',
    preferences: {
      shoppingFor: 'Myself',
      contactMethod: 'WhatsApp',
      services: ['Bespoke Stitching', 'Alterations'],
      garmentTypes: ['sarees', 'salwars'],
    },
    measurements: [
      {
        label: 'Standard Saree Blouse',
        category: 'sarees',
        unit: 'inch',
        values: {
          bust: 36,
          waist: 30,
          shoulder: 14.5,
          armhole: 16,
          frontNeckDepth: 7,
          backNeckDepth: 9,
          sleeveLength: 10,
        },
        notes: 'Fitted padded blouse with back hooks',
        isDefault: true,
      },
      {
        label: 'Anarkali & Salwar Suit',
        category: 'salwars',
        unit: 'inch',
        values: {
          bust: 36,
          waist: 31,
          hip: 39,
          shoulder: 15,
          length: 44,
          sleeveLength: 18,
        },
        notes: 'Comfortable knee-length fit',
        isDefault: false,
      },
    ],
  },
];

export const SEED_ADMINS = [
  {
    phoneNumber: '+919876543219',
    email: 'admin@thy.local',
    password: 'admin123',
    fullName: 'THY Admin',
  },
];

export async function seedDatabase() {
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
    const passwordHash = await hashPassword(t.password);

    // Find or create / update User
    let user = await User.findOne({
      $or: [{ phoneNumber: t.phoneNumber }, { email: t.email }],
    });

    if (!user) {
      user = await User.create({
        phoneNumber: t.phoneNumber,
        email: t.email,
        name: t.fullName,
        role: 'tailor',
        authProvider: 'phone',
        passwordHash,
        hasPassword: true,
        isActive: true,
      });
    } else {
      user.name = t.fullName;
      user.email = t.email;
      user.role = 'tailor';
      user.passwordHash = passwordHash;
      user.hasPassword = true;
      user.isActive = true;
      await user.save();
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

  // 4. Seed Demo Customers & Measurements
  console.log('👗 Seeding Demo Customers & Saved Measurements...');
  for (const c of SEED_CUSTOMERS) {
    const passwordHash = await hashPassword(c.password);

    let customerUser = await User.findOne({
      $or: [{ phoneNumber: c.phoneNumber }, { email: c.email }],
    });

    if (!customerUser) {
      customerUser = await User.create({
        phoneNumber: c.phoneNumber,
        email: c.email,
        name: c.fullName,
        role: 'customer',
        authProvider: 'phone',
        passwordHash,
        hasPassword: true,
        isActive: true,
      });
    } else {
      customerUser.name = c.fullName;
      customerUser.email = c.email;
      customerUser.role = 'customer';
      customerUser.passwordHash = passwordHash;
      customerUser.hasPassword = true;
      customerUser.isActive = true;
      await customerUser.save();
    }

    await CustomerProfile.findOneAndUpdate(
      { userId: customerUser._id },
      {
        $set: {
          fullName: c.fullName,
          email: c.email,
          city: c.city,
          preferences: c.preferences,
          addresses: [
            {
              label: 'Home',
              addressLine1: c.address,
              city: c.city,
              isDefault: true,
            },
          ],
        },
      },
      { upsert: true, new: true }
    );

    // Upsert Customer Measurements
    for (const m of c.measurements) {
      await CustomerMeasurement.findOneAndUpdate(
        { userId: customerUser._id, label: m.label },
        {
          $set: {
            userId: customerUser._id,
            label: m.label,
            category: m.category,
            unit: m.unit,
            values: m.values,
            notes: m.notes,
            isDefault: m.isDefault,
          },
        },
        { upsert: true, new: true }
      );
    }
  }
  console.log(`✅ ${SEED_CUSTOMERS.length} Demo Customer(s) seeded.`);

  // 5. Seed Admins
  console.log('🛡️ Seeding Admin Users...');
  for (const a of SEED_ADMINS) {
    const passwordHash = await hashPassword(a.password);
    let adminUser = await User.findOne({
      $or: [{ phoneNumber: a.phoneNumber }, { email: a.email }],
    });

    if (!adminUser) {
      adminUser = await User.create({
        phoneNumber: a.phoneNumber,
        email: a.email,
        name: a.fullName,
        role: 'admin',
        authProvider: 'phone',
        passwordHash,
        hasPassword: true,
        isActive: true,
      });
    } else {
      adminUser.name = a.fullName;
      adminUser.email = a.email;
      adminUser.role = 'admin';
      adminUser.passwordHash = passwordHash;
      adminUser.hasPassword = true;
      adminUser.isActive = true;
      await adminUser.save();
    }
  }
  console.log(`✅ ${SEED_ADMINS.length} Admin(s) seeded.`);

  console.log('🎉 MongoDB Database construction & seeding completed successfully!');
  await disconnectMongo();
}

// Auto-execute if script is directly run
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('seed-mongo.ts')) {
  seedDatabase().catch((error) => {
    console.error('❌ Error seeding MongoDB database:', error);
    process.exit(1);
  });
}
