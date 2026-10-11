export interface LiabilityItem {
  id: string;
  title: string;
  hindiTitle: string;
  source: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'due_soon' | 'paid';
}

export interface AssetItem {
  id: string;
  title: string;
  hindiTitle: string;
  quantity: number;
  valuation: number;
  purchaseDate: string;
}

export const INITIAL_LIABILITIES: LiabilityItem[] = [
  {
    id: 'liab_1',
    title: 'Kirana Store Credit',
    hindiTitle: 'उधार खाता (किराना स्टोर)',
    source: 'Goyal Provisions',
    amount: 3500,
    dueDate: 'This week',
    status: 'pending',
  },
  {
    id: 'liab_2',
    title: 'Vegetable Supplier Bill #218',
    hindiTitle: 'सब्जी सप्लायर (इनवॉइस #218)',
    source: 'Mandi Trader 18',
    amount: 4200,
    dueDate: 'In 2 days',
    status: 'due_soon',
  },
  {
    id: 'liab_3',
    title: 'Commercial Electricity Bill',
    hindiTitle: 'बिजली बिल (अक्टूबर)',
    source: 'BESCOM',
    amount: 6100,
    dueDate: 'Due on 18th',
    status: 'pending',
  },
];

export const INITIAL_ASSETS: AssetItem[] = [
  {
    id: 'asset_1',
    title: 'Heavy Clay Tandoor Drum',
    hindiTitle: 'तंदूर भट्टी',
    quantity: 1,
    valuation: 85000,
    purchaseDate: 'Nov 2025',
  },
  {
    id: 'asset_2',
    title: 'Commercial Deep Freezer 500L',
    hindiTitle: 'डीप फ्रीज़र',
    quantity: 1,
    valuation: 42000,
    purchaseDate: 'Dec 2025',
  },
  {
    id: 'asset_3',
    title: 'SiOne Smart POS Tablets',
    hindiTitle: 'POS टैबलेट',
    quantity: 2,
    valuation: 36000,
    purchaseDate: 'Jan 2026',
  },
  {
    id: 'asset_4',
    title: 'Solid Teak Dining Tables & Chairs',
    hindiTitle: 'टेबल-कुर्सियां',
    quantity: 12,
    valuation: 60000,
    purchaseDate: 'Jan 2026',
  },
];

// Exact Hourly Analytics shown in SiOne demo video (timestamp 01:00)
export interface HourlySalePoint {
  hour: string; // e.g. "12 PM", "1 PM", ..., "8 PM - 10 PM Peak"
  revenue: number;
  orders: number;
  isPeak?: boolean;
}

export const HOURLY_SALES_DATA: HourlySalePoint[] = [
  { hour: '11 AM', revenue: 1450, orders: 4 },
  { hour: '12 PM', revenue: 3800, orders: 12 },
  { hour: '1 PM', revenue: 5900, orders: 19 },
  { hour: '2 PM', revenue: 4200, orders: 14 },
  { hour: '3 PM', revenue: 1800, orders: 6 },
  { hour: '4 PM', revenue: 1200, orders: 4 },
  { hour: '5 PM', revenue: 2100, orders: 8 },
  { hour: '6 PM', revenue: 3900, orders: 15 },
  { hour: '7 PM', revenue: 6400, orders: 22 },
  { hour: '8 PM', revenue: 8900, orders: 34, isPeak: true },
  { hour: '9 PM', revenue: 9800, orders: 38, isPeak: true },
  { hour: '10 PM', revenue: 8800, orders: 32, isPeak: true },
];
