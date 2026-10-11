import React from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { INITIAL_CUSTOMERS } from '../../data/customerData';
import { formatCurrency } from '../../lib/formatters';
import { Users, Award, Star, MessageSquareHeart } from 'lucide-react';

export const CrmView: React.FC = () => {
  const { currentCustomer, feedbacks, language, t } = useRestaurant();

  const customers = [
    currentCustomer,
    ...INITIAL_CUSTOMERS.filter((c) => c.id !== currentCustomer.id),
  ];

  return (
    <div className="space-y-5">
      {/* Top CRM Stats (Google Analytics style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#dadce0] rounded-xl p-4 shadow-xs space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
            {t('Total Registered Diners', 'कुल रजिस्टर्ड ग्राहक')}
          </div>
          <div className="text-2xl font-bold font-mono text-[#202124]">
            1,420 {t('Guests', 'ग्राहक')}
          </div>
          <p className="text-[11px] text-[#5f6368]">
            {t('68% repeat diners this month', '68% रिपीट ग्राहक दर')}
          </p>
        </div>

        <div className="bg-white border border-[#dadce0] rounded-xl p-4 shadow-xs space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
            {t('Active Loyalty Members', 'एक्टिव क्लब मेंबर्स')}
          </div>
          <div className="text-2xl font-bold font-mono text-[#1a73e8]">
            340 {t('Members', 'मेंबर्स')}
          </div>
          <p className="text-[11px] text-[#5f6368]">
            {t('Gold & VIP rewards passholders', 'रिया शाह, प्रिया मेहता व अन्य')}
          </p>
        </div>

        <div className="bg-white border border-[#dadce0] rounded-xl p-4 shadow-xs space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
            {t('Guest Food Sentiment', 'खाने की औसत रेटिंग')}
          </div>
          <div className="text-2xl font-bold font-mono text-[#202124] flex items-center gap-1.5">
            <span>4.92 / 5.0</span>
            <Star className="w-5 h-5 fill-[#ea8600] text-[#ea8600]" />
          </div>
          <p className="text-[11px] text-[#5f6368]">
            {t('Based on verified QR table feedback', 'टेबल QR से सत्यापित फीडबैक')}
          </p>
        </div>
      </div>

      {/* CRM Customer Table */}
      <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#dadce0] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#202124]">
            {t('Diner Profiles & Reward Balances', 'ग्राहक प्रोफाइल व लॉयल्टी बैलेंस')}
          </h3>
          <span className="text-xs text-[#5f6368] font-mono">
            {t('Auto-synced with WhatsApp phone numbers', 'WhatsApp नंबर से लिंक')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#dadce0] bg-[#f8f9fa] text-[#5f6368] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">{t('Customer Name', 'ग्राहक का नाम')}</th>
                <th className="py-3 px-4">{t('Phone Number', 'मोबाइल नंबर')}</th>
                <th className="py-3 px-4">{t('Club Tier', 'क्लब टियर')}</th>
                <th className="py-3 px-4 text-right">{t('Reward Points', 'पॉइंट्स')}</th>
                <th className="py-3 px-4 text-center">{t('Stamps', 'स्टैम्प्स')}</th>
                <th className="py-3 px-4 text-right">{t('Lifetime Spend', 'कुल खर्च')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8eaed]">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#202124]">
                    <div>{language === 'hi' ? (c.hindiName || c.name) : c.name}</div>
                  </td>

                  <td className="py-3.5 px-4 text-[#5f6368] font-mono">
                    {c.phone}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8]">
                      {t(c.tier, c.tier === 'Member' ? 'मेंबर' : c.tier === 'Gold' ? 'गोल्ड' : 'प्लैटिनम')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#202124]">
                    {c.points} pts
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono">
                    {c.stamps}/10
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#137333]">
                    {formatCurrency(c.totalSpent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Anonymous Feedbacks List (from SiOne video timestamp 00:46) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MessageSquareHeart className="w-4 h-4 text-[#1a73e8]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">
              {t('Live Table Sentiment (बिना नाम, सच्चा फीडबैक)', 'सच्चा गुमनाम फीडबैक')}
            </h3>
          </div>
          <span className="text-xs text-[#5f6368] font-mono">{feedbacks.length} {t('Entries', 'फीडबैक्स')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="p-4 rounded-xl bg-white border border-[#dadce0] space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-[#202124] text-white text-xs font-bold font-mono">
                    {t(`Table ${fb.tableNumber}`, `टेबल ${fb.tableNumber}`)}
                  </span>
                  <span className="text-xs text-[#5f6368]">
                    {new Date(fb.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-[#ea8600]">
                  {Array.from({ length: fb.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#ea8600]" />
                  ))}
                </div>
              </div>

              {fb.comment && (
                <p className="text-xs text-[#202124] italic leading-relaxed">
                  "{fb.comment}"
                </p>
              )}

              {fb.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {fb.tags.map((tg) => (
                    <span
                      key={tg}
                      className="px-2 py-0.5 rounded-md bg-[#f1f3f4] text-[#5f6368] text-[10px]"
                    >
                      {tg}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
