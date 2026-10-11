import React, { useState } from 'react';
import { useRestaurant } from '../store/restaurantStore';
import { CATEGORIES, CATEGORY_TRANSLATIONS, MenuItem } from '../data/menuData';
import { CustomerHeader } from '../components/customer/CustomerHeader';
import { OffersCarousel } from '../components/customer/OffersCarousel';
import { MenuItemCard } from '../components/customer/MenuItemCard';
import { ItemCustomizerModal } from '../components/customer/ItemCustomizerModal';
import { CartDrawer } from '../components/customer/CartDrawer';
import { OrderTrackingView } from '../components/customer/OrderTrackingView';
import { LoyaltyCardView } from '../components/customer/LoyaltyCardView';
import { ReferEarnModal } from '../components/customer/ReferEarnModal';
import { OrderHistoryModal } from '../components/customer/OrderHistoryModal';
import { FeedbackModal } from '../components/customer/FeedbackModal';
import { GoogleReviewModal } from '../components/customer/GoogleReviewModal';
import { formatCurrency } from '../lib/formatters';
import {
  Search,
  ArrowRight,
  Smartphone,
  Monitor,
  Share2,
  Clock,
  Sparkles,
  Award,
  UtensilsCrossed,
  MessageSquareQuote,
  Star,
} from 'lucide-react';

interface CustomerQrAppProps {
  onBackToOwner?: () => void;
  onOpenPremium?: () => void;
}

export const CustomerQrApp: React.FC<CustomerQrAppProps> = ({ onBackToOwner, onOpenPremium }) => {
  const {
    outletName,
    tableNumber,
    menuItems,
    cart,
    addToCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    customerActiveOrder,
    cartTotal,
    t,
  } = useRestaurant();

  // Navigation & View state
  const [currentTab, setCurrentTab] = useState<'menu' | 'tracking'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [isReferOpen, setIsReferOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isGoogleReviewOpen, setIsGoogleReviewOpen] = useState(false);

  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All Items' || item.category === selectedCategory;
    const matchesVeg = !isVegOnly || item.isVeg;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.hindiName && item.hindiName.includes(searchQuery)) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesVeg && matchesSearch;
  });

  const cartTotalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const contentMarkup = (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] flex flex-col font-sans transition-colors selection:bg-[#1a73e8] selection:text-white">
      {/* Top Header */}
      <CustomerHeader
        onOpenLoyalty={() => setIsLoyaltyOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenTracking={() => setCurrentTab('tracking')}
        activeOrderExists={Boolean(customerActiveOrder)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-3 space-y-4">
        {/* Navigation Tabs (Menu vs Live Order Tracker) */}
        <div className="flex items-center p-1 bg-[#e8eaed] rounded-xl">
          <button
            onClick={() => setCurrentTab('menu')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              currentTab === 'menu'
                ? 'bg-white text-[#202124] shadow-xs'
                : 'text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>{t('Table Menu', 'टेबल मेन्यू')}</span>
          </button>

          <button
            onClick={() => setCurrentTab('tracking')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              currentTab === 'tracking'
                ? 'bg-white text-[#202124] shadow-xs'
                : 'text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#ea8600]" />
            <span>{t('Live Kitchen Cam', 'लाइव किचन ट्रैक')}</span>
            {customerActiveOrder && (
              <span className="w-2 h-2 rounded-full bg-[#137333] animate-ping ml-1" />
            )}
          </button>
        </div>

        {/* Tab 1: Menu View */}
        {currentTab === 'menu' && (
          <div className="space-y-4">
            {/* Minimal Welcome Card (Google Search Console Style) */}
            <div className="p-4 rounded-xl bg-white border border-[#dadce0] shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">
                  {t('Self-Ordering Station', 'टेबल से सीधा किचन')}
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#e8f0fe] text-[#1a73e8]">
                  Table #{tableNumber}
                </span>
              </div>
              <h2 className="text-base font-bold text-[#202124]">
                {t('Freshly Prepared Tandoor & Artisan Kitchen', 'गरमा-गरम तंदूर व लज़ीज़ मेन्यू')}
              </h2>
              <p className="text-xs text-[#5f6368] leading-relaxed">
                {t('Scan QR, customize dishes, and order directly. Synced in real time to our kitchen line.', 'QR स्कैन करें, खुद ऑर्डर करें। आपका ऑर्डर सीधे शेफ की स्क्रीन पे।')}
              </p>
            </div>

            {/* Quick Action Ribbon: 4 Minimal Cards (from SiOne video timestamp 00:46) */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <button
                onClick={() => setIsLoyaltyOpen(true)}
                className="p-2.5 rounded-xl bg-white border border-[#dadce0] hover:border-[#1a73e8] transition-all shadow-xs flex flex-col items-center gap-1"
              >
                <Award className="w-4 h-4 text-[#ea8600]" />
                <span className="font-bold text-[11px] text-[#202124]">{t('Loyalty', 'लॉयल्टी')}</span>
              </button>

              <button
                onClick={() => setIsReferOpen(true)}
                className="p-2.5 rounded-xl bg-white border border-[#dadce0] hover:border-[#1a73e8] transition-all shadow-xs flex flex-col items-center gap-1"
              >
                <Share2 className="w-4 h-4 text-[#137333]" />
                <span className="font-bold text-[11px] text-[#202124]">{t('Refer ₹100', 'रेफरल')}</span>
              </button>

              <button
                onClick={() => setIsHistoryOpen(true)}
                className="p-2.5 rounded-xl bg-white border border-[#dadce0] hover:border-[#1a73e8] transition-all shadow-xs flex flex-col items-center gap-1"
              >
                <Clock className="w-4 h-4 text-[#1a73e8]" />
                <span className="font-bold text-[11px] text-[#202124]">{t('History', 'ऑर्डर हिस्ट्री')}</span>
              </button>

              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="p-2.5 rounded-xl bg-white border border-[#dadce0] hover:border-[#1a73e8] transition-all shadow-xs flex flex-col items-center gap-1"
              >
                <MessageSquareQuote className="w-4 h-4 text-[#9334e8]" />
                <span className="font-bold text-[11px] text-[#202124]">{t('Feedback', 'फीडबैक')}</span>
              </button>
            </div>

            {/* Offers & Coupons Carousel */}
            <OffersCarousel
              appliedCoupon={appliedCoupon}
              onApplyCoupon={applyCoupon}
            />

            {/* Search & Veg Filter Toolbar */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#5f6368]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('Search dishes e.g. Paneer Tikka, Naan...', 'डिश खोजें, उदा. पनीर टिक्का, नान...')}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#dadce0] bg-white text-[#202124] focus:outline-hidden focus:ring-1 focus:ring-[#1a73e8]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2 text-xs text-[#5f6368] hover:text-[#202124]"
                    >
                      {t('Clear', 'हटाएं')}
                    </button>
                  )}
                </div>

                {/* Pure Veg Toggle Filter Button */}
                <button
                  onClick={() => setIsVegOnly(!isVegOnly)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border shrink-0 ${
                    isVegOnly
                      ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]'
                      : 'bg-white text-[#5f6368] border-[#dadce0] hover:bg-[#f8f9fa]'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-xs border flex items-center justify-center p-0.5 ${
                      isVegOnly ? 'border-[#137333] bg-white' : 'border-[#137333] bg-white'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#137333]" />
                  </div>
                  <span>{t('Pure Veg', 'शाकाहारी')}</span>
                </button>
              </div>

              {/* Category Filter Pills (Horizontal scroll) */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.map((category) => {
                  const isSelected = selectedCategory === category;
                  const label = CATEGORY_TRANSLATIONS[category]
                    ? t(category, CATEGORY_TRANSLATIONS[category])
                    : category;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        isSelected
                          ? 'bg-[#1a73e8] text-white font-semibold'
                          : 'bg-white border border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Menu Items List */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs text-[#5f6368] px-1">
                <span>{filteredItems.length} {t('dishes available', 'डिशेज उपलब्ध')}</span>
                {isVegOnly && <span className="text-[#137333] font-semibold">{t('Veg Filter Active', 'शाकाहारी फिल्टर सक्रिय')}</span>}
              </div>

              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-[#5f6368] space-y-2">
                  <p className="text-xs font-semibold">{t('No dishes found', 'कोई डिश नहीं मिली')}</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsVegOnly(false);
                      setSelectedCategory('All Items');
                    }}
                    className="text-xs text-[#1a73e8] hover:underline"
                  >
                    {t('Reset filters', 'फिल्टर हटाएं')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-24">
                  {filteredItems.map((item) => {
                    const cartItem = cart.find((ci) => ci.menuItemId === item.id);
                    const quantity = cartItem ? cartItem.quantity : 0;

                    return (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        cartQuantity={quantity}
                        onAddToCart={(dish) => addToCart(dish, 1)}
                        onUpdateQuantity={(delta) => {
                          if (cartItem) {
                            updateCartQuantity(cartItem.id, delta);
                          }
                        }}
                        onCustomize={(dish) => setCustomizingItem(dish)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Live Tracking View */}
        {currentTab === 'tracking' && (
          <OrderTrackingView
            onBackToMenu={() => setCurrentTab('menu')}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
            onOpenGoogleReview={() => setIsGoogleReviewOpen(true)}
            onQuickAdd={(item) => addToCart(item, 1)}
          />
        )}
      </main>

      {/* Floating Bottom Cart CTA Bar (Matching video: "ऑर्डर करें · N आइटम्स · ₹Total") */}
      {cart.length > 0 && currentTab === 'menu' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-t from-white via-white/95 to-transparent">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1a73e8] hover:bg-[#1765c9] text-white font-bold text-xs uppercase tracking-wider shadow-lg active:scale-[0.99] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center font-mono text-xs">
                  {cartTotalItemCount}
                </div>
                <span>
                  {t('Review Order & Checkout', 'ऑर्डर करें')} · {cartTotalItemCount} {t('Items', 'आइटम्स')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{formatCurrency(cartTotal)}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ItemCustomizerModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onConfirm={(item, q, opts, notes) => addToCart(item, q, opts, notes)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlaced={() => {
          setCurrentTab('tracking');
        }}
      />

      <LoyaltyCardView
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
      />

      <ReferEarnModal
        isOpen={isReferOpen}
        onClose={() => setIsReferOpen(false)}
      />

      <OrderHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onOpenPremium={() => {
          if (onOpenPremium) onOpenPremium();
        }}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <GoogleReviewModal
        isOpen={isGoogleReviewOpen}
        onClose={() => setIsGoogleReviewOpen(false)}
      />
    </div>
  );

  return (
    <div className="relative">
      {/* Top Floating Control Bar (Mobile Frame Toggle & Back to Owner) */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#dadce0] px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {onBackToOwner && (
            <button
              onClick={onBackToOwner}
              className="px-2.5 py-1 rounded-md bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124] font-semibold transition-colors flex items-center gap-1"
            >
              ← {t('Back to SiOne OS', 'वापस SiOne OS')}
            </button>
          )}
          <span className="hidden sm:inline text-[#5f6368]">
            {t(`Table ${tableNumber} QR Customer View`, `Table ${tableNumber} ग्राहक व्यू`)}
          </span>
        </div>

        <button
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            isMobileFrame
              ? 'bg-[#e8f0fe] text-[#1a73e8]'
              : 'border border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4]'
          }`}
        >
          {isMobileFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{isMobileFrame ? t('Full Browser View', 'फुल स्क्रीन') : t('Phone Simulator', 'फोन व्यू')}</span>
        </button>
      </div>

      {/* Frame wrapper if phone simulation mode is on */}
      {isMobileFrame ? (
        <div className="min-h-screen bg-[#f1f3f4] p-4 sm:p-8 flex items-center justify-center">
          <div className="w-[410px] h-[860px] bg-white rounded-[44px] p-3 shadow-2xl border-4 border-[#202124] ring-1 ring-[#dadce0] relative overflow-hidden flex flex-col">
            {/* Phone notch */}
            <div className="w-32 h-4 bg-[#202124] rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-neutral-700" />
            </div>

            {/* Scrollable screen */}
            <div className="flex-1 rounded-[32px] overflow-y-auto no-scrollbar bg-[#f8f9fa]">
              {contentMarkup}
            </div>
          </div>
        </div>
      ) : (
        contentMarkup
      )}
    </div>
  );
};
