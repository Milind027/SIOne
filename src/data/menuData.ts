export interface MenuItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'Main Course & Tandoor' | 'Breads & Rice' | 'Beverages' | 'Desserts' | 'Starters & Quick Bites';
  price: number;
  originalPrice?: number;
  description: string;
  hindiDescription?: string;
  isVeg: boolean;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  isNew?: boolean;
  rating: number;
  ratingCount: number;
  prepTimeMinutes: number;
  calories?: number;
  customizations?: {
    spiceLevel?: boolean;
    cheeseOptions?: string[];
    portionSize?: string[];
  };
  ingredients: {
    ingredientId: string;
    amount: number;
  }[];
}

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // 1. Paneer Tikka (from SiOne video: पनीर टिक्का ₹280)
  {
    id: 'sione_1',
    name: 'Paneer Tikka',
    hindiName: 'पनीर टिक्का',
    category: 'Starters & Quick Bites',
    price: 280,
    originalPrice: 320,
    description: 'Charcoal clay-oven roasted malai paneer cubes marinated in rich hung curd, carom seeds, and mustard oil.',
    hindiDescription: 'तंदूर में भुने हुए मलाई पनीर के टुकड़े, गाढ़े दही, अजवाइन और सरसों के तेल में मैरीनेटेड।',
    isVeg: true,
    isBestseller: true,
    rating: 4.9,
    ratingCount: 340,
    prepTimeMinutes: 12,
    calories: 340,
    customizations: { spiceLevel: true, cheeseOptions: ['Standard Mint Chutney', 'Extra Malai Cream (+₹30)'] },
    ingredients: [
      { ingredientId: 'ing_paneer', amount: 200 }, // consumes from paneer stock (2kg)
      { ingredientId: 'ing_curd_milk', amount: 80 },
      { ingredientId: 'ing_oil', amount: 20 },
    ],
  },

  // 2. Dal Makhani (from SiOne video: दाल मखनी ₹240)
  {
    id: 'sione_2',
    name: 'Dal Makhani',
    hindiName: 'दाल मखनी',
    category: 'Main Course & Tandoor',
    price: 240,
    originalPrice: 280,
    description: 'Overnight slow-simmered black urad lentils infused with smoked Roma tomatoes, butter, and rich dairy cream.',
    hindiDescription: 'रात भर धीमी आंच पे पकी काली उड़द दाल, मक्खन, ताज़ी मलाई और टमाटर की महकदार ग्रेवी।',
    isVeg: true,
    isBestseller: true,
    rating: 4.9,
    ratingCount: 420,
    prepTimeMinutes: 10,
    calories: 410,
    customizations: { spiceLevel: true },
    ingredients: [
      { ingredientId: 'ing_tomato', amount: 150 }, // consumes from tomato stock
      { ingredientId: 'ing_curd_milk', amount: 60 },
      { ingredientId: 'ing_oil', amount: 25 },
    ],
  },

  // 3. Butter Naan (from SiOne video: बटर नान ₹60)
  {
    id: 'sione_3',
    name: 'Butter Naan',
    hindiName: 'बटर नान',
    category: 'Breads & Rice',
    price: 60,
    description: 'Tandoor blistered sourdough flatbread brushed generously with golden salted butter.',
    hindiDescription: 'तंदूर की गरमा-गरम फूली हुई नान, जिसपे अमूल बटर की खुशबूदार परत लगी है।',
    isVeg: true,
    rating: 4.8,
    ratingCount: 580,
    prepTimeMinutes: 6,
    calories: 180,
    ingredients: [
      { ingredientId: 'ing_flour', amount: 120 },
      { ingredientId: 'ing_curd_milk', amount: 30 },
    ],
  },

  // 4. Veg Biryani (from SiOne video: वेज बिरयानी ₹220)
  {
    id: 'sione_4',
    name: 'Dum Veg Biryani',
    hindiName: 'वेज बिरयानी',
    category: 'Breads & Rice',
    price: 220,
    description: 'Fragrant aged Daawat basmati rice layered with garden vegetables, saffron milk, and fresh brown onions.',
    hindiDescription: 'पुराने बासमती चावल, ताज़ी सब्जियों और केसर-दूध के साथ दम पे पकी हुई लाजवाब बिरयानी।',
    isVeg: true,
    isBestseller: true,
    rating: 4.8,
    ratingCount: 310,
    prepTimeMinutes: 14,
    calories: 520,
    customizations: { spiceLevel: true },
    ingredients: [
      { ingredientId: 'ing_basmati', amount: 220 }, // consumes from basmati stock (25kg)
      { ingredientId: 'ing_curd_milk', amount: 50 },
      { ingredientId: 'ing_oil', amount: 30 },
    ],
  },

  // 5. Mango Lassi (from SiOne video: मैंगो लस्सी ₹120 - न्यू/वीकेंड स्पेशल)
  {
    id: 'sione_5',
    name: 'Alphonso Mango Lassi',
    hindiName: 'मैंगो लस्सी',
    category: 'Beverages',
    price: 120,
    originalPrice: 150,
    description: 'Pure Ratnagiri Alphonso mango pulp churned with thick probiotic yogurt, green cardamom, and pistachios.',
    hindiDescription: 'रत्नागिरी हापुस आम के पल्प और गाढ़े दही से बनी ठंडी-ठंडी मैंगो लस्सी, पिस्ता से सजी।',
    isVeg: true,
    isChefSpecial: true,
    isNew: true,
    rating: 4.9,
    ratingCount: 195,
    prepTimeMinutes: 4,
    calories: 210,
    ingredients: [
      { ingredientId: 'ing_curd_milk', amount: 200 }, // consumes from milk/curd stock
    ],
  },

  // 6. Masala Chaas (from SiOne video: मसाला छाछ ₹50)
  {
    id: 'sione_6',
    name: 'Masala Chaas',
    hindiName: 'मसाला छाछ',
    category: 'Beverages',
    price: 50,
    description: 'Traditional spiced buttermilk with roasted cumin, rock salt, ginger extract, and fresh coriander leaves.',
    hindiDescription: 'भुना जीरा, सेंधा नमक, अदरक और हरी धनिया से बनी ताज़ा पाचन-वर्धक मसाला छाछ।',
    isVeg: true,
    rating: 4.7,
    ratingCount: 260,
    prepTimeMinutes: 3,
    calories: 75,
    ingredients: [
      { ingredientId: 'ing_curd_milk', amount: 180 },
    ],
  },

  // 7. Gulab Jamun (from SiOne video: गुलाब जामुन ₹90)
  {
    id: 'sione_7',
    name: 'Kewra Gulab Jamun (2 pcs)',
    hindiName: 'गुलाब जामुन',
    category: 'Desserts',
    price: 90,
    description: 'Soft melt-in-mouth milk mawa spheres soaked in fragrant rose and saffron sugar syrup.',
    hindiDescription: 'मुलायम खोया मावा के गरमा-गरम गुलाब जामुन, गुलाब जल और केसर की चाशनी में डूबे।',
    isVeg: true,
    rating: 4.8,
    ratingCount: 380,
    prepTimeMinutes: 3,
    calories: 280,
    ingredients: [
      { ingredientId: 'ing_curd_milk', amount: 80 },
      { ingredientId: 'ing_oil', amount: 30 },
    ],
  },

  // 8. Tandoori Chicken Skewers
  {
    id: 'sione_8',
    name: 'Tandoori Murgh Tikka',
    hindiName: 'तंदूरी मुर्ग टिक्का',
    category: 'Starters & Quick Bites',
    price: 320,
    originalPrice: 360,
    description: 'Succulent boneless chicken morsels steeped in Kashmiri deghi mirch and mustard oil charred in tandoor.',
    hindiDescription: 'कश्मीरी देगी मिर्च और सरसों के तेल में मैरिनेटेड, तंदूर में ग्रिल किए गए रसीले चिकन पीस।',
    isVeg: false,
    rating: 4.8,
    ratingCount: 240,
    prepTimeMinutes: 14,
    calories: 420,
    ingredients: [
      { ingredientId: 'ing_curd_milk', amount: 60 },
      { ingredientId: 'ing_oil', amount: 30 },
    ],
  },
];

export const CATEGORIES = [
  'All Items',
  'Main Course & Tandoor',
  'Starters & Quick Bites',
  'Breads & Rice',
  'Beverages',
  'Desserts',
] as const;

export const CATEGORY_TRANSLATIONS: Record<string, string> = {
  'All Items': 'सभी व्यंजन',
  'Main Course & Tandoor': 'मेन कोर्स व तंदूर',
  'Starters & Quick Bites': 'स्टार्टर्स व स्नैक्स',
  'Breads & Rice': 'रोटी, नान व चावल',
  'Beverages': 'पेय व शेक्स',
  'Desserts': 'मीठा व डेज़र्ट',
};
