import React from 'react';
import { Sparkles, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRestaurant } from '../../store/restaurantStore';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
  featureDescription?: string;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  featureTitle = 'SiOne Enterprise Extension',
  featureDescription = 'This module is part of the SiOne Enterprise multi-chain suite.',
}) => {
  const { t } = useRestaurant();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-[#dadce0] text-[#202124]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#5f6368] hover:text-[#202124] rounded-full hover:bg-[#f1f3f4]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mb-3 font-bold">
          <Sparkles className="w-5 h-5" />
        </div>

        <h3 className="text-base font-bold text-[#202124]">
          {featureTitle}
        </h3>
        <p className="mt-1 text-xs text-[#5f6368] leading-relaxed">
          {featureDescription}
        </p>

        <div className="mt-4 p-3 rounded-xl bg-[#f8f9fa] border border-[#dadce0] space-y-2">
          <div className="text-xs font-semibold text-[#202124]">
            {t('Included in SiOne Enterprise:', 'SiOne एंटरप्राइज में शामिल:')}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#5f6368]">
            <CheckCircle2 className="w-4 h-4 text-[#137333] shrink-0" />
            <span>{t('Central kitchen inventory forecasting', 'सेंट्रल किचन इन्वेंट्री व AI फोरकास्टिंग')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#5f6368]">
            <CheckCircle2 className="w-4 h-4 text-[#137333] shrink-0" />
            <span>{t('Multi-outlet franchise consolidated ledger', 'मल्टी-आउटलेट सेंट्रलाइज्ड लेजर')}</span>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-[#1a73e8] hover:bg-[#1765c9] text-white transition-colors"
          >
            {t('Got it, thanks!', 'ठीक है, धन्यवाद')}
          </button>
        </div>
      </div>
    </div>
  );
};
