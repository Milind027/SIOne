import React, { useState } from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { Share2, MessageSquare, Award, Sparkles, Send, CheckCircle2, Calendar, Gift, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MarketingView: React.FC = () => {
  const { currentCustomer, language, t } = useRestaurant();
  const [isCampaignSent, setIsCampaignSent] = useState(false);
  const [isPosterScheduled, setIsPosterScheduled] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  const handleSendCampaign = () => {
    setIsCampaignSent(true);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {
      // ignore
    }
  };

  const handleSchedulePoster = () => {
    setIsPosterScheduled(true);
    setTimeout(() => setIsPosterScheduled(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header intro */}
      <div>
        <h3 className="text-sm font-bold text-[#202124]">
          {t('Marketing & Loyalty Automation', 'मार्केटिंग व ग्राहक लॉयल्टी कैंपेन')}
        </h3>
        <p className="text-xs text-[#5f6368]">
          {t('Automated WhatsApp offers, loyalty stamp cards, and social media promotions', 'एक बार का ग्राहक, बन जाए रेगुलर — बिलिंग से मार्केटिंग तक')}
        </p>
      </div>

      {/* 3 Main Marketing Cards (from SiOne video timestamps 01:05 to 01:15) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Social Media Poster (वीकेंड स्पेशल: मैंगो लस्सी) */}
        <div className="bg-white border border-[#dadce0] rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider">
                {t('Social Media Poster', 'सोशल मीडिया पोस्टर')}
              </span>
              <span className="text-[11px] font-bold text-[#ea8600] bg-[#fef7e0] px-2 py-0.5 rounded-full">
                {t('Ready', 'तैयार')}
              </span>
            </div>

            {/* Poster graphic mockup */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#fef7e0] via-[#fff8e1] to-[#ffe082] border border-[#ffe082] text-center space-y-2">
              <div className="text-3xl">🥭</div>
              <h4 className="font-extrabold text-base text-[#b06000]">
                {t('Weekend Special', 'वीकेंड स्पेशल')}
              </h4>
              <p className="text-xs font-bold text-[#202124]">
                {t('Alphonso Mango Lassi · ₹120', 'मैंगो लस्सी · ₹120')}
              </p>
            </div>

            <p className="text-xs text-[#5f6368] leading-relaxed">
              {t('Auto-generated Instagram & WhatsApp story creative for Friday peak.', 'एक क्लिक में इंस्टाग्राम और व्हाट्सएप स्टोरी पर पोस्ट करें।')}
            </p>
          </div>

          <button
            onClick={handleSchedulePoster}
            className="w-full py-2.5 px-4 rounded-lg bg-[#1a73e8] hover:bg-[#1765c9] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            {isPosterScheduled ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>{t('Scheduled for 6 PM!', 'शेड्यूल कर दिया गया (6 PM)')}</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>{t('Schedule Post (शनिवार 6 PM)', 'पोस्ट शेड्यूल करें')}</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: Cafe Club / VIP Membership (प्रिया मेहता, Gold) */}
        <div id="tour-loyalty" className="bg-white border border-[#dadce0] rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider">
                {t('Cafe Club Pass', 'कैफे क्लब मेंबरशिप')}
              </span>
              <span className="text-[11px] font-mono font-bold text-[#b06000] bg-[#fef7e0] px-2 py-0.5 rounded-full">
                GOLD
              </span>
            </div>

            {/* Club card mockup */}
            <div className="p-4 rounded-xl bg-[#202124] text-white space-y-2.5 shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-300">Priya Mehta</span>
                <span className="text-[10px] text-neutral-400 font-mono">ID: PRIYA99</span>
              </div>
              <div className="text-[11px] text-neutral-300 space-y-1">
                <div>• {t('10% off on every table order', 'मेंबर: हर ऑर्डर पे 10% off')}</div>
                <div>• {t('Free dessert on birthdays', 'बर्थडे पे फ्री डेज़र्ट')}</div>
              </div>
              <div className="pt-1 border-t border-neutral-700 flex justify-between text-[10px] text-neutral-400">
                <span>{t('Progress to Platinum', 'अगला लेवल: Platinum')}</span>
                <span className="font-mono text-amber-300">790 pts</span>
              </div>
            </div>

            <p className="text-xs text-[#5f6368] leading-relaxed">
              {t('VIP member tier with automated anniversary & repeat order triggers.', 'नियमित ग्राहकों के लिए एक्सक्लूसिव डिस्काउंट पास।')}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#f8f9fa] border border-[#dadce0] text-center text-xs font-semibold text-[#202124]">
            {t('340 Active Club Diners', '340 एक्टिव क्लब मेंबर्स')}
          </div>
        </div>

        {/* Card 3: Referral Offer (दोस्त लाओ, दोनों को ₹100) */}
        <div className="bg-white border border-[#dadce0] rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider">
                {t('Referral Engine', 'रेफरल ऑफर')}
              </span>
              <span className="text-[11px] font-bold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-full">
                {t('Viral Loop', 'सक्रिय')}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#dadce0] space-y-2">
              <h4 className="font-bold text-sm text-[#202124]">
                {t('Bring a Friend, Both Get ₹100', 'दोस्त लाओ, दोनों को ₹100')}
              </h4>
              <p className="text-[11px] text-[#5f6368]">
                {t('When friends scan table QR with code RIYA100, both receive ₹100 dining credit.', 'दोस्त को भेजो, उसे ₹100 छूट, आपको ₹100 पॉइंट्स।')}
              </p>
              <div className="pt-2 border-t border-[#dadce0] flex items-center justify-between text-[11px]">
                <span className="text-[#5f6368]">{t('Happy Hours (3-6 PM)', 'हैप्पी ऑवर 3-6 PM')}</span>
                <span className="font-bold text-[#1a73e8]">15% off</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value="https://sione.app/qr?ref=RIYA100"
              className="flex-1 px-3 py-2 text-xs font-mono bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-[#5f6368]"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText('https://sione.app/qr?ref=RIYA100');
                setCopiedReferral(true);
                setTimeout(() => setCopiedReferral(false), 2000);
              }}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-[#202124] text-white hover:bg-black transition-colors"
            >
              {copiedReferral ? t('Copied!', 'कॉपी!') : t('Copy', 'कॉपी')}
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Re-engagement Campaign Banner (from video timestamp 01:05) */}
      <div className="bg-white border border-[#dadce0] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e6f4ea] text-[#137333] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#202124]">
                {t('WhatsApp Smart Campaign to Regular Diners', 'लॉयल्टी + WhatsApp ऑटोमेशन कैंपेन')}
              </h4>
              <p className="text-xs text-[#5f6368]">
                {t('Target:', 'लक्षित ग्राहक:')} {language === 'hi' ? (currentCustomer.hindiName || currentCustomer.name) : currentCustomer.name} ({t('Visit #6, 440 Points', 'विज़िट 6, 440 पॉइंट्स')})
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-[#137333] bg-[#e6f4ea] px-3 py-1 rounded-full w-fit">
            WhatsApp Business API
          </span>
        </div>

        {/* Campaign text bubble */}
        <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#dadce0] font-mono text-xs text-[#202124] space-y-1">
          <div className="text-[#5f6368] text-[11px] font-sans">
            {t('Message preview to customer:', 'ग्राहक के WhatsApp पर जाने वाला संदेश:')}
          </div>
          <div className="font-medium">
            {language === 'hi' ? (
              <span>
                "नमस्ते {currentCustomer.hindiName || currentCustomer.name}! इस वीकेंड: आपकी पसंदीदा <strong>दाल मखनी पे 20% off</strong>! टेबल बुक करें या QR स्कैन करें, कोड: <strong>RIYA20</strong>"
              </span>
            ) : (
              <span>
                "Hi {currentCustomer.name}! This weekend: enjoy <strong>20% off your favorite Dal Makhani</strong>! Book a table or scan table QR with code: <strong>RIYA20</strong>"
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-[#5f6368]">
            {t('Estimated reach: 860 repeat diners', 'अनुमानित रीच: 860 रिपीट ग्राहक')}
          </span>

          <button
            onClick={handleSendCampaign}
            disabled={isCampaignSent}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors ${
              isCampaignSent
                ? 'bg-[#e6f4ea] text-[#137333] cursor-default'
                : 'bg-[#137333] hover:bg-[#0f5c29] text-white shadow-xs'
            }`}
          >
            {isCampaignSent ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('Dispatched Successfully!', 'भेजा गया ✅')}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t('Send WhatsApp Campaign', 'कैंपेन भेजें')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
