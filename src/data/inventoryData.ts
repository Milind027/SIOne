export interface InventoryItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'Dairy & Milk' | 'Vegetables' | 'Grains & Staples' | 'Oils & Fats';
  currentStock: number;
  unit: string;
  minThreshold: number;
  costPerUnit: number;
  lastRestocked: string;
}

export const INITIAL_INVENTORY: InventoryItem[] = [
  // 1. Paneer (From SiOne demo: 2 kg - Low Stock Alert!)
  {
    id: 'ing_paneer',
    name: 'Fresh Malai Paneer',
    hindiName: 'पनीर',
    category: 'Dairy & Milk',
    currentStock: 2, // 2 kg
    unit: 'kg',
    minThreshold: 5,
    costPerUnit: 340,
    lastRestocked: 'Today, 07:30 AM',
  },
  // 2. Tomato (From SiOne demo: 9 kg)
  {
    id: 'ing_tomato',
    name: 'Roma Tomatoes',
    hindiName: 'टमाटर',
    category: 'Vegetables',
    currentStock: 9, // 9 kg
    unit: 'kg',
    minThreshold: 4,
    costPerUnit: 35,
    lastRestocked: 'Yesterday',
  },
  // 3. Milk (From SiOne demo: 18 L)
  {
    id: 'ing_curd_milk',
    name: 'Whole Buffalo Milk & Curd',
    hindiName: 'दूध',
    category: 'Dairy & Milk',
    currentStock: 18, // 18 L
    unit: 'L',
    minThreshold: 8,
    costPerUnit: 64,
    lastRestocked: 'Today, 06:00 AM',
  },
  // 4. Basmati Rice (From SiOne demo: 25 kg)
  {
    id: 'ing_basmati',
    name: 'Aged Basmati Rice',
    hindiName: 'बासमती',
    category: 'Grains & Staples',
    currentStock: 25, // 25 kg
    unit: 'kg',
    minThreshold: 10,
    costPerUnit: 110,
    lastRestocked: '3 days ago',
  },
  // 5. Cooking Oil (From SiOne demo: 12 L)
  {
    id: 'ing_oil',
    name: 'Refined Mustard & Sunflower Oil',
    hindiName: 'तेल',
    category: 'Oils & Fats',
    currentStock: 12, // 12 L
    unit: 'L',
    minThreshold: 5,
    costPerUnit: 145,
    lastRestocked: '2 days ago',
  },
  // 6. Flour for Naan & Roti
  {
    id: 'ing_flour',
    name: 'Tandoori Atta & Maida',
    hindiName: 'मैदा / आटा',
    category: 'Grains & Staples',
    currentStock: 40,
    unit: 'kg',
    minThreshold: 15,
    costPerUnit: 38,
    lastRestocked: 'Yesterday',
  },
];

export const INVENTORY_CATEGORY_TRANSLATIONS: Record<string, string> = {
  'Dairy & Milk': 'डेयरी व दूध',
  'Vegetables': 'सब्जियां',
  'Grains & Staples': 'अनाज व राशन',
  'Oils & Fats': 'तेल व घी',
};
