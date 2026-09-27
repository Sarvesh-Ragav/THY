import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectMongo, disconnectMongo } from './mongo.js';
import { KurtiDesign } from '../models/KurtiDesign.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to images in public/stylecraftdb/Kurti
const KURTI_DIR = path.resolve(__dirname, '../../../public/stylecraftdb/Kurti');

interface ParsedKurti {
  originalFileName: string;
  normalizedFileName: string;
  designCode: string;
  title: string;
  imageUrl: string;
  attributes: {
    neckline: string;
    sleeves: string;
    silhouette: string;
    length: string;
  };
  tags: string[];
}

function normalizeNeckline(raw: string): string {
  const clean = raw.toLowerCase().replace(/[-_]/g, ' ').trim();
  if (clean.includes('round')) return 'Round Neck';
  if (clean.includes('v neck') || clean.includes('v-neck')) return 'V-Neck';
  if (clean.includes('boat')) return 'Boat Neck';
  if (clean.includes('square')) return 'Square Neck';
  if (clean.includes('collar')) return 'Collar Neck';
  return raw;
}

function normalizeSleeves(raw: string): string {
  const clean = raw.toLowerCase().replace(/[-_]/g, ' ').trim();
  if (clean.includes('3 4') || clean.includes('3/4') || clean.includes('3_4th')) return '3/4th Sleeve';
  if (clean.includes('elbow')) return 'Elbow Sleeve';
  if (clean.includes('full')) return 'Full Sleeve';
  if (clean.includes('short')) return 'Short Sleeve';
  if (clean.includes('sleeveless')) return 'Sleeveless';
  return raw;
}

function normalizeSilhouette(raw: string): string {
  const clean = raw.toLowerCase().replace(/[-_]/g, ' ').trim();
  if (clean.includes('anarkali')) return 'Anarkali';
  if (clean.includes('princess') || clean.includes('princesscut')) return 'Princess Cut';
  if (clean.includes('straight')) return 'Straight';
  if (clean.includes('a line') || clean.includes('a-line')) return 'A-Line';
  if (clean.includes('flared')) return 'Flared';
  return raw;
}

function normalizeLength(raw: string): string {
  const clean = raw.toLowerCase().replace(/[-_]/g, ' ').trim();
  if (clean.includes('calf') || clean.includes('calflength')) return 'Calf Length';
  if (clean.includes('knee') || clean.includes('kneelength')) return 'Knee Length';
  if (clean.includes('full') || clean.includes('fulllength')) return 'Full Length';
  if (clean.includes('short')) return 'Short';
  return raw;
}

export function parseKurtiFilename(fileName: string): ParsedKurti | null {
  if (!fileName.toLowerCase().endsWith('.png')) return null;

  // Normalize any trailing spaces/underscores before .png (e.g., "Roundneck_..._calflength _.png")
  const baseNameWithoutExt = fileName.replace(/\.png$/i, '').trim().replace(/[_ ]+$/, '');
  const normalizedFileName = `${baseNameWithoutExt}.png`;

  // Split by underscore delimiter
  const parts = baseNameWithoutExt.split('_').filter(Boolean);

  if (parts.length < 4) {
    console.warn(`[seed-kurti] Unexpected filename format: ${fileName}`);
    return null;
  }

  const rawNeckline = parts[0];
  // Sleeve may be parts[1] (e.g. "3" and parts[2] "4thsleeve" or "3_4thsleeve" or "elbowsleeve")
  let rawSleeve = '';
  let rawSilhouette = '';
  let rawLength = '';

  if (parts.length === 4) {
    rawSleeve = parts[1];
    rawSilhouette = parts[2];
    rawLength = parts[3];
  } else if (parts.length === 5) {
    // e.g. ["Roundneck", "3", "4thsleeve", "Anarkali", "calflength"]
    if (parts[1] === '3' && (parts[2].startsWith('4') || parts[2].includes('sleeve'))) {
      rawSleeve = `${parts[1]}_${parts[2]}`;
      rawSilhouette = parts[3];
      rawLength = parts[4];
    } else {
      rawSleeve = parts[1];
      rawSilhouette = `${parts[2]}_${parts[3]}`;
      rawLength = parts[4];
    }
  } else if (parts.length >= 6) {
    rawSleeve = `${parts[1]}_${parts[2]}`;
    rawSilhouette = parts[3];
    rawLength = parts[4];
  }

  const neckline = normalizeNeckline(rawNeckline);
  const sleeves = normalizeSleeves(rawSleeve);
  const silhouette = normalizeSilhouette(rawSilhouette);
  const length = normalizeLength(rawLength);

  const designCode = `kurti-${neckline}-${sleeves}-${silhouette}-${length}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

  const title = `${neckline} ${sleeves} ${silhouette} Kurti (${length})`;
  const imageUrl = `/stylecraftdb/Kurti/${encodeURIComponent(normalizedFileName)}`;

  const tags = [
    'kurti',
    neckline.toLowerCase(),
    sleeves.toLowerCase(),
    silhouette.toLowerCase(),
    length.toLowerCase(),
  ];

  return {
    originalFileName: fileName,
    normalizedFileName,
    designCode,
    title,
    imageUrl,
    attributes: {
      neckline,
      sleeves,
      silhouette,
      length,
    },
    tags,
  };
}

export async function seedKurtiDesigns() {
  console.log('👗 Starting Kurti Design Seed from:', KURTI_DIR);

  if (!fs.existsSync(KURTI_DIR)) {
    throw new Error(`Directory not found: ${KURTI_DIR}`);
  }

  const files = fs.readdirSync(KURTI_DIR);
  console.log(`📁 Found ${files.length} files in directory.`);

  const parsedItems: ParsedKurti[] = [];

  for (const file of files) {
    const parsed = parseKurtiFilename(file);
    if (parsed) {
      // If the filename had trailing spaces/underscores, rename the file to clean normalized name
      if (parsed.originalFileName !== parsed.normalizedFileName) {
        const oldPath = path.join(KURTI_DIR, parsed.originalFileName);
        const newPath = path.join(KURTI_DIR, parsed.normalizedFileName);
        if (!fs.existsSync(newPath)) {
          fs.renameSync(oldPath, newPath);
          console.log(`  ↪ Renamed: "${parsed.originalFileName}" -> "${parsed.normalizedFileName}"`);
        }
      }
      parsedItems.push(parsed);
    }
  }

  console.log(`✨ Successfully parsed ${parsedItems.length} Kurti designs.`);

  await connectMongo();

  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < parsedItems.length; i++) {
    const item = parsedItems[i];
    const result = await KurtiDesign.findOneAndUpdate(
      { designCode: item.designCode },
      {
        $set: {
          designCode: item.designCode,
          garmentType: 'kurti',
          title: item.title,
          imageUrl: item.imageUrl,
          attributes: item.attributes,
          tags: item.tags,
          displayOrder: i + 1,
          isActive: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (result.isNew) {
      insertedCount++;
    } else {
      updatedCount++;
    }
  }

  const totalInDb = await KurtiDesign.countDocuments({ garmentType: 'kurti' });
  console.log(`🎉 Kurti Design Seed complete! Total in DB: ${totalInDb} (Processed: ${parsedItems.length})`);
}

// If invoked directly from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedKurtiDesigns()
    .then(async () => {
      await disconnectMongo();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('❌ Failed to seed Kurti designs:', err);
      await disconnectMongo();
      process.exit(1);
    });
}
