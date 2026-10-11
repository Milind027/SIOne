export interface Coupon {
  code: string;
  title: string;
  hindiTitle: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  maxDiscount?: number;
  minOrderValue: number;
  description: string;
  hindiDescription: string;
  badge: string;
  hindiBadge: string;
  expiryText: string;
  hindiExpiryText: string;
}

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'WEEKEND20',
    title: 'FLAT 20% OFF',
    hindiTitle: 'इस वीकेंड 20% ऑफ',
    discountType: 'percentage',
    discountValue: 20,
    maxDiscount: 150,
    minOrderValue: 350,
    description: 'Get 20% discount on all food orders',
    hindiDescription: 'खाने के ऑर्डर पे फ्लैट 20% की छूट',
    badge: 'WEEKEND DEAL',
    hindiBadge: 'वीकेंड डील',
    expiryText: 'Valid till Sunday',
    hindiExpiryText: 'रविवार तक मान्य',
  },
  {
    code: 'RIYA100',
    title: '₹100 INSTANT DISCOUNT',
    hindiTitle: '₹100 तुरंत छूट',
    discountType: 'flat',
    discountValue: 100,
    minOrderValue: 450,
    description: 'Instant ₹100 discount with Riya referral pass',
    hindiDescription: 'रिया के रेफरल कोड से ₹100 की बचत',
    badge: 'REFERRAL PASS',
    hindiBadge: 'रेफरल पास',
    expiryText: 'Limited tables left',
    hindiExpiryText: 'सीमित टेबल्स उपलब्ध',
  },
  {
    code: 'SIONE50',
    title: '₹50 WELCOME PASS',
    hindiTitle: '₹50 वेलकम गिफ्ट',
    discountType: 'flat',
    discountValue: 50,
    minOrderValue: 200,
    description: 'Special ₹50 welcome discount for new diners',
    hindiDescription: 'नए ग्राहकों के लिए विशेष ₹50 छूट',
    badge: 'FIRST ORDER',
    hindiBadge: 'पहला ऑर्डर',
    expiryText: 'Valid on Table QR',
    hindiExpiryText: 'टेबल QR पे मान्य',
  },
];
