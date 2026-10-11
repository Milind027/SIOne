import React, { useEffect, useState } from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { LiveKitchenCam } from './LiveKitchenCam';
import { formatCurrency, formatElapsedTime } from '../../lib/formatters';
import { CheckCircle2, Clock, ChefHat, Sparkles, Utensils, Heart, ArrowLeft, Plus } from 'lucide-react';
import { MenuItem } from '../../data/menuData';

interface OrderTrackingViewProps {
  orderId?: string;
  onBackToMenu: () => void;
  onOpenFeedback: () => void;
  onOpenGoogleReview: () => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orderId,
  onBackToMenu,
  onOpenFeedback,
  onOpenGoogleReview,
  onQuickAdd,
}) => {
  const { orders, tableNumber, menuItems, language, t } = useRestaurant();

  const activeOrder = orderId
    ? orders.find((o) => o.id === orderId)
    : orders.find((o) => o.tableNumber === tableNumber && o.status !== 'completed');

  const [elapsedTime, setElapsedTime] = useState('00:00');

  useEffect(() => {
    if (!activeOrder) return;
    const interval = setInterval(() => {
      setElapsedTime(formatElapsedTime(activeOrder.placedAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeOrder]);

  if (!activeOrder) {
    return (
      <div className="py-16 px-4 text-center space-y-4 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-full bg-[#e8f0fe] text-[#1a73e8] mx-auto flex items-center justify-center">
          <Utensils className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#202124]">
          {t(`No active order for Table ${tableNumber}`, `Table ${tableNumber} पे कोई एक्टिव ऑर्डर नहीं है`)}
        </h3>
        <p className="text-xs text-[#5f6368]">
          {t('Browse menu to place an order directly from your table.', 'मेन्यू देखें और टेबल से सीधा ऑर्डर करें।')}
        </p>
        <button
          onClick={onBackToMenu}
          className="px-5 py-2.5 rounded-lg bg-[#1a73e8] text-white text-xs font-semibold hover:bg-[#1765c9] transition-colors"
        >
          {t('Open Table Menu', 'मेन्यू खोलें')}
        </button>
      </div>
    );
  }

  const orderSteps = [
    { key: 'received', labelEn: 'Order Received', labelHi: 'ऑर्डर मिला', descEn: 'Sent straight to chef line', descHi: 'किचन में पहुँच गया' },
    { key: 'preparing', labelEn: 'Kitchen Preparing', labelHi: 'बन रहा है', descEn: 'Cooking live on tandoor/pan', descHi: 'तंदूर व पैन पे तैयार हो रहा है' },
    { key: 'ready', labelEn: 'Ready & Plated', labelHi: 'तैयार व प्लेटेड', descEn: 'Garnished & inspected', descHi: 'सर्व करने के लिए तैयार' },
    { key: 'served', labelEn: 'Served to Table', labelHi: 'सर्व हुआ', descEn: 'Delivered to Table ' + activeOrder.tableNumber, descHi: 'आपकी टेबल पे सर्व हुआ' },
  ];

  const getStepProgressIndex = () => {
    switch (activeOrder.status) {
      case 'received':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
        return 2;
      case 'served':
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepProgressIndex();
  const isMealFinished = activeOrder.status === 'served' || activeOrder.status === 'completed';

  // Nearby tables from SiOne video (Table 2 - पनीर टिक्का, Table 5 - मैंगो लस्सी, Table 8 - वेज बिरयानी)
  const nearbyRecommendations = [
    { table: 2, dishName: 'पनीर टिक्का', en: 'Paneer Tikka', price: 280, id: 'sione_1' },
    { table: 5, dishName: 'मैंगो लस्सी', en: 'Mango Lassi', price: 120, id: 'sione_5' },
    { table: 8, dishName: 'वेज बिरयानी', en: 'Veg Biryani', price: 220, id: 'sione_4' },
  ];

  return (
    <div className="space-y-5 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#5f6368] hover:text-[#202124] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('Back to Menu', 'मेन्यू पर वापस')}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-[#f1f3f4] text-[#202124]">
            #{activeOrder.orderNumber}
          </span>
          <span className="text-xs font-bold text-[#1a73e8]">
            {t(`Table ${activeOrder.tableNumber}`, `टेबल ${activeOrder.tableNumber}`)}
          </span>
        </div>
      </div>

      {/* Title as in video: "आपका ऑर्डर - Table 7 (POWERED BY SiOne)" */}
      <div className="bg-white border border-[#dadce0] rounded-xl p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <h2 className="font-bold text-sm text-[#202124]">
            {t(`Your Order — Table ${activeOrder.tableNumber}`, `आपका ऑर्डर — टेबल ${activeOrder.tableNumber}`)}
          </h2>
          <span className="text-[10px] font-mono font-bold text-[#5f6368]">
            {t('POWERED BY SiOne', 'SiOne द्वारा संचालित')}
          </span>
        </div>

        {/* Live Kitchen Cam */}
        <LiveKitchenCam />

        <div className="flex items-center justify-between text-[11px] text-[#5f6368] pt-1">
          <span className="flex items-center gap-1">
            <ChefHat className="w-3.5 h-3.5 text-[#ea8600]" />
            <span>{t('Live Kitchen Station: Tandoor & Grill', 'लाइव किचन: तंदूर व पैन स्टेशन')}</span>
          </span>
          <span className="font-mono font-medium">{t('Timer', 'समय')}: {elapsedTime}</span>
        </div>
      </div>

      {/* Status Timeline Stepper */}
      <div className="bg-white border border-[#dadce0] rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">
            {t('Preparation Status', 'ऑर्डर की तैयारी')}
          </h3>
          <span className="text-xs font-semibold text-[#137333]">
            {t(`Est. ${activeOrder.prepTimeMinutes} mins`, `अनुमानित समय: ${activeOrder.prepTimeMinutes} मिनट`)}
          </span>
        </div>

        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#dadce0]">
          {orderSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.key} className="relative flex items-start gap-3">
                <div
                  className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-[#137333] text-white'
                      : isCurrent
                      ? 'bg-[#1a73e8] text-white ring-4 ring-[#e8f0fe]'
                      : 'bg-[#dadce0] text-white'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                <div>
                  <h4
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-[#1a73e8]'
                        : isCompleted
                        ? 'text-[#202124]'
                        : 'text-[#5f6368]'
                    }`}
                  >
                    {t(step.labelEn, step.labelHi)}
                  </h4>
                  <p className="text-[11px] text-[#5f6368] mt-0.5">
                    {t(step.descEn, step.descHi)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* "अभी दूसरी टेबल ने ऑर्डर किया" (Nearby tables ordered - exact section from video timestamp 00:43) */}
      <div className="bg-white border border-[#dadce0] rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
            {t('People at nearby tables are enjoying...', 'अभी दूसरी टेबल ने ऑर्डर किया')}
          </h4>
          <span className="text-[11px] font-semibold text-[#ea8600]">
            {t('Trending', 'ट्रेंडिंग')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {nearbyRecommendations.map((rec) => {
            const targetDish = menuItems.find((m) => m.id === rec.id);

            return (
              <div
                key={rec.table}
                className="p-3 rounded-lg bg-[#f8f9fa] border border-[#dadce0] flex items-center justify-between gap-2"
              >
                <div>
                  <div className="text-[10px] font-bold text-[#5f6368] font-mono">
                    {t(`TABLE ${rec.table}`, `टेबल ${rec.table}`)}
                  </div>
                  <div className="text-xs font-bold text-[#202124]">
                    {t(rec.en, rec.dishName)}
                  </div>
                  <div className="text-[11px] font-mono text-[#5f6368]">
                    {formatCurrency(rec.price)}
                  </div>
                </div>

                {targetDish && (
                  <button
                    onClick={() => onQuickAdd(targetDish)}
                    className="p-1.5 rounded-lg bg-white border border-[#dadce0] hover:bg-[#e8f0fe] hover:text-[#1a73e8] text-[#5f6368] transition-colors"
                    title={t('Add to my table', 'मेरी टेबल पे जोड़ें')}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Itemized Order Breakdown */}
      <div className="bg-white border border-[#dadce0] rounded-xl p-4 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">
          {t('Items in This Order', 'ऑर्डर किए गए आइटम्स')}
        </h4>
        <div className="divide-y divide-[#e8eaed] text-xs">
          {activeOrder.items.map((item) => (
            <div key={item.id} className="py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#1a73e8]">{item.quantity}x</span>
                <span className="text-[#202124] font-medium">{language === 'hi' ? (item.hindiName || item.name) : item.name}</span>
              </div>
              <span className="font-mono text-[#5f6368]">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-[#dadce0] flex justify-between font-bold text-sm text-[#202124]">
          <span>{t('Total Bill Amount', 'कुल बिल')}</span>
          <span className="font-mono text-[#1a73e8]">{formatCurrency(activeOrder.totalAmount)}</span>
        </div>
      </div>

      {/* Post-Meal Actions & Google Review Button */}
      {isMealFinished && (
        <div className="p-5 rounded-xl bg-white border border-[#dadce0] shadow-xs space-y-3 text-center">
          <div className="w-10 h-10 rounded-full bg-[#fef7e0] text-[#ea8600] mx-auto flex items-center justify-center font-bold">
            <Heart className="w-5 h-5 fill-[#ea8600]" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#202124]">
              {t('How was your dining experience?', 'खाना कैसा लगा?')}
            </h4>
            <p className="text-xs text-[#5f6368] mt-0.5">
              {t('Help us improve with authentic feedback and leave a quick Google review.', 'एक रिव्यू दें या बिना नाम का सच्चा फीडबैक साझा करें।')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={onOpenGoogleReview}
              className="flex-1 py-2.5 px-3 rounded-lg bg-[#1a73e8] hover:bg-[#1765c9] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('Leave a Google Review (★★★★★)', 'Google रिव्यू दें (★★★★★)')}</span>
            </button>
            <button
              onClick={onOpenFeedback}
              className="py-2.5 px-3 rounded-lg border border-[#dadce0] hover:bg-[#f8f9fa] text-[#202124] text-xs font-semibold"
            >
              {t('Anonymous Feedback', 'सच्चा फीडबैक')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
