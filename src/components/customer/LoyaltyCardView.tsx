import React from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { Award, Gift, Sparkles, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoyaltyCardViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoyaltyCardView: React.FC<LoyaltyCardViewProps> = ({ isOpen, onClose }) => {
  const { currentCustomer, redeemStampReward, language, t } = useRestaurant();

  if (!isOpen) return null;

  const totalStamps = 10;
  const currentStamps = currentCustomer.stamps;
  const isRewardReady = currentStamps >= totalStamps;

  const handleRedeem = () => {
    redeemStampReward();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-[#dadce0] text-[#202124] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#dadce0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#202124]">
                {t('SiOne Rewards Pass', 'SiOne लॉयल्टी रिवॉर्ड्स')}
              </h3>
              <p className="text-xs text-[#5f6368]">
                {language === 'hi' ? (currentCustomer.hindiName || currentCustomer.name) : currentCustomer.name} · {currentCustomer.totalVisits}{t('th visit', 'वीं विज़िट')}
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

        {/* Digital Membership Card (from video timestamp 01:05) */}
        <div className="rounded-xl p-4 bg-[#202124] text-white shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider uppercase text-amber-300 font-bold px-2 py-0.5 rounded-full bg-white/10">
              {currentCustomer.tier} ★
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              ID: {currentCustomer.referralCode}
            </span>
          </div>

          <div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
              {t('Available Points', 'उपलब्ध लॉयल्टी पॉइंट्स')}
            </div>
            <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {currentCustomer.points}{' '}
              <span className="text-xs font-normal text-neutral-400">PTS</span>
            </div>
          </div>

          {/* Progress to next tier */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>{t('Progress to Gold Member', 'गोल्ड मेंबर बनने के करीब')}</span>
              <span className="font-mono">{currentCustomer.points}/500 pts</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1a73e8]"
                style={{ width: `${Math.min(100, (currentCustomer.points / 500) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Digital Stamp Card */}
        <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#dadce0] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#202124]">
              <Gift className="w-4 h-4 text-[#1a73e8]" />
              <span>{t('Digital Stamp Card', 'डिजिटल स्टैम्प कार्ड')}</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#1a73e8]">
              {currentStamps}/{totalStamps} {t('Stamps', 'स्टैम्प्स')}
            </span>
          </div>

          {/* Stamp Grid */}
          <div className="grid grid-cols-5 gap-2 pt-1">
            {Array.from({ length: totalStamps }).map((_, idx) => {
              const isStamped = idx < currentStamps;
              const isFinal = idx === totalStamps - 1;

              return (
                <div
                  key={idx}
                  className={`aspect-square rounded-lg border flex flex-col items-center justify-center transition-all ${
                    isStamped
                      ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8] font-bold shadow-2xs'
                      : 'border-dashed border-[#dadce0] bg-white text-[#5f6368]'
                  }`}
                >
                  {isStamped ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : isFinal ? (
                    <Sparkles className="w-4 h-4 text-[#ea8600]" />
                  ) : (
                    <span className="text-[10px] font-mono">{idx + 1}</span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleRedeem}
            disabled={!isRewardReady}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              isRewardReady
                ? 'bg-[#137333] hover:bg-[#0f5c29] text-white shadow-sm'
                : 'bg-[#e8eaed] text-[#5f6368] cursor-not-allowed'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>
              {isRewardReady
                ? t('Redeem Free Dessert Now!', 'फ्री डेज़र्ट अनलॉक करें!')
                : t(`Collect ${totalStamps - currentStamps} More Stamps for Free Dessert`, `फ्री डेज़र्ट के लिए ${totalStamps - currentStamps} स्टैम्प बाकी`)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
