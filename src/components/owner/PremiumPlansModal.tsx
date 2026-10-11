import React from 'react';
import { Check, Sparkles, X, ArrowRight, ShieldCheck, QrCode, Star, MessageSquare, Sliders } from 'lucide-react';
import { useRestaurant } from '../../store/restaurantStore';

interface PremiumPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planName: string) => void;
}

export const PremiumPlansModal: React.FC<PremiumPlansModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const { t } = useRestaurant();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#dadce0] text-[#202124] max-h-[92vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#dadce0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1a73e8]">
                SiOne Suite
              </span>
              <span className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-[#202124] mt-0.5">
              {t('SiOne Premium Capabilities', 'प्रीमियम में और भी')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Feature Tiles from SiOne Video (timestamp 01:18) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* 1. ऑटो टेबल पहचान */}
          <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#dadce0] space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-[#202124]">
              {t('Auto Table Detect', 'ऑटो टेबल पहचान')}
            </h4>
            <p className="text-[11px] text-[#5f6368] leading-relaxed">
              {t('Customer sits anywhere, table is automatically recognized from QR.', 'ग्राहक कहीं बैठे हैं, ऑटो खुद बताए और किचन में रूट करे।')}
            </p>
            <span className="inline-block text-[10px] font-mono font-bold text-[#1a73e8] bg-[#e8f0fe] px-2 py-0.5 rounded">
              {t('Table 7 · Auto Detected', 'Table 7 · अपने आप')}
            </span>
          </div>

          {/* 2. Google रिव्यू बूस्टर */}
          <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#dadce0] space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[#fef7e0] text-[#ea8600] flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-[#ea8600]" />
            </div>
            <h4 className="font-bold text-xs text-[#202124]">
              {t('Google Review Booster', 'Google रिव्यू बूस्टर')}
            </h4>
            <p className="text-[11px] text-[#5f6368] leading-relaxed">
              {t('Smart post-meal prompt boosts authentic 5-star Google Maps reviews.', 'खाने के बाद, वहीं पे रिव्यू की याद दिलाए और रेटिंग बढ़ाए।')}
            </p>
            <span className="inline-block text-[10px] font-mono font-bold text-[#b06000] bg-[#fef7e0] px-2 py-0.5 rounded">
              {t('How was the meal? ★★★★★', 'खाना कैसा लगा? ★★★★★')}
            </span>
          </div>

          {/* 3. WhatsApp बल्क मार्केटिंग */}
          <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#dadce0] space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[#e6f4ea] text-[#137333] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-[#202124]">
              {t('WhatsApp Bulk Marketing', 'WhatsApp बल्क मार्केटिंग')}
            </h4>
            <p className="text-[11px] text-[#5f6368] leading-relaxed">
              {t('1-click marketing broadcast directly to customer phone contacts.', 'एक क्लिक में सारे ग्राहकों तक नया ऑफर और कूपन।')}
            </p>
            <span className="inline-block text-[10px] font-mono font-bold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded">
              {t('860 Diners · Broadcasting', '860 ग्राहक · भेजा जा रहा है')}
            </span>
          </div>

          {/* 4. कस्टम फीचर्स */}
          <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#dadce0] space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[#f3e8fd] text-[#9334e8] flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-[#202124]">
              {t('Custom Features', 'कस्टम फीचर्स')}
            </h4>
            <p className="text-[11px] text-[#5f6368] leading-relaxed">
              {t('Customized workflow tailored to your restaurant seating & billing.', 'आपकी जगह, आपका तरीका — आपके रेस्टोरेंट के हिसाब से।')}
            </p>
            <span className="inline-block text-[10px] font-mono font-bold text-[#9334e8] bg-[#f3e8fd] px-2 py-0.5 rounded">
              {t('Tailor-made restaurant flow', 'टेलर-मेड रेस्टोरेंट फ्लो')}
            </span>
          </div>
        </div>

        {/* Upgrade Callout */}
        <div className="p-5 rounded-xl bg-[#e8f0fe] border border-[#c2e7ff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-[#1a73e8]">
              {t('Unlock All SiOne Premium Modules', 'SiOne प्रीमियम ऑल-इन-वन अपग्रेड')}
            </h4>
            <p className="text-xs text-[#5f6368] mt-0.5">
              {t('₹1,499/month · Free 14-day trial with full setup support', '₹1,499 / महीना · 14 दिन का फ्री ट्रायल')}
            </p>
          </div>

          <button
            onClick={() => onSelectPlan('SiOne All-in-One Premium')}
            className="px-5 py-2.5 rounded-lg bg-[#1a73e8] hover:bg-[#1765c9] text-white text-xs font-bold whitespace-nowrap shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>{t('Activate Premium Trial', 'प्रीमियम एक्टिवेट करें')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#5f6368]">
          <ShieldCheck className="w-4 h-4 text-[#137333]" />
          <span>{t('GST E-invoicing compliant · Bank-grade data protection · 99.99% Uptime', 'GST ई-इनवॉइसिंग सुरक्षित · बैंक स्तर की सुरक्षा · 99.99% अपटाइम')}</span>
        </div>
      </div>
    </div>
  );
};
