import React, { useState } from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { Star, Copy, Check, ExternalLink, X, Sparkles } from 'lucide-react';

interface GoogleReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleReviewModal: React.FC<GoogleReviewModalProps> = ({ isOpen, onClose }) => {
  const { outletName, tableNumber, language, t } = useRestaurant();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sampleReviewText = language === 'hi'
    ? `${outletName} में खाना लाजवाब था! पनीर टिक्का बहुत ही नर्म और बटर नान एकदम गरमा-गरम परोसा गया। टेबल ${tableNumber} के QR कोड से तुरंत ऑर्डर हो गया। 5/5 स्टार!`
    : `Loved the dining experience at ${outletName}! The Paneer Tikka was tender and Butter Naan was served crisp and piping hot. Ordering directly from Table ${tableNumber} QR was effortless. 5/5 stars on Google!`;

  const handleCopyAndRedirect = () => {
    navigator.clipboard.writeText(sampleReviewText);
    setCopied(true);
    setTimeout(() => {
      try {
        const a = document.createElement('a');
        a.href = 'https://search.google.com/local/writereview?placeid=ChIJ-SiOneRestaurant';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.click();
      } catch {
        // ignore
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-[#dadce0] text-[#202124] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#dadce0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#fef7e0] text-[#ea8600] flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-[#ea8600]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#202124]">
                {t('Google Review Booster', 'Google रिव्यू बूस्टर')}
              </h3>
              <p className="text-xs text-[#5f6368]">
                {t('Post-meal Google Maps rating', 'खाने के बाद, वहीं पे रिव्यू की याद')}
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

        {/* 5-Star Banner */}
        <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#dadce0] text-center space-y-2">
          <div className="flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-[#ea8600] text-[#ea8600]" />
            ))}
          </div>
          <h4 className="font-bold text-sm text-[#202124]">
            {t('How was the food? Leave a 5-Star Review', 'खाना कैसा लगा? एक रिव्यू दें ★★★★★')}
          </h4>
          <p className="text-xs text-[#5f6368] max-w-xs mx-auto">
            {t('Reviews help food lovers find our artisanal kitchen on Google Search & Maps!', 'आपकी एक सकारात्मक रेटिंग से नए ग्राहकों तक हमारा स्वाद पहुँचता है।')}
          </p>
        </div>

        {/* Prepared Review Draft */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5f6368]">
            <span>{t('Suggested Review Draft', 'तैयार किया गया रिव्यू')}</span>
            <span className="text-[10px] text-[#1a73e8]">{t('1-Tap Copy', '1-टैप में कॉपी')}</span>
          </div>

          <div className="p-3 rounded-lg bg-[#f8f9fa] border border-[#dadce0] text-xs text-[#202124] italic leading-relaxed">
            "{sampleReviewText}"
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCopyAndRedirect}
          className="w-full py-2.5 px-4 rounded-lg bg-[#1a73e8] hover:bg-[#1765c9] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
          <span>{copied ? t('Copied! Opening Google Maps...', 'कॉपी हुआ! Google खुल रहा है...') : t('Copy & Open Google Review', 'रिव्यू कॉपी करें व Google Maps खोलें')}</span>
        </button>
      </div>
    </div>
  );
};
