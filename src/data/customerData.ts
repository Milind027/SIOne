export interface CustomerProfile {
  id: string;
  name: string;
  hindiName?: string;
  phone: string;
  email: string;
  tier: 'Member' | 'Gold' | 'Platinum';
  points: number;
  stamps: number; // 0 to 10
  totalSpent: number;
  totalVisits: number;
  favoriteDish: string;
  joinedDate: string;
  referralCode: string;
  recentOrdersCount: number;
}

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  // Exact customer from SiOne video (timestamp 01:05)
  {
    id: 'cust_riya',
    name: 'Riya Shah',
    hindiName: 'रिया शाह',
    phone: '+91 98204 77120',
    email: 'riya.shah@example.com',
    tier: 'Member',
    points: 440, // 440 points from video
    stamps: 6,   // 6th visit from video
    totalSpent: 4890,
    totalVisits: 6,
    favoriteDish: 'Paneer Tikka & Butter Naan',
    joinedDate: '14 Dec 2025',
    referralCode: 'RIYA100',
    recentOrdersCount: 3,
  },
  // Exact customer from SiOne marketing video (timestamp 01:12)
  {
    id: 'cust_priya',
    name: 'Priya Mehta',
    hindiName: 'प्रिया मेहता',
    phone: '+91 98450 62104',
    email: 'priya.mehta@example.com',
    tier: 'Gold',
    points: 790,
    stamps: 9,
    totalSpent: 12450,
    totalVisits: 14,
    favoriteDish: 'Dal Makhani & Mango Lassi',
    joinedDate: '02 Nov 2025',
    referralCode: 'PRIYA20',
    recentOrdersCount: 5,
  },
  {
    id: 'cust_rohan',
    name: 'Rohan Verma',
    hindiName: 'रोहन वर्मा',
    phone: '+91 99203 88190',
    email: 'rohan.v@example.com',
    tier: 'Member',
    points: 210,
    stamps: 3,
    totalSpent: 2650,
    totalVisits: 3,
    favoriteDish: 'Dum Veg Biryani',
    joinedDate: '10 Jan 2026',
    referralCode: 'ROHAN50',
    recentOrdersCount: 2,
  },
];
