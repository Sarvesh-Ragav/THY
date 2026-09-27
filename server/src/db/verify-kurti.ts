import { connectMongo, disconnectMongo } from './mongo.js';
import { KurtiDesign } from '../models/KurtiDesign.js';

async function verify() {
  await connectMongo();
  const total = await KurtiDesign.countDocuments({ garmentType: 'kurti' });
  console.log(`\n========================================`);
  console.log(`👗 Verified Kurti Designs in MongoDB: ${total}`);
  console.log(`========================================\n`);

  const sample = await KurtiDesign.findOne({ 'attributes.silhouette': 'Anarkali' }).lean();
  console.log('Sample Document:', JSON.stringify(sample, null, 2));

  const silhouettes = await KurtiDesign.distinct('attributes.silhouette');
  const necklines = await KurtiDesign.distinct('attributes.neckline');
  const sleeves = await KurtiDesign.distinct('attributes.sleeves');
  const lengths = await KurtiDesign.distinct('attributes.length');

  console.log('\nDistinct Attributes indexed:');
  console.log('  Necklines:', necklines);
  console.log('  Sleeves:', sleeves);
  console.log('  Silhouettes:', silhouettes);
  console.log('  Lengths:', lengths);

  await disconnectMongo();
}

verify().catch(console.error);
