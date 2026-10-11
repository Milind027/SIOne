import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../store/restaurantStore';
import { generateQrDataUrl } from '../lib/qrUtils';
import {
  QrCode,
  LayoutDashboard,
  Smartphone,
  Flame,
  ArrowRight,
  Sparkles,
  Receipt,
  Package,
  Award,
  CheckCircle2,
  BarChart3,
  CreditCard,
  ChefHat,
  MessageSquare,
} from 'lucide-react';

interface LandingPageProps {
  onSelectOwner: () => void;
  onSelectCustomer: (tableNum?: number) => void;
  onStartTour: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectOwner,
  onSelectCustomer,
  onStartTour,
}) => {
  const { outletName, tableNumber, isSimulatingRush, triggerRushHourSimulation, language, setLanguage, t } = useRestaurant();
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const customerAppUrl = `${window.location.origin}/menu?table=${tableNumber}`;

  useEffect(() => {
    generateQrDataUrl(customerAppUrl).then((url) => setQrCodeUrl(url));
  }, [customerAppUrl, tableNumber]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans flex flex-col selection:bg-[#1a73e8] selection:text-white">
      {/* Top Bar (Google Console Style) */}
      <header className="border-b border-[#dadce0] bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d93025] text-white flex items-center justify-center font-bold">
              <span>🛎️</span>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#202124]">
                SiOne
              </span>
              <span className="hidden sm:inline text-xs text-[#5f6368] ml-2">
                · {t('Complete Restaurant OS', 'पूरा रेस्टोरेंट, एक ही ऐप में')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <div className="flex items-center border border-[#dadce0] rounded-lg overflow-hidden bg-white text-xs font-semibold">
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1.5 transition-colors ${
                  language === 'hi' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-[#5f6368] hover:bg-[#f1f3f4]'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1.5 transition-colors ${
                  language === 'en' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-[#5f6368] hover:bg-[#f1f3f4]'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={onStartTour}
              className="px-3 py-1.5 rounded-lg border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#202124] transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
              <span>{t('Guided Tour', 'डेमो गाइड')}</span>
            </button>

            <button
              onClick={triggerRushHourSimulation}
              disabled={isSimulatingRush}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                isSimulatingRush
                  ? 'bg-[#fef7e0] text-[#b06000] border border-[#fce8b2] animate-pulse'
                  : 'bg-[#202124] hover:bg-black text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#ea8600]" />
              <span>{isSimulatingRush ? t('Rush Streaming...', 'रश शुरू...') : t('Simulate Rush Hour', 'रश ऑवर सिमुलेट')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Showcase */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center space-y-10">
        {/* Title area matching video */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f0fe] border border-[#c2e7ff] text-[#1a73e8] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse" />
            {t('RESTAURANT OS & CONTACTLESS DINING', 'पूरा रेस्टोरेंट, एक ही ऐप में: बिलिंग से मार्केटिंग तक')}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#202124] leading-tight">
            {t('Meet SiOne:', 'मिलिए SiOne से')} <br />
            <span className="text-[#1a73e8]">
              {t('Every Rupee, Every Kilo Under Your Control.', 'हर रुपया, हर किलो... आपके कंट्रोल में।')}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#5f6368] max-w-2xl mx-auto leading-relaxed">
            {t(
              'Zero paper thermal bills, real-time live kitchen broadcast, instant WhatsApp invoices, recipe stock auto-deduction, and diner loyalty rewards.',
              'कागज़ की पर्ची और अलग-अलग रजिस्टरों का झंझट खत्म। 1-टैप में WhatsApp बिल, लाइव किचन कैम, टेबल QR ऑर्डर और ऑटोमैटिक स्टॉक अलर्ट।'
            )}
          </p>
        </div>

        {/* Two Big Clean Minimal Cards (Google Search Console Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: Owner Demo */}
          <div className="p-7 rounded-2xl bg-white border border-[#dadce0] hover:border-[#1a73e8] transition-all flex flex-col justify-between shadow-xs space-y-6 group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-bold">
                <LayoutDashboard className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#1a73e8]">
                  {t('RESTAURANT OWNER & POS', 'रेस्टोरेंट ओनर व POS')}
                </span>
                <h3 className="text-xl font-bold text-[#202124] mt-1 group-hover:text-[#1a73e8] transition-colors">
                  {t('Owner OS & POS Dashboard', 'SiOne ओनर ऑपरेटिंग सिस्टम')}
                </h3>
                <p className="text-xs text-[#5f6368] mt-1.5 leading-relaxed">
                  {t(
                    'Real-time kitchen kanban, POS billing with direct WhatsApp dispatch, recipe stock auto-deduction, liabilities ledger, and analytics reports.',
                    'लाइव ऑर्डर्स कानबन, एक टैप में WhatsApp बिल, पनीर व सामग्री का स्टॉक अलर्ट, देनदारी-एसेट्स और एनालिटिक्स।'
                  )}
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-[#202124]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#137333] shrink-0" />
                  <span>{t('01 · One-tap billing with WhatsApp invoice (Paper: Zero)', '01 · एक टैप में बिल — इनवॉइस सीधा WhatsApp पे (पेपर: 0)')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#137333] shrink-0" />
                  <span>{t('02 · Menu manager with instant 86’d switches', '02 · मेन्यू मैनेजर — नई डिश ऐड, पुरानी हटाओ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#137333] shrink-0" />
                  <span>{t('05 · Low stock alert before peak rush (Paneer, Milk, Basmati)', '05 · स्टॉक — पनीर ख़त्म होने से पहले ही अलर्ट')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#137333] shrink-0" />
                  <span>{t('06 & 07 · Liabilities ledger & Google Analytics hourly reports', '06 & 07 · देनदारी + एसेट्स और घंटे के हिसाब से बिक्री')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onSelectOwner}
              className="w-full py-3.5 px-5 rounded-xl bg-[#202124] hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{t('Open Owner OS Demo', 'ओनर OS डेमो खोलें')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Customer Demo (Scan QR or launch) */}
          <div className="p-7 rounded-2xl bg-white border border-[#dadce0] hover:border-[#1a73e8] transition-all flex flex-col justify-between shadow-xs space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#e6f4ea] text-[#137333] flex items-center justify-center font-bold">
                  <Smartphone className="w-6 h-6" />
                </div>

                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8]">
                  {t(`Table #${tableNumber}`, `टेबल #${tableNumber}`)}
                </span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#137333]">
                  {t('CONTACTLESS TABLE ORDERING', '03 · ग्राहक QR ऐप')}
                </span>
                <h3 className="text-xl font-bold text-[#202124] mt-1 group-hover:text-[#1a73e8] transition-colors">
                  {t(`Customer QR App (Table ${tableNumber})`, `ग्राहक टेबल QR ऐप (टेबल ${tableNumber})`)}
                </h3>
                <p className="text-xs text-[#5f6368] mt-1.5 leading-relaxed">
                  {t(
                    'Point phone camera at table stand. Self-order, watch live kitchen cam sizzle, apply WEEKEND20 promo, and earn loyalty stamps.',
                    'ग्राहक टेबल पे QR स्कैन करे, और खुद ऑर्डर करे। खाना बनते लाइव देखो, कूपन लगाओ और सच्चा फीडबैक दो।'
                  )}
                </p>
              </div>

              {/* Dynamic QR Code in clean container */}
              <div className="p-3 bg-[#f8f9fa] border border-[#dadce0] rounded-xl flex items-center gap-4 text-[#202124]">
                <div className="shrink-0 bg-white p-1 rounded-lg border border-[#dadce0]">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Scan to order"
                      className="w-20 h-20 block"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-neutral-100 flex items-center justify-center text-xs">
                      QR
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-left">
                  <div className="text-xs font-bold text-[#202124]">
                    {t('Scan With Mobile Camera', 'फोन से QR स्कैन करें')}
                  </div>
                  <p className="text-[11px] text-[#5f6368] leading-tight">
                    {t('Direct browser app without app downloads.', 'बिना किसी ऐप डाउनलोड के तुरंत ब्राउज़र में खुलता है।')}
                  </p>
                  <div className="text-[10px] font-mono text-[#1a73e8] pt-0.5">
                    {t(`Table #${tableNumber} Detected`, `टेबल #${tableNumber} कनेक्टेड`)}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectCustomer(tableNumber)}
              className="w-full py-3.5 px-5 rounded-xl bg-[#1a73e8] hover:bg-[#1765c9] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{t(`Launch Customer App (Table ${tableNumber})`, `ग्राहक ऐप शुरू करें (टेबल ${tableNumber})`)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature Grid matching video's modular icons */}
        <div className="pt-4 border-t border-[#dadce0] grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-white border border-[#dadce0] space-y-1">
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#1a73e8] mx-auto flex items-center justify-center font-bold">
              <ChefHat className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-[#202124]">{t('Live Kitchen Cam', 'लाइव किचन कैम')}</h4>
            <p className="text-[11px] text-[#5f6368]">{t('445°C pan sizzle feed', 'खाना बनते लाइव देखो')}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#dadce0] space-y-1">
            <div className="w-8 h-8 rounded-lg bg-[#e6f4ea] text-[#137333] mx-auto flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-[#202124]">{t('WhatsApp Invoicing', 'WhatsApp इनवॉइस')}</h4>
            <p className="text-[11px] text-[#5f6368]">{t('Zero paper receipts', 'पेपर? ज़ीरो!')}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#dadce0] space-y-1">
            <div className="w-8 h-8 rounded-lg bg-[#fef7e0] text-[#b06000] mx-auto flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-[#202124]">{t('Stock Alerts', 'स्टॉक अलर्ट')}</h4>
            <p className="text-[11px] text-[#5f6368]">{t('Paneer, Milk, Basmati', 'ख़त्म होने से पहले अलर्ट')}</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#dadce0] space-y-1">
            <div className="w-8 h-8 rounded-lg bg-[#f3e8fd] text-[#9334e8] mx-auto flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-[#202124]">{t('Liabilities & Assets', 'देनदारी + एसेट्स')}</h4>
            <p className="text-[11px] text-[#5f6368]">{t('Suppliers & utility dues', 'हर देनदारी का हिसाब')}</p>
          </div>
        </div>

        {/* Ending CTA matching video: "फ्री डेमो बुक करें →" (timestamp 01:28) */}
        <div className="p-6 rounded-2xl bg-white border border-[#dadce0] text-center space-y-3">
          <h3 className="font-bold text-base text-[#202124]">
            {t('Ready to digitize your restaurant?', 'आज ही फ्री डेमो बुक कीजिए')}
          </h3>
          <p className="text-xs text-[#5f6368] max-w-md mx-auto">
            {t('POS · CRM · Stock · QR Order · Marketing · Customer App', 'POS · CRM · स्टॉक · QR ऑर्डर · मार्केटिंग · ग्राहक ऐप')}
          </p>
          <div className="pt-1 flex justify-center gap-3">
            <button
              onClick={onSelectOwner}
              className="px-6 py-2.5 rounded-lg bg-[#d93025] hover:bg-[#c5221f] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs"
            >
              <span>{t('Book Free Demo Now →', 'फ्री डेमो बुक करें →')}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#dadce0] bg-white py-4 text-center text-xs text-[#5f6368]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t('SiOne Restaurant Operating System · Powered by TableCraft', 'SiOne रेस्टोरेंट ऑपरेटिंग सिस्टम · TableCraft द्वारा संचालित')}</span>
          <div className="flex items-center gap-3">
            <span>GSTIN: 29AABCS1092R1Z4</span>
            <span>·</span>
            <span>Bengaluru</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
