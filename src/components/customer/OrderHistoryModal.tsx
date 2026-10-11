import React from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { formatCurrency } from '../../lib/formatters';
import { Clock, Lock, Sparkles, X, RotateCcw, ArrowRight } from 'lucide-react';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPremium: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose, onOpenPremium }) => {
  const { pastOrders, language, t } = useRestaurant();
  const [reorderedId, setReorderedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleReorder = (orderId: string) => {
    setReorderedId(orderId);
    setTimeout(() => setReorderedId(null), 2500);
  };

  const recentOrders = pastOrders.filter((o) => !o.isOlderThanMonth);
  const olderOrders = pastOrders.filter((o) => o.isOlderThanMonth);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl border border-[#dadce0] text-[#202124] max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#dadce0] sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#202124]">
                {t('Order History', 'ऑर्डर हिस्ट्री')}
              </h3>
              <p className="text-xs text-[#5f6368]">
                {t('Last 30 days dining records', 'पिछले 30 दिन के ऑर्डर')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recent Orders Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
            <span>{t('Active Orders (Last 30 Days)', 'पिछले 30 दिन के बिल')}</span>
            <span className="text-[#137333] font-bold">{t('Accessible', 'सक्रिय')}</span>
          </div>

          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-3 rounded-xl bg-[#f8f9fa] border border-[#dadce0] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-[#dadce0]">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-[#5f6368]">
                      {language === 'hi' ? (order.hindiDateStr || order.dateStr) : order.dateStr}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#202124]">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>

                <p className="text-xs text-[#202124] leading-relaxed">
                  {language === 'hi' ? (order.hindiItemsSummary || order.itemsSummary) : order.itemsSummary}
                </p>

                <div className="pt-1.5 border-t border-[#e8eaed] flex items-center justify-between text-[11px] text-[#5f6368]">
                  <span className="font-medium text-[#137333]">{t('Completed', 'पूरा हुआ')}</span>
                  {reorderedId === order.id ? (
                    <span className="text-[#137333] font-bold">
                      ✓ {t('Added to cart!', 'कार्ट में जोड़ दिया!')}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleReorder(order.id)}
                      className="flex items-center gap-1 font-semibold text-[#1a73e8] hover:underline"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{t('Reorder', 'दोबारा ऑर्डर करें')}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Older Orders > 30 Days (PREMIUM LOCK DEMO - Matching Video timestamp 00:46) */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
            <span>{t('Older History (> 30 Days)', 'पुराने ऑर्डर (30 दिन से अधिक)')}</span>
            <span className="flex items-center gap-1 text-[#ea8600] font-mono font-bold">
              <Lock className="w-3 h-3" />
              {t('Premium Archive', 'प्रीमियम में पूरा 1 साल')}
            </span>
          </div>

          {/* Locked Box */}
          <div className="rounded-xl p-4 border border-[#dadce0] bg-[#f8f9fa] text-center space-y-3">
            <div className="w-9 h-9 rounded-full bg-[#fef7e0] text-[#ea8600] mx-auto flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#202124]">
                {t('Unlock Full Year Order History', 'प्रीमियम में पूरा 1 साल')}
              </h4>
              <p className="text-xs text-[#5f6368] mt-0.5 max-w-xs mx-auto">
                {t('Orders older than 30 days are securely vaulted. Upgrade to SiOne Premium for lifetime invoices & tax ledgers.', '30 दिन से पुराने ऑर्डर क्लाउड आर्काइव में सुरक्षित हैं। प्रीमियम में असीमित ऑर्डर हिस्ट्री पाएं।')}
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenPremium();
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#1a73e8] hover:bg-[#1765c9] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('Unlock Full Archive with SiOne Premium', 'SiOne प्रीमियम फीचर्स देखें')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
