import React, { useState } from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { INVENTORY_CATEGORY_TRANSLATIONS } from '../../data/inventoryData';
import { Package, AlertTriangle, CheckCircle2, Plus, RefreshCw, Search } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory, restockItem, language, t } = useRestaurant();
  const [search, setSearch] = useState('');

  const lowStockItem = inventory.find((i) => i.currentStock <= i.minThreshold);

  const filteredItems = inventory.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.hindiName && item.hindiName.includes(search))
    );
  });

  return (
    <div className="space-y-5">
      {/* Exact Alert Banner from SiOne Video (timestamp 00:50) */}
      {lowStockItem && (
        <div className="p-4 rounded-xl bg-[#fef7e0] border border-[#fce8b2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#ea8600] text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#202124]">
                {language === 'hi' ? (lowStockItem.hindiName || lowStockItem.name) : lowStockItem.name} {t('Stock is Low!', 'कम है')}
              </h4>
              <p className="text-xs text-[#5f6368]">
                {t(
                  `Only ${lowStockItem.currentStock} ${lowStockItem.unit} remaining — threshold is ${lowStockItem.minThreshold} ${lowStockItem.unit}`,
                  `सिर्फ ${lowStockItem.currentStock} ${lowStockItem.unit} बचा — शाम के पीक रश से पहले री-ऑर्डर करें`
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => restockItem(lowStockItem.id, 5)}
            className="px-4 py-2 rounded-lg bg-[#ea8600] hover:bg-[#d97706] text-white text-xs font-bold whitespace-nowrap shadow-xs transition-colors"
          >
            {t('Re-Order Stock (+5kg)', 'री-ऑर्डर (+5kg)')}
          </button>
        </div>
      )}

      {/* Google Analytics Style Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#dadce0] rounded-xl p-4 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-[#5f6368] uppercase tracking-wider">
            {t('Monitored Ingredients', 'ट्रैक किए गए स्टॉक')}
          </div>
          <div className="text-2xl font-bold font-mono text-[#202124]">
            {inventory.length} {t('SKUs', 'आइटम्स')}
          </div>
          <p className="text-[11px] text-[#5f6368]">
            {t('Auto-deducted on every customer order', 'हर ऑर्डर पर ऑटो-डिडक्ट')}
          </p>
        </div>

        <div className="bg-white border border-[#dadce0] rounded-xl p-4 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-[#5f6368] uppercase tracking-wider">
            {t('Low Stock Warnings', 'कम स्टॉक अलर्ट')}
          </div>
          <div className="text-2xl font-bold font-mono text-[#c5221f]">
            {lowStockItem ? `1 ${t('Critical SKU', 'आइटम (पनीर)')}` : t('0 Normal', 'सब ठीक')}
          </div>
          <p className="text-[11px] text-[#5f6368]">
            {t('Pre-rush notification active', 'पीक रश से पहले अलर्ट')}
          </p>
        </div>

        <div className="bg-white border border-[#dadce0] rounded-xl p-4 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-[#5f6368] uppercase tracking-wider">
            {t('Sync Status', 'सिंक स्थिति')}
          </div>
          <div className="text-sm font-bold text-[#137333] pt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#137333]" />
            <span>{t('POS Live Connected', 'लाइव सिंक सक्रिय')}</span>
          </div>
          <p className="text-[11px] text-[#5f6368]">
            {t('BOM recipe deduction engine', 'रेसिपी आधारित स्टॉक कटौती')}
          </p>
        </div>
      </div>

      {/* Stock Table (Exact items from video: पनीर 2kg, टमाटर 9kg, दूध 18L, बासमती 25kg, तेल 12L) */}
      <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#dadce0] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#202124]">
              {t("Today's Live Stock Level", 'स्टॉक — आज')}
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333]">
              ● LIVE
            </span>
          </div>

          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#5f6368]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search item...', 'स्टॉक खोजें...')}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f8f9fa] border border-[#dadce0] rounded-lg text-[#202124] focus:outline-hidden focus:ring-1 focus:ring-[#1a73e8]"
            />
          </div>
        </div>

        <div className="divide-y divide-[#e8eaed]">
          {filteredItems.map((item) => {
            const isLow = item.currentStock <= item.minThreshold;
            const percentage = Math.min(100, Math.round((item.currentStock / (item.minThreshold * 2.5)) * 100));

            return (
              <div key={item.id} className="p-4 hover:bg-[#f8f9fa] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="w-48 shrink-0">
                  <div className="font-bold text-sm text-[#202124] flex items-center gap-2">
                    <span>{language === 'hi' ? (item.hindiName || item.name) : item.name}</span>
                  </div>
                  <div className="text-[11px] text-[#5f6368]">
                    {INVENTORY_CATEGORY_TRANSLATIONS[item.category]
                      ? t(item.category, INVENTORY_CATEGORY_TRANSLATIONS[item.category])
                      : item.category}
                  </div>
                </div>

                {/* Progress bar visual matching video */}
                <div className="flex-1 max-w-md space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-bold text-[#202124]">
                      {item.currentStock} {item.unit}
                    </span>
                    <span className="text-[#5f6368]">
                      {t('Min', 'न्यूनतम')}: {item.minThreshold} {item.unit}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#f1f3f4] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isLow ? 'bg-[#d93025]' : 'bg-[#188038]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 shrink-0">
                  {isLow ? (
                    <span className="text-[11px] font-semibold text-[#c5221f] bg-[#fce8e6] px-2.5 py-1 rounded-full">
                      {t('Low Stock Alert', 'कम है')}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#137333] bg-[#e6f4ea] px-2.5 py-1 rounded-full">
                      {t('Healthy', 'पर्याप्त')}
                    </span>
                  )}

                  <button
                    onClick={() => restockItem(item.id, 5)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124] transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#1a73e8]" />
                    <span>+5 {item.unit}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
