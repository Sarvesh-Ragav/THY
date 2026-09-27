import type { GarmentCustomizationDetails } from '@/lib/studio-draft';

export interface CustomOptionGroup {
  id: keyof GarmentCustomizationDetails;
  title: string;
  hint: string;
  required: boolean;
  options: string[];
}

const kurtiGroups: CustomOptionGroup[] = [
  {
    id: 'neckline',
    title: 'Neckline',
    hint: 'Select one neckline for the kurti.',
    required: true,
    options: ['Round Neck', 'V-Neck'],
  },
  {
    id: 'sleeves',
    title: 'Sleeves',
    hint: 'Select one sleeve style.',
    required: true,
    options: ['Sleeveless', 'Short Sleeve', 'Elbow Sleeve', '3/4th Sleeve', 'Full Sleeve'],
  },
  {
    id: 'length',
    title: 'Length',
    hint: 'Choose the overall kurti length.',
    required: true,
    options: ['Short', 'Knee Length', 'Calf Length', 'Full Length'],
  },
  {
    id: 'silhouette',
    title: 'Fit & silhouette',
    hint: 'Choose how the kurti should fall.',
    required: true,
    options: ['Straight', 'A-Line', 'Anarkali', 'Princess Cut'],
  },
  {
    id: 'sideSlit',
    title: 'Side slit',
    hint: 'Additional details for this garment.',
    required: false,
    options: ['Side Slit', 'No Slit'],
  },
  {
    id: 'hemStyle',
    title: 'Hem style',
    hint: 'How the hem should finish.',
    required: false,
    options: ['Straight Hem', 'Rounded Hem'],
  },
];

const GROUPS: Record<string, CustomOptionGroup[]> = {
  kurti: kurtiGroups,
  blouse: [
    {
      id: 'neckline',
      title: 'Neckline',
      hint: 'Select one neckline for the blouse.',
      required: true,
      options: ['Round Neck', 'V-Neck', 'Boat Neck', 'Square', 'Sweetheart'],
    },
    {
      id: 'sleeves',
      title: 'Sleeves',
      hint: 'Select one sleeve style.',
      required: true,
      options: ['Sleeveless', 'Cap Sleeve', 'Elbow Sleeve', 'Full Sleeve'],
    },
    {
      id: 'frontStyle',
      title: 'Back',
      hint: 'Choose the blouse back.',
      required: true,
      options: ['Closed Back', 'Deep Back', 'Tie Back', 'Boat Back'],
    },
    {
      id: 'fit',
      title: 'Fit',
      hint: 'Choose how closely it should fit.',
      required: true,
      options: ['Fitted', 'Comfort', 'Padded'],
    },
  ],
  'salwar-suit': [
    {
      id: 'neckline',
      title: 'Neckline',
      hint: 'Select one neckline for the suit.',
      required: true,
      options: ['Round Neck', 'V-Neck', 'Boat Neck', 'Collar', 'Keyhole'],
    },
    {
      id: 'sleeves',
      title: 'Sleeves',
      hint: 'Select one sleeve style.',
      required: true,
      options: ['Sleeveless', 'Short Sleeve', 'Elbow Sleeve', 'Full Sleeve'],
    },
    {
      id: 'length',
      title: 'Length',
      hint: 'Choose the kameez length.',
      required: true,
      options: ['Short', 'Knee Length', 'Calf Length', 'Full Length'],
    },
    {
      id: 'silhouette',
      title: 'Bottom',
      hint: 'Choose the bottom style.',
      required: true,
      options: ['Salwar', 'Churidar', 'Palazzo', 'Straight Pant'],
    },
  ],
  frock: [
    {
      id: 'neckline',
      title: 'Neckline',
      hint: 'Select one neckline.',
      required: true,
      options: ['Round Neck', 'V-Neck', 'Square', 'Boat Neck'],
    },
    {
      id: 'sleeves',
      title: 'Sleeves',
      hint: 'Select one sleeve style.',
      required: true,
      options: ['Sleeveless', 'Short Sleeve', 'Puff Sleeve', 'Full Sleeve'],
    },
    {
      id: 'length',
      title: 'Length',
      hint: 'Choose the frock length.',
      required: true,
      options: ['Above Knee', 'Knee Length', 'Calf Length', 'Ankle Length'],
    },
    {
      id: 'silhouette',
      title: 'Fit & silhouette',
      hint: 'Choose how the frock should fall.',
      required: true,
      options: ['A-Line', 'Flared', 'Fit and Flare', 'Straight'],
    },
  ],
  top: [
    {
      id: 'neckline',
      title: 'Neckline',
      hint: 'Select one neckline.',
      required: true,
      options: ['Round Neck', 'V-Neck', 'Boat Neck', 'Collar', 'Square'],
    },
    {
      id: 'sleeves',
      title: 'Sleeves',
      hint: 'Select one sleeve style.',
      required: true,
      options: ['Sleeveless', 'Short Sleeve', 'Elbow Sleeve', 'Full Sleeve'],
    },
    {
      id: 'length',
      title: 'Length',
      hint: 'Choose the top length.',
      required: true,
      options: ['Crop', 'Waist', 'Hip', 'Long'],
    },
    {
      id: 'fit',
      title: 'Fit',
      hint: 'Choose the fit.',
      required: true,
      options: ['Fitted', 'Regular', 'Relaxed', 'Oversized'],
    },
  ],
  'boys-shirt': [
    {
      id: 'neckline',
      title: 'Collar',
      hint: 'Select one collar.',
      required: true,
      options: ['Classic Collar', 'Band Collar', 'Mandarin', 'Open Collar'],
    },
    {
      id: 'sleeves',
      title: 'Sleeves',
      hint: 'Select one sleeve style.',
      required: true,
      options: ['Half Sleeve', 'Full Sleeve', 'Roll-up Sleeve'],
    },
    {
      id: 'fit',
      title: 'Fit',
      hint: 'Choose the shirt fit.',
      required: true,
      options: ['Slim', 'Regular', 'Relaxed'],
    },
    {
      id: 'frontStyle',
      title: 'Front',
      hint: 'Choose the front finish.',
      required: true,
      options: ['Button Down', 'Hidden Placket', 'Half Placket'],
    },
  ],
  'boys-blazer': [
    {
      id: 'neckline',
      title: 'Lapel',
      hint: 'Select one lapel.',
      required: true,
      options: ['Notch Lapel', 'Shawl Lapel', 'Peak Lapel', 'Band Collar'],
    },
    {
      id: 'sleeves',
      title: 'Sleeves',
      hint: 'Select the sleeve finish.',
      required: true,
      options: ['Standard', 'Functional Button', 'No Button'],
    },
    {
      id: 'length',
      title: 'Length',
      hint: 'Choose the blazer length.',
      required: true,
      options: ['Waist', 'Hip', 'Long'],
    },
    {
      id: 'fit',
      title: 'Fit',
      hint: 'Choose the blazer fit.',
      required: true,
      options: ['Slim', 'Tailored', 'Relaxed'],
    },
  ],
  'boys-kurta': [
    {
      id: 'neckline',
      title: 'Neckline',
      hint: 'Select one neckline.',
      required: true,
      options: ['Band Collar', 'Mandarin', 'Round Neck', 'V-Neck'],
    },
    {
      id: 'sleeves',
      title: 'Sleeves',
      hint: 'Select one sleeve style.',
      required: true,
      options: ['Half Sleeve', 'Full Sleeve', 'Sleeveless'],
    },
    {
      id: 'length',
      title: 'Length',
      hint: 'Choose the kurta length.',
      required: true,
      options: ['Short', 'Knee Length', 'Calf Length', 'Ankle Length'],
    },
    {
      id: 'silhouette',
      title: 'Fit & silhouette',
      hint: 'Choose how the kurta should fall.',
      required: true,
      options: ['Straight', 'A-Line', 'Pathani', 'Fitted'],
    },
  ],
  'boys-sherwani': [
    {
      id: 'neckline',
      title: 'Neckline',
      hint: 'Select one neckline.',
      required: true,
      options: ['Bandhgala', 'Mandarin', 'Shawl Collar', 'Open Front'],
    },
    {
      id: 'sleeves',
      title: 'Sleeves',
      hint: 'Select one sleeve style.',
      required: true,
      options: ['Full Sleeve', 'Three-Quarter', 'Cutwork Sleeve'],
    },
    {
      id: 'length',
      title: 'Length',
      hint: 'Choose the sherwani length.',
      required: true,
      options: ['Knee Length', 'Calf Length', 'Ankle Length'],
    },
    {
      id: 'frontStyle',
      title: 'Front',
      hint: 'Choose the front detail.',
      required: true,
      options: ['Button Front', 'Concealed Placket', 'Asymmetric'],
    },
  ],
  'boys-pant': [
    {
      id: 'fit',
      title: 'Fit',
      hint: 'Choose the pant fit.',
      required: true,
      options: ['Slim', 'Regular', 'Relaxed', 'Tapered'],
    },
    {
      id: 'length',
      title: 'Length',
      hint: 'Choose the pant length.',
      required: true,
      options: ['Ankle', 'Full Length', 'Cropped'],
    },
    {
      id: 'frontStyle',
      title: 'Front',
      hint: 'Choose the front style.',
      required: true,
      options: ['Flat Front', 'Single Pleat', 'Double Pleat'],
    },
    {
      id: 'hemStyle',
      title: 'Hem',
      hint: 'Choose the hem finish.',
      required: true,
      options: ['Plain Hem', 'Cuff', 'Turn-up'],
    },
  ],
};

export function customizationGroups(garmentId?: string | null): CustomOptionGroup[] {
  if (garmentId && GROUPS[garmentId]) return GROUPS[garmentId];
  return kurtiGroups;
}

export function requiredCustomizationCount(groups: CustomOptionGroup[]) {
  return groups.filter((group) => group.required).length;
}

export function completedCustomizationCount(
  groups: CustomOptionGroup[],
  details: GarmentCustomizationDetails
) {
  return groups.filter((group) => group.required && Boolean(details[group.id])).length;
}
