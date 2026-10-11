import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { INITIAL_MENU_ITEMS, MenuItem } from '../data/menuData';
import { INITIAL_ORDERS, RestaurantOrder, OrderItem, OrderStatus, PAST_ORDER_HISTORY, PastOrderRecord } from '../data/initialOrders';
import { INITIAL_INVENTORY, InventoryItem } from '../data/inventoryData';
import { INITIAL_CUSTOMERS, CustomerProfile } from '../data/customerData';
import { INITIAL_LIABILITIES, INITIAL_ASSETS, LiabilityItem, AssetItem, HOURLY_SALES_DATA, HourlySalePoint } from '../data/ledgerData';
import { playKitchenChime, playSuccessChime } from '../lib/audioChime';

export interface FeedbackEntry {
  id: string;
  tableNumber: number;
  rating: number; // 1 to 5
  tags: string[];
  comment: string;
  submittedAt: string;
}

export interface CartItem extends OrderItem {
  customNotes?: string;
}

interface RestaurantContextType {
  outletName: string;
  outletAddress: string;
  outletPhone: string;
  gstin: string;
  tableNumber: number;
  setTableNumber: (table: number) => void;
  // Language
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  t: (en: string, hi: string) => string;
  // Menu
  menuItems: MenuItem[];
  toggleItemStock: (id: string) => void;
  updateItemPrice: (id: string, newPrice: number) => void;
  addNewMenuItem: (item: Partial<MenuItem>) => void;
  // Orders
  orders: RestaurantOrder[];
  activeOrder: RestaurantOrder | null;
  customerActiveOrder: RestaurantOrder | null;
  placeOrder: (customerName: string, customerPhone: string, notes?: string) => Promise<RestaurantOrder>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  settleOrderPayment: (orderId: string, paymentMode: 'UPI' | 'Card' | 'Cash' | 'WhatsApp') => void;
  pastOrders: PastOrderRecord[];
  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, selectedOptions?: string[], notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  appliedCoupon: string | null;
  applyCoupon: (code: string | null) => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartTax: number;
  cartServiceCharge: number;
  cartTotal: number;
  // Inventory / Stock
  inventory: InventoryItem[];
  restockItem: (id: string, amount: number) => void;
  // Liabilities & Assets (देनदारी + एसेट्स)
  liabilities: LiabilityItem[];
  assets: AssetItem[];
  settleLiability: (id: string) => void;
  // Analytics
  hourlySales: HourlySalePoint[];
  // CRM & Loyalty
  currentCustomer: CustomerProfile;
  updateCustomerProfile: (data: Partial<CustomerProfile>) => void;
  redeemStampReward: () => void;
  // Feedback
  feedbacks: FeedbackEntry[];
  submitFeedback: (rating: number, tags: string[], comment: string) => void;
  // Sound & Rush Hour
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  isSimulatingRush: boolean;
  triggerRushHourSimulation: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

const STORAGE_KEY_ORDERS = 'sione_orders_v2';
const STORAGE_KEY_INVENTORY = 'sione_inventory_v2';
const STORAGE_KEY_FEEDBACK = 'sione_feedback_v2';
const STORAGE_KEY_LANG = 'sione_lang_v2';

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'hi'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'en' || saved === 'hi') return saved;
    }
    return 'hi';
  });

  const outletName = language === 'hi' ? 'SiOne रेस्तरां व किचन' : 'SiOne Restaurant & Kitchen';
  const outletAddress = language === 'hi' ? 'दुकान 14, हाई स्ट्रीट एवेन्यू, इंदिरानगर, बेंगलुरु' : 'Shop 14, High Street Avenue, Indiranagar, Bengaluru';
  const outletPhone = '+91 98204 77120';
  const gstin = '29AABCS1092R1Z4';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.setAttribute('data-lang', language);
      document.body.setAttribute('data-lang', language);
      if (language === 'hi') {
        document.body.style.fontFamily = "'Mukta', 'Noto Sans Devanagari', -apple-system, sans-serif";
      } else {
        document.body.style.fontFamily = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      }
    }
  }, [language]);

  const setLanguage = (lang: 'en' | 'hi') => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    }
  };

  const t = useCallback(
    (en: string, hi: string) => (language === 'hi' ? hi : en),
    [language]
  );

  // Read initial table from URL if present (Default to Table 7 as in demo video!)
  const [tableNumber, setTableNumberState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tParam = params.get('table');
      if (tParam && !isNaN(parseInt(tParam))) {
        return Math.min(24, Math.max(1, parseInt(tParam)));
      }
    }
    return 7;
  });

  const setTableNumber = (num: number) => {
    setTableNumberState(num);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('table', num.toString());
      window.history.replaceState({}, '', url.toString());
    }
  };

  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSimulatingRush, setIsSimulatingRush] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<RestaurantOrder[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_ORDERS;
  });

  // Inventory state
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_INVENTORY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_INVENTORY;
  });

  // Liabilities & Assets
  const [liabilities, setLiabilities] = useState<LiabilityItem[]>(INITIAL_LIABILITIES);
  const [assets] = useState<AssetItem[]>(INITIAL_ASSETS);
  const [hourlySales] = useState<HourlySalePoint[]>(HOURLY_SALES_DATA);

  // Feedback state
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_FEEDBACK);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [
      {
        id: 'fb_1',
        tableNumber: 7,
        rating: 5,
        tags: ['पनीर टिक्का', 'तेज़ सर्विस'],
        comment: 'पनीर टिक्का और बटर नान एकदम गरमा-गरम और लाजवाब थे! QR से ऑर्डर करना बहुत आसान लगा।',
        submittedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: 'fb_2',
        tableNumber: 2,
        rating: 5,
        tags: ['दाल मखनी', 'साफ़-सफ़ाई'],
        comment: 'दाल मखनी का स्वाद रेस्टोरेंट की पहचान है। WhatsApp पे इनवॉइस भी तुरंत मिल गया।',
        submittedAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
      },
    ];
  });

  // Customer Profile state (Riya Shah as in video!)
  const [currentCustomer, setCurrentCustomer] = useState<CustomerProfile>(INITIAL_CUSTOMERS[0]);
  const [pastOrders] = useState<PastOrderRecord[]>(PAST_ORDER_HISTORY);

  // Customer App Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('WEEKEND20');

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(feedbacks));
  }, [feedbacks]);

  // Cross-tab broadcast channel for real-time synchronization
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('sione_sync_channel');
      bc.onmessage = (event) => {
        if (event.data?.type === 'ORDER_CREATED') {
          setOrders((prev) => {
            if (prev.some((o) => o.id === event.data.order.id)) return prev;
            return [event.data.order, ...prev];
          });
          if (soundEnabled) playKitchenChime();
        } else if (event.data?.type === 'ORDER_STATUS_CHANGED') {
          setOrders((prev) =>
            prev.map((o) => (o.id === event.data.orderId ? { ...o, status: event.data.status } : o))
          );
        } else if (event.data?.type === 'INVENTORY_DEDUCTED') {
          setInventory(event.data.inventory);
        }
      };
    } catch {
      // BroadcastChannel not available in environment
    }
    return () => {
      bc?.close();
    };
  }, [soundEnabled]);

  const broadcastEvent = (type: string, payload: unknown) => {
    try {
      const bc = new BroadcastChannel('sione_sync_channel');
      bc.postMessage({ type, ...(payload as object) });
      bc.close();
    } catch {
      // ignore
    }
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedCoupon === 'WEEKEND20' && cartSubtotal >= 350) {
    cartDiscount = Math.min(150, Math.round(cartSubtotal * 0.2));
  } else if (appliedCoupon === 'RIYA100' && cartSubtotal >= 450) {
    cartDiscount = 100;
  } else if (appliedCoupon === 'SIONE50' && cartSubtotal >= 200) {
    cartDiscount = 50;
  }

  const discountedAmount = Math.max(0, cartSubtotal - cartDiscount);
  const cartTax = Math.round(discountedAmount * 0.05 * 10) / 10; // 5% GST
  const cartServiceCharge = 0; // Simple clean billing as seen in demo
  const cartTotal = Math.round(discountedAmount + cartTax + cartServiceCharge);

  // Auto-deduct inventory helper
  const deductInventoryForItems = (items: OrderItem[]) => {
    setInventory((prevInv) => {
      const updated = [...prevInv];
      items.forEach((item) => {
        const menuItem = menuItems.find((m) => m.id === item.menuItemId);
        if (!menuItem) return;
        menuItem.ingredients.forEach((ingReq) => {
          const invIndex = updated.findIndex((i) => i.id === ingReq.ingredientId);
          if (invIndex !== -1) {
            // deduct in kg/L
            const isGrams = ingReq.amount > 10;
            const consumed = isGrams ? (ingReq.amount / 1000) * item.quantity : ingReq.amount * item.quantity;
            updated[invIndex] = {
              ...updated[invIndex],
              currentStock: Math.max(0, Math.round((updated[invIndex].currentStock - consumed) * 10) / 10),
            };
          }
        });
      });
      broadcastEvent('INVENTORY_DEDUCTED', { inventory: updated });
      return updated;
    });
  };

  // Cart actions
  const addToCart = (item: MenuItem, quantity = 1, selectedOptions: string[] = [], notes = '') => {
    setCart((prev) => {
      const existing = prev.find(
        (ci) => ci.menuItemId === item.id && JSON.stringify(ci.selectedOptions) === JSON.stringify(selectedOptions)
      );
      if (existing) {
        return prev.map((ci) =>
          ci.id === existing.id ? { ...ci, quantity: ci.quantity + quantity, notes: notes || ci.notes } : ci
        );
      }
      const newCartItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        menuItemId: item.id,
        name: item.name,
        hindiName: item.hindiName,
        price: item.price,
        quantity,
        isVeg: item.isVeg,
        selectedOptions,
        notes,
      };
      return [...prev, newCartItem];
    });
    if (soundEnabled) playSuccessChime();
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);
  const applyCoupon = (code: string | null) => setAppliedCoupon(code);

  // Place order from Customer App
  const placeOrder = async (customerName: string, customerPhone: string, notes?: string): Promise<RestaurantOrder> => {
    if (cart.length === 0) throw new Error('Cart is empty');

    const orderNumber = `TC-${Math.floor(700 + Math.random() * 99)}`;
    const newOrder: RestaurantOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      tableNumber,
      customerName: customerName || 'Rohan Sharma',
      customerPhone: customerPhone || '+91 98204 77120',
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      couponCode: appliedCoupon || undefined,
      taxes: cartTax,
      serviceCharge: cartServiceCharge,
      totalAmount: cartTotal,
      status: 'received',
      paymentStatus: 'pending',
      placedAt: new Date().toISOString(),
      prepTimeMinutes: Math.min(18, 10 + cart.length * 2),
      notes,
    };

    // Auto deduct inventory!
    deductInventoryForItems(cart);

    // Update orders
    setOrders((prev) => [newOrder, ...prev]);

    // Update customer loyalty stats
    setCurrentCustomer((prev) => {
      const newPoints = prev.points + Math.floor(cartTotal * 0.1);
      const newStamps = (prev.stamps + 1) % 11;
      return {
        ...prev,
        points: newPoints,
        stamps: newStamps,
        totalSpent: prev.totalSpent + cartTotal,
        totalVisits: prev.totalVisits + 1,
      };
    });

    // Clear cart
    clearCart();

    if (soundEnabled) playKitchenChime();
    broadcastEvent('ORDER_CREATED', { order: newOrder });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return { ...order, status };
        }
        return order;
      })
    );
    if (soundEnabled && (status === 'ready' || status === 'served')) {
      playKitchenChime();
    }
    broadcastEvent('ORDER_STATUS_CHANGED', { orderId, status });
  };

  const settleOrderPayment = (orderId: string, paymentMode: 'UPI' | 'Card' | 'Cash' | 'WhatsApp') => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, paymentStatus: 'paid', paymentMode, status: 'completed' }
          : order
      )
    );
    if (soundEnabled) playSuccessChime();
  };

  // Find active order for this table
  const customerActiveOrder = orders.find(
    (o) => o.tableNumber === tableNumber && o.status !== 'completed' && o.status !== 'cancelled'
  ) || null;

  const activeOrder = orders[0] || null;

  // Menu item stock toggle (Out of Stock / 86'd)
  const toggleItemStock = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ratingCount: item.ratingCount > 0 ? 0 : 340 } : item
      )
    );
  };

  const updateItemPrice = (id: string, newPrice: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: newPrice } : item))
    );
  };

  const addNewMenuItem = (item: Partial<MenuItem>) => {
    const newItem: MenuItem = {
      id: `sione_custom_${Date.now()}`,
      name: item.name || 'New Special Dish',
      hindiName: item.hindiName || item.name || 'नई स्पेशल डिश',
      category: item.category || 'Starters & Quick Bites',
      price: item.price || 180,
      description: item.description || 'Freshly made with finest ingredients.',
      isVeg: item.isVeg ?? true,
      rating: 5.0,
      ratingCount: 1,
      prepTimeMinutes: 10,
      isNew: true,
      ingredients: [],
    };
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const restockItem = (id: string, amount: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, currentStock: item.currentStock + amount } : item))
    );
  };

  const settleLiability = (id: string) => {
    setLiabilities((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'paid' } : l))
    );
    if (soundEnabled) playSuccessChime();
  };

  const updateCustomerProfile = (data: Partial<CustomerProfile>) => {
    setCurrentCustomer((prev) => ({ ...prev, ...data }));
  };

  const redeemStampReward = () => {
    if (currentCustomer.stamps >= 10) {
      setCurrentCustomer((prev) => ({ ...prev, stamps: 0, points: prev.points + 100 }));
      if (soundEnabled) playSuccessChime();
    }
  };

  const submitFeedback = (rating: number, tags: string[], comment: string) => {
    const entry: FeedbackEntry = {
      id: `fb_${Date.now()}`,
      tableNumber,
      rating,
      tags,
      comment,
      submittedAt: new Date().toISOString(),
    };
    setFeedbacks((prev) => [entry, ...prev]);
    if (soundEnabled) playSuccessChime();
  };

  // Simulate Rush Hour: auto-create 5 realistic orders across different tables over 10 seconds!
  const triggerRushHourSimulation = useCallback(() => {
    if (isSimulatingRush) return;
    setIsSimulatingRush(true);

    const tables = [3, 5, 8, 2, 7];
    const guestNames = ['Aarav Sharma', 'Priya Mehta', 'Rohan Verma', 'Kavita Iyer', 'Vikramaditya Roy'];
    const mockOrderPacks = [
      [{ menuItemId: 'sione_1', name: 'Paneer Tikka', hindiName: 'पनीर टिक्का', price: 280, isVeg: true, quantity: 1 }, { menuItemId: 'sione_3', name: 'Butter Naan', hindiName: 'बटर नान', price: 60, isVeg: true, quantity: 2 }],
      [{ menuItemId: 'sione_2', name: 'Dal Makhani', hindiName: 'दाल मखनी', price: 240, isVeg: true, quantity: 1 }, { menuItemId: 'sione_5', name: 'Alphonso Mango Lassi', hindiName: 'मैंगो लस्सी', price: 120, isVeg: true, quantity: 2 }],
      [{ menuItemId: 'sione_4', name: 'Dum Veg Biryani', hindiName: 'वेज बिरयानी', price: 220, isVeg: true, quantity: 2 }, { menuItemId: 'sione_6', name: 'Masala Chaas', hindiName: 'मसाला छाछ', price: 50, isVeg: true, quantity: 2 }],
      [{ menuItemId: 'sione_1', name: 'Paneer Tikka', hindiName: 'पनीर टिक्का', price: 280, isVeg: true, quantity: 2 }, { menuItemId: 'sione_7', name: 'Kewra Gulab Jamun', hindiName: 'गुलाब जामुन', price: 90, isVeg: true, quantity: 2 }],
      [{ menuItemId: 'sione_8', name: 'Tandoori Murgh Tikka', hindiName: 'तंदूरी मुर्ग टिक्का', price: 320, isVeg: false, quantity: 1 }, { menuItemId: 'sione_3', name: 'Butter Naan', hindiName: 'बटर नान', price: 60, isVeg: true, quantity: 3 }],
    ];

    mockOrderPacks.forEach((itemsPack, index) => {
      setTimeout(() => {
        const orderNumber = `TC-${Math.floor(720 + Math.random() * 70)}`;
        const subtotal = itemsPack.reduce((s, i) => s + i.price * i.quantity, 0);
        const taxes = Math.round(subtotal * 0.05 * 10) / 10;
        const totalAmount = Math.round(subtotal + taxes);

        const newRushOrder: RestaurantOrder = {
          id: `rush_${Date.now()}_${index}`,
          orderNumber,
          tableNumber: tables[index],
          customerName: guestNames[index],
          customerPhone: `+91 98${Math.floor(20000000 + Math.random() * 79999999)}`,
          items: itemsPack.map((ip, itemIndex) => ({
            id: `rush_item_${Date.now()}_${itemIndex}`,
            menuItemId: ip.menuItemId,
            name: ip.name,
            hindiName: ip.hindiName,
            price: ip.price,
            quantity: ip.quantity,
            isVeg: ip.isVeg,
          })),
          subtotal,
          discount: 0,
          taxes,
          serviceCharge: 0,
          totalAmount,
          status: 'received',
          paymentStatus: 'pending',
          placedAt: new Date().toISOString(),
          prepTimeMinutes: 12 + index,
          isRushHourSample: true,
          notes: index % 2 === 0 ? 'Chef recommendation combo' : undefined,
        };

        // Deduct inventory
        deductInventoryForItems(newRushOrder.items);

        setOrders((prev) => [newRushOrder, ...prev]);
        if (soundEnabled) playKitchenChime();
        broadcastEvent('ORDER_CREATED', { order: newRushOrder });

        if (index === mockOrderPacks.length - 1) {
          setIsSimulatingRush(false);
        }
      }, (index + 1) * 2000);
    });
  }, [isSimulatingRush, soundEnabled]);

  return (
    <RestaurantContext.Provider
      value={{
        outletName,
        outletAddress,
        outletPhone,
        gstin,
        tableNumber,
        setTableNumber,
        language,
        setLanguage,
        t,
        menuItems,
        toggleItemStock,
        updateItemPrice,
        addNewMenuItem,
        orders,
        activeOrder,
        customerActiveOrder,
        placeOrder,
        updateOrderStatus,
        settleOrderPayment,
        pastOrders,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        cartSubtotal,
        cartDiscount,
        cartTax,
        cartServiceCharge,
        cartTotal,
        inventory,
        restockItem,
        liabilities,
        assets,
        settleLiability,
        hourlySales,
        currentCustomer,
        updateCustomerProfile,
        redeemStampReward,
        feedbacks,
        submitFeedback,
        soundEnabled,
        setSoundEnabled,
        isSimulatingRush,
        triggerRushHourSimulation,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) throw new Error('useRestaurant must be used within RestaurantProvider');
  return context;
};
