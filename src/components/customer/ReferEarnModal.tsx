import React, { useState } from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { Share2, Copy, Check, X, Gift } from 'lucide-react';

interface ReferEarnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferEarnModal: React.FC<ReferEarnModalProps> = ({ isOpen, onClose }) => {
  const { currentCustomer, outletName, language, t } = useRestaurant();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/menu?ref=${currentCustomer.referralCode}&table=7`;
  const shareMessage = language === 'hi'
    ? `नमस्ते! मैं ${outletName} में खाना खा रहा हूँ। मेरे रेफरल कोड ${currentCustomer.referralCode} से टेबल मेन्यू खोलें और तुरंत ₹100 की छूट पाएं: ${referralLink}`
    : `Hey! I'm dining at ${outletName}. Scan this table link to get ₹100 off your food order with my referral code ${currentCustomer.referralCode}: ${referralLink}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    try {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
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
            <div className="w-8 h-8 rounded-lg bg-[#e6f4ea] text-[#137333] flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#202124]">
                {t('Refer & Earn ₹100', 'दोस्त लाओ, दोनों को ₹100')}
              </h3>
              <p className="text-xs text-[#5f6368]">
                {t('Invite friends, earn dining rewards', 'रेफरल ऑफर · दोनों को ₹100')}
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

        {/* Promo Graphic Card (from SiOne video timestamp 01:14) */}
        <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#dadce0] text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#137333] mx-auto flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[#202124]">
            {t('Give ₹100, Get ₹100 Reward Points', 'दोस्त लाओ, दोनों को ₹100')}
          </h4>
          <p className="text-xs text-[#5f6368] leading-relaxed max-w-xs mx-auto">
            {t('When your friends order using your code RIYA100, both get an instant ₹100 discount!', 'दोस्त को भेजो, उसे ₹100 छूट मिलेगी और आपके वॉलेट में ₹100 पॉइंट्स जुड़ेंगे!')}
          </p>
        </div>

        {/* Link Box */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
            {t('Your Personal Invite Link', 'आपका व्यक्तिगत इनवाइट लिंक')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-[#dadce0] bg-[#f8f9fa] text-[#202124] select-all"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-lg border border-[#dadce0] hover:bg-[#f1f3f4] text-[#202124] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#137333]" /> : <Copy className="w-3.5 h-3.5 text-[#5f6368]" />}
              <span>{copied ? t('Copied', 'कॉपी') : t('Copy', 'कॉपी')}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Share Button */}
        <button
          onClick={handleWhatsAppShare}
          className="w-full py-2.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
          </svg>
          <span>{t('Share on WhatsApp', 'WhatsApp पे दोस्तों को भेजें')}</span>
        </button>
      </div>
    </div>
  );
};
