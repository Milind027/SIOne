import React, { useState } from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { Award, Clock, MessageSquareQuote, ChevronDown, Check, Globe } from 'lucide-react';

interface CustomerHeaderProps {
  onOpenLoyalty: () => void;
  onOpenHistory: () => void;
  onOpenFeedback: () => void;
  onOpenTracking: () => void;
  activeOrderExists: boolean;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  onOpenLoyalty,
  onOpenHistory,
  onOpenFeedback,
  onOpenTracking,
  activeOrderExists,
}) => {
  const { outletName, tableNumber, setTableNumber, currentCustomer, language, setLanguage, t } = useRestaurant();
  const [showTableModal, setShowTableModal] = useState(false);

  const availableTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-[#dadce0] shadow-xs">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* SiOne Outlet Info & Table Pill */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#d93025] text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
              <span className="text-base">🛎️</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-[#202124] truncate">
                  {outletName}
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#e8f0fe] text-[#1a73e8] font-semibold">
                  SiOne
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#5f6368]">
                <button
                  onClick={() => setShowTableModal(true)}
                  className="inline-flex items-center gap-1 font-bold text-[#1a73e8] hover:underline"
                >
                  {t(`Table ${tableNumber}`, `टेबल ${tableNumber}`)}
                  <ChevronDown className="w-3 h-3" />
                </button>
                <span>·</span>
                <span className="text-[11px] truncate">
                  {t('Auto-detected via QR', 'QR से कनेक्टेड')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions: Language, Tracker, Loyalty, Feedback */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Lang switch */}
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="px-2 py-1 text-[11px] font-semibold rounded-md border border-[#dadce0] bg-[#f8f9fa] hover:bg-[#f1f3f4] text-[#202124]"
            >
              {language === 'hi' ? 'EN' : 'हिंदी'}
            </button>

            {activeOrderExists && (
              <button
                onClick={onOpenTracking}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#e8f0fe] text-[#1a73e8] text-xs font-bold border border-[#c2e7ff]"
                title={t('Live Kitchen Tracking', 'लाइव ऑर्डर ट्रैक करें')}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{t('Live Kitchen', 'लाइव किचन')}</span>
              </button>
            )}

            <button
              onClick={onOpenLoyalty}
              className="p-1.5 text-[#5f6368] hover:text-[#1a73e8] rounded-lg hover:bg-[#f1f3f4] transition-colors relative"
              title={t('Loyalty Points & Rewards', 'लॉयल्टी पास व रिवॉर्ड')}
            >
              <Award className="w-4 h-4" />
              {currentCustomer.points > 0 && (
                <span className="absolute -top-1 -right-1 px-1 bg-[#ea8600] text-white text-[9px] font-mono font-bold rounded-full">
                  {currentCustomer.points}
                </span>
              )}
            </button>

            <button
              onClick={onOpenFeedback}
              className="p-1.5 text-[#5f6368] hover:text-[#1a73e8] rounded-lg hover:bg-[#f1f3f4] transition-colors"
              title={t('Give Feedback', 'फीडबैक')}
            >
              <MessageSquareQuote className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Switch Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl border border-[#dadce0] text-[#202124]">
            <h3 className="text-sm font-bold">{t('Select Dining Table', 'टेबल नंबर चुनें')}</h3>
            <p className="text-xs text-[#5f6368] mt-0.5">
              {t('Simulate scanning a specific QR code', 'QR कोड स्टैंड का सिमुलेशन')}
            </p>

            <div className="grid grid-cols-4 gap-2 my-4">
              {availableTables.map((tNum) => (
                <button
                  key={tNum}
                  onClick={() => {
                    setTableNumber(tNum);
                    setShowTableModal(false);
                  }}
                  className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                    tNum === tableNumber
                      ? 'bg-[#1a73e8] text-white font-bold shadow-xs'
                      : 'bg-[#f8f9fa] border border-[#dadce0] text-[#202124] hover:bg-[#f1f3f4]'
                  }`}
                >
                  T-{tNum}
                  {tNum === tableNumber && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowTableModal(false)}
              className="w-full py-2 text-xs font-semibold rounded-lg bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed]"
            >
              {t('Cancel', 'रद्द करें')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
