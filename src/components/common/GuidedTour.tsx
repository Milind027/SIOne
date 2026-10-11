import React, { useState } from 'react';
import { HelpCircle, ChevronRight, ChevronLeft, X, Sparkles, Check } from 'lucide-react';
import { useRestaurant } from '../../store/restaurantStore';

interface GuidedTourProps {
  onNavigateToTab?: (tab: string) => void;
  onOpenCustomerQr?: () => void;
}

export interface TourStep {
  target: string;
  titleEn: string;
  titleHi: string;
  contentEn: string;
  contentHi: string;
  tabHint?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    target: '#tour-dashboard',
    titleEn: '1. Executive Dashboard & Metrics',
    titleHi: '1. मुख्य डैशबोर्ड व मेट्रिक्स',
    contentEn: 'Real-time bird’s eye view: today’s settled revenue (₹48,250), table occupancy, live kitchen tickets, and average turnaround time.',
    contentHi: 'आज की बिक्री (₹48,250), एक्टिव टेबल्स और किचन ऑर्डर्स का रियल-टाइम ब्यौरा।',
    tabHint: 'orders',
  },
  {
    target: '#tour-billing',
    titleEn: '2. 01 · Fast POS Billing',
    titleHi: '2. 01 · 1-टैप बिलिंग',
    contentEn: 'Fast counter & table billing with automated 5% GST and service charge calculations, instant table settlement, and multiple payment modes.',
    contentHi: 'टेबल और काउंटर बिलिंग: GST, डिस्काउंट और ऑटो-कैलकुलेशन के साथ तुरंत सेटलमेंट।',
    tabHint: 'billing',
  },
  {
    target: '#tour-whatsapp-invoice',
    titleEn: '3. WhatsApp Digital Invoices',
    titleHi: '3. WhatsApp डिजिटल इनवॉइस',
    contentEn: 'Zero thermal paper wasted. One-click sends a beautifully formatted, itemized tax invoice directly to the customer’s WhatsApp phone number.',
    contentHi: 'कागज़ ज़ीरो! एक क्लिक में बिल सीधा ग्राहक के WhatsApp पर सेंड करें।',
    tabHint: 'billing',
  },
  {
    target: '#tour-customer-qr',
    titleEn: '4. Live Order from Table QR',
    titleHi: '4. टेबल QR से लाइव ऑर्डर',
    contentEn: 'Diners scan table acrylic stands, browse photo menus, filter veg dishes, watch the Live Kitchen Cam sizzle, and place orders directly to the kitchen.',
    contentHi: 'ग्राहक टेबल पे QR स्कैन करे, लाइव किचन कैम देखे और खुद ऑर्डर करे। टेबल से सीधा शेफ तक।',
    tabHint: 'qr',
  },
  {
    target: '#tour-inventory',
    titleEn: '5. 05 · Inventory Auto-Deduct',
    titleHi: '5. 05 · ऑटो इन्वेंट्री डिडक्शन व अलर्ट',
    contentEn: 'Raw ingredients (Paneer, Mozzarella, Truffle Oil, Sourdough balls) automatically deduct in real-time as each dish is ordered, with pre-rush low stock alerts.',
    contentHi: 'ऑर्डर होते ही रेसिपी सामग्री (पनीर, टमाटर) अपने-आप माइनस होती है। खत्म होने से पहले अलर्ट!',
    tabHint: 'inventory',
  },
  {
    target: '#tour-loyalty',
    titleEn: '6. Loyalty & Repeat Diners',
    titleHi: '6. लॉयल्टी प्रोग्राम व क्लब पास',
    contentEn: 'Diner loyalty points, tier progression (Bronze → Silver → Gold), digital stamp cards, and automated re-engagement to turn one-time diners into regulars.',
    contentHi: 'लॉयल्टी पॉइंट्स, 10-स्टैम्प डिजिटल कार्ड और कैफे क्लब पास — एक बार का ग्राहक बने हमेशा का रेगुलर।',
    tabHint: 'marketing',
  },
];

export const GuidedTour: React.FC<GuidedTourProps> = ({ onNavigateToTab, onOpenCustomerQr }) => {
  const { t } = useRestaurant();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const nextStep = TOUR_STEPS[nextIndex];
      if (nextStep.tabHint && onNavigateToTab) {
        onNavigateToTab(nextStep.tabHint);
      }
    } else {
      setIsOpen(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      const prevStep = TOUR_STEPS[prevIndex];
      if (prevStep.tabHint && onNavigateToTab) {
        onNavigateToTab(prevStep.tabHint);
      }
    }
  };

  const handleSelectStep = (index: number) => {
    setCurrentStepIndex(index);
    const selected = TOUR_STEPS[index];
    if (selected.tabHint && onNavigateToTab) {
      onNavigateToTab(selected.tabHint);
    }
  };

  return (
    <>
      {/* Floating Demo Guide Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setIsOpen(true);
            if (step.tabHint && onNavigateToTab) {
              onNavigateToTab(step.tabHint);
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#202124] border border-[#dadce0] rounded-full shadow-md hover:border-[#1a73e8] active:scale-95 transition-all text-xs font-semibold"
          aria-label="Open Demo Guide"
        >
          <HelpCircle className="w-4 h-4 text-[#1a73e8]" />
          <span>{t('SiOne Demo Tour', 'SiOne डेमो टूर')}</span>
          <span className="w-5 h-5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-[10px] flex items-center justify-center font-mono font-bold">
            6
          </span>
        </button>
      </div>

      {/* Guided Tour Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl border border-[#dadce0] text-[#202124] space-y-4">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#5f6368] hover:text-[#202124] rounded-full hover:bg-[#f1f3f4] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step Counter Indicator */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold text-[#1a73e8] uppercase">
                {t(`Step ${currentStepIndex + 1} of ${TOUR_STEPS.length}`, `स्टेप ${currentStepIndex + 1} / ${TOUR_STEPS.length}`)}
              </span>
              <span className="text-[#dadce0]">·</span>
              <span className="text-[11px] text-[#5f6368]">SiOne OS Walkthrough</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-[#f1f3f4] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1a73e8] transition-all duration-300 ease-out"
                style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
              />
            </div>

            {/* Title & Content */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#202124] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1a73e8] shrink-0" />
                <span>{t(step.titleEn, step.titleHi)}</span>
              </h3>
              <p className="text-xs text-[#5f6368] leading-relaxed">
                {t(step.contentEn, step.contentHi)}
              </p>
            </div>

            {/* Step Pills */}
            <div className="grid grid-cols-6 gap-1.5 pt-2">
              {TOUR_STEPS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectStep(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? 'bg-[#1a73e8] w-full'
                      : idx < currentStepIndex
                      ? 'bg-[#bdc1c6] w-full'
                      : 'bg-[#e8eaed] w-full'
                  }`}
                  title={s.titleEn}
                />
              ))}
            </div>

            {/* Quick Action Button for Customer QR step */}
            {currentStepIndex === 3 && onOpenCustomerQr && (
              <div className="p-3 bg-[#e8f0fe] rounded-xl border border-[#c2e7ff] flex items-center justify-between">
                <span className="text-xs text-[#1a73e8] font-medium">
                  {t('Test Table 7 customer QR ordering:', 'Table 7 ग्राहक QR ऐप टेस्ट करें:')}
                </span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenCustomerQr();
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#1a73e8] text-white rounded-lg hover:bg-[#1765c9] transition-colors shadow-xs"
                >
                  {t('Open Table 7 QR ↗', 'Table 7 QR खोलें ↗')}
                </button>
              </div>
            )}

            {/* Modal Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-[#dadce0]">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-2 text-[#5f6368] hover:text-[#202124] disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('Previous', 'पिछला')}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-medium px-3 py-2 text-[#5f6368] hover:text-[#202124]"
                >
                  {t('Skip', 'छोड़ें')}
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-[#1a73e8] hover:bg-[#1765c9] text-white rounded-lg shadow-xs transition-colors"
                >
                  {currentStepIndex === TOUR_STEPS.length - 1 ? (
                    <>
                      <span>{t('Complete', 'पूर्ण')}</span>
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{t('Next Step', 'आगे बढ़ें')}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
