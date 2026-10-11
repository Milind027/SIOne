export type OrderStatus = 'received' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  hindiName?: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  notes?: string;
  selectedOptions?: string[];
}

export interface RestaurantOrder {
  id: string;
  orderNumber: string; // e.g. SIONE-107
  tableNumber: number;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  taxes: number; // 5% GST
  serviceCharge: number; // 5%
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMode?: 'UPI' | 'Card' | 'Cash' | 'WhatsApp';
  placedAt: string;
  prepTimeMinutes: number;
  notes?: string;
  isRushHourSample?: boolean;
}

export const INITIAL_ORDERS: RestaurantOrder[] = [
  // Exact order from video (timestamp 00:23 / 00:38: Table 7 - Paneer Tikka x1, Butter Naan x2)
  {
    id: 'ord_701',
    orderNumber: 'TC-701',
    tableNumber: 7,
    customerName: 'Rohan Sharma',
    customerPhone: '+91 98204 77120',
    items: [
      {
        id: 'oi_1',
        menuItemId: 'sione_1',
        name: 'Paneer Tikka',
        hindiName: 'पनीर टिक्का',
        price: 280,
        quantity: 1,
        isVeg: true,
      },
      {
        id: 'oi_2',
        menuItemId: 'sione_3',
        name: 'Butter Naan',
        hindiName: 'बटर नान',
        price: 60,
        quantity: 2,
        isVeg: true,
      },
      {
        id: 'oi_3',
        menuItemId: 'sione_6',
        name: 'Masala Chaas',
        hindiName: 'मसाला छाछ',
        price: 50,
        quantity: 1,
        isVeg: true,
      },
    ],
    subtotal: 450,
    discount: 0,
    taxes: 22.5,
    serviceCharge: 22.5,
    totalAmount: 450, // clean ₹450 as seen on video timestamp 00:27
    status: 'preparing',
    paymentStatus: 'pending',
    paymentMode: 'WhatsApp',
    placedAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    prepTimeMinutes: 12,
    notes: 'Serve Butter Naan hot & crisp',
  },
  {
    id: 'ord_702',
    orderNumber: 'TC-702',
    tableNumber: 2,
    customerName: 'Aarav Gupta',
    customerPhone: '+91 98450 11920',
    items: [
      {
        id: 'oi_4',
        menuItemId: 'sione_2',
        name: 'Dal Makhani',
        hindiName: 'दाल मखनी',
        price: 240,
        quantity: 1,
        isVeg: true,
      },
      {
        id: 'oi_5',
        menuItemId: 'sione_4',
        name: 'Dum Veg Biryani',
        hindiName: 'वेज बिरयानी',
        price: 220,
        quantity: 1,
        isVeg: true,
      },
    ],
    subtotal: 460,
    discount: 50,
    couponCode: 'SIONE50',
    taxes: 20.5,
    serviceCharge: 20.5,
    totalAmount: 451,
    status: 'ready',
    paymentStatus: 'paid',
    paymentMode: 'UPI',
    placedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    prepTimeMinutes: 14,
  },
  {
    id: 'ord_703',
    orderNumber: 'TC-703',
    tableNumber: 5,
    customerName: 'Priya Mehta',
    customerPhone: '+91 98450 62104',
    items: [
      {
        id: 'oi_6',
        menuItemId: 'sione_5',
        name: 'Alphonso Mango Lassi',
        hindiName: 'मैंगो लस्सी',
        price: 120,
        quantity: 2,
        isVeg: true,
      },
      {
        id: 'oi_7',
        menuItemId: 'sione_7',
        name: 'Kewra Gulab Jamun (2 pcs)',
        hindiName: 'गुलाब जामुन',
        price: 90,
        quantity: 1,
        isVeg: true,
      },
    ],
    subtotal: 330,
    discount: 0,
    taxes: 16.5,
    serviceCharge: 16.5,
    totalAmount: 363,
    status: 'received',
    paymentStatus: 'pending',
    placedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    prepTimeMinutes: 8,
  },
];

export interface PastOrderRecord {
  id: string;
  orderNumber: string;
  dateStr: string;
  hindiDateStr?: string;
  daysAgo: number;
  outletName: string;
  itemsSummary: string;
  hindiItemsSummary?: string;
  totalAmount: number;
  status: string;
  hindiStatus?: string;
  isOlderThanMonth: boolean;
}

export const PAST_ORDER_HISTORY: PastOrderRecord[] = [
  {
    id: 'past_1',
    orderNumber: 'SIONE-094',
    dateStr: 'Yesterday, 8:40 PM',
    hindiDateStr: 'कल, 8:40 PM',
    daysAgo: 1,
    outletName: 'SiOne Bistro & Kitchen',
    itemsSummary: '1x Paneer Tikka, 2x Butter Naan, 1x Masala Chaas',
    hindiItemsSummary: '1x पनीर टिक्का, 2x बटर नान, 1x मसाला छाछ',
    totalAmount: 450,
    status: 'Delivered to Table 7',
    hindiStatus: 'Table 7 पे सर्व हुआ',
    isOlderThanMonth: false,
  },
  {
    id: 'past_2',
    orderNumber: 'SIONE-082',
    dateStr: '4 days ago, 9:15 PM',
    hindiDateStr: '4 दिन पहले, 9:15 PM',
    daysAgo: 4,
    outletName: 'SiOne Bistro & Kitchen',
    itemsSummary: '1x Dal Makhani, 1x Dum Veg Biryani',
    hindiItemsSummary: '1x दाल मखनी, 1x वेज बिरयानी',
    totalAmount: 460,
    status: 'Delivered to Table 2',
    hindiStatus: 'Table 2 पे सर्व हुआ',
    isOlderThanMonth: false,
  },
  {
    id: 'past_3',
    orderNumber: 'SIONE-061',
    dateStr: '16 days ago, 1:20 PM',
    hindiDateStr: '16 दिन पहले, 1:20 PM',
    daysAgo: 16,
    outletName: 'SiOne Bistro & Kitchen',
    itemsSummary: '2x Mango Lassi, 1x Gulab Jamun',
    hindiItemsSummary: '2x मैंगो लस्सी, 1x गुलाब जामुन',
    totalAmount: 330,
    status: 'Delivered to Table 5',
    hindiStatus: 'Table 5 पे सर्व हुआ',
    isOlderThanMonth: false,
  },
  // Older orders > 30 days (locked for Starter, shows "Unlock with Premium")
  {
    id: 'past_old_1',
    orderNumber: 'SIONE-039',
    dateStr: '44 days ago, 8:30 PM',
    hindiDateStr: '44 दिन पहले, 8:30 PM',
    daysAgo: 44,
    outletName: 'SiOne Bistro & Kitchen',
    itemsSummary: 'Grand Family Feast & Tandoori Platter',
    hindiItemsSummary: 'तंदूरी प्लेटर व फैमिली फीस्ट',
    totalAmount: 2890,
    status: 'Archived Record',
    hindiStatus: 'पुराना आर्काइव',
    isOlderThanMonth: true,
  },
  {
    id: 'past_old_2',
    orderNumber: 'SIONE-018',
    dateStr: '72 days ago, 7:50 PM',
    hindiDateStr: '72 दिन पहले, 7:50 PM',
    daysAgo: 72,
    outletName: 'SiOne Bistro & Kitchen',
    itemsSummary: 'Chef Special Thali Banquet',
    hindiItemsSummary: 'शेफ स्पेशल थाली बैंक्वेट',
    totalAmount: 3450,
    status: 'Archived Record',
    hindiStatus: 'पुराना आर्काइव',
    isOlderThanMonth: true,
  },
];
