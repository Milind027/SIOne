import React, { useState } from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { formatCurrency } from '../../lib/formatters';
import { CreditCard, Landmark, ArrowUpRight, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export const LedgerView: React.FC = () => {
  const { liabilities, assets, settleLiability, language, t } = useRestaurant();
  const [activeSubTab, setActiveSubTab] = useState<'liabilities' | 'assets'>('liabilities');

  const totalLiabilities = liabilities
    .filter((l) => l.status !== 'paid')
    .reduce((sum, l) => sum + l.amount, 0);

  const totalAssetsValuation = assets.reduce((sum, a) => sum + a.valuation, 0);

  return (
    <div className="space-y-5">
      {/* Google Analytics Style Header Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Liabilities KPI */}
        <div className="bg-white border border-[#dadce0] rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
              {t('Total Outstanding Liabilities', 'कुल देनदारी')}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#fce8e6] text-[#c5221f]">
              {t('Due this week', 'इस हफ्ते देय')}
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-[#202124] tabular-nums">
            {formatCurrency(totalLiabilities)}
          </div>
          <p className="text-xs text-[#5f6368]">
            {t('Vendor dues, grocery credit & commercial utility bills', 'उधार, सप्लायर बिल, बिजली बिल — सब एक जगह')}
          </p>
        </div>

        {/* Assets KPI */}
        <div className="bg-white border border-[#dadce0] rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
              {t('Fixed Commercial Assets', 'कुल एसेट्स वैल्यूएशन')}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#e6f4ea] text-[#137333]">
              {assets.length} {t('Items Registered', 'आइटम्स रजिस्टर्ड')}
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-[#202124] tabular-nums">
            {formatCurrency(totalAssetsValuation)}
          </div>
          <p className="text-xs text-[#5f6368]">
            {t('Kitchen machinery, tandoor, POS terminals & teak dining setup', 'तंदूर, डीप फ्रीज़र, POS टैबलेट्स और फर्नीचर')}
          </p>
        </div>
      </div>

      {/* Segmented Sub-Tab Switcher */}
      <div className="flex items-center justify-between border-b border-[#dadce0] pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('liabilities')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeSubTab === 'liabilities'
                ? 'bg-[#e8f0fe] text-[#1a73e8]'
                : 'text-[#5f6368] hover:bg-[#f1f3f4]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{t('Liabilities & Bills (देनदारी)', 'देनदारी (उधार व सप्लायर)')}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('assets')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeSubTab === 'assets'
                ? 'bg-[#e8f0fe] text-[#1a73e8]'
                : 'text-[#5f6368] hover:bg-[#f1f3f4]'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>{t('Restaurant Assets (एसेट्स)', 'एसेट्स (उपकरण व फर्नीचर)')}</span>
          </button>
        </div>

        <span className="text-xs text-[#5f6368] hidden sm:inline">
          {t('Real-time balance sheet ledger', 'हर देनदारी का हिसाब भी यहीं')}
        </span>
      </div>

      {/* View 1: Liabilities List */}
      {activeSubTab === 'liabilities' && (
        <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#dadce0] text-[#5f6368] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">{t('Account / Payee', 'देनदारी विवरण')}</th>
                <th className="py-3 px-4">{t('Source / Memo', 'सप्लायर / बिल विवरण')}</th>
                <th className="py-3 px-4 text-right">{t('Amount Due', 'रकम')}</th>
                <th className="py-3 px-4">{t('Timeline', 'समय-सीमा')}</th>
                <th className="py-3 px-4 text-right">{t('Action', 'भुगतान')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8eaed]">
              {liabilities.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#202124]">
                    <div>{language === 'hi' ? item.hindiTitle : item.title}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#5f6368]">
                    {item.source}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#202124]">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    {item.status === 'paid' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t('Settled', 'चुकता')}
                      </span>
                    ) : item.status === 'due_soon' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#b06000] bg-[#fef7e0] px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {item.dueDate}
                      </span>
                    ) : (
                      <span className="text-[#5f6368] text-[11px]">
                        {item.dueDate}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.status === 'paid' ? (
                      <span className="text-xs text-[#5f6368]">{t('Paid via UPI', 'चुकता किया गया')}</span>
                    ) : (
                      <button
                        onClick={() => settleLiability(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1a73e8] text-white hover:bg-[#1765c9] transition-colors"
                      >
                        {t('Mark Paid', 'भुगतान मार्क करें')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View 2: Assets List */}
      {activeSubTab === 'assets' && (
        <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#dadce0] text-[#5f6368] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">{t('Asset Description', 'उपकरण / संपत्ति')}</th>
                <th className="py-3 px-4 text-center">{t('Quantity', 'संख्या')}</th>
                <th className="py-3 px-4 text-right">{t('Estimated Valuation', 'वैल्यूएशन')}</th>
                <th className="py-3 px-4">{t('Installation Date', 'अधिग्रहण')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8eaed]">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#202124]">
                    <div>{language === 'hi' ? asset.hindiTitle : asset.title}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    {asset.quantity}x
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#137333]">
                    {formatCurrency(asset.valuation)}
                  </td>
                  <td className="py-3.5 px-4 text-[#5f6368]">
                    {asset.purchaseDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
