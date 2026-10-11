import React, { useState } from 'react';
import { MenuItem } from '../../data/menuData';
import { formatCurrency } from '../../lib/formatters';
import { useRestaurant } from '../../store/restaurantStore';
import { X, Plus, Minus, Check } from 'lucide-react';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onConfirm: (item: MenuItem, quantity: number, selectedOptions: string[], notes: string) => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({ item, onClose, onConfirm }) => {
  const { language, t } = useRestaurant();
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSpice, setSelectedSpice] = useState<'Mild' | 'Medium' | 'Fiery Hot'>('Medium');
  const [selectedCheese, setSelectedCheese] = useState<string>(
    item.customizations?.cheeseOptions?.[0] || 'Standard'
  );
  const [notes, setNotes] = useState('');

  const calculateCustomizedPrice = () => {
    let base = item.price;
    if (selectedCheese.includes('+₹30')) base += 30;
    return base * quantity;
  };

  const handleAdd = () => {
    const options: string[] = [];
    if (item.customizations?.spiceLevel) {
      options.push(`Spice: ${selectedSpice}`);
    }
    if (item.customizations?.cheeseOptions && item.customizations.cheeseOptions.length > 0) {
      options.push(selectedCheese);
    }
    onConfirm(item, quantity, options, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto border border-[#dadce0] shadow-xl flex flex-col text-[#202124]">
        {/* Top Header with Close */}
        <div className="p-4 border-b border-[#dadce0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center p-0.5 ${
                item.isVeg ? 'border-[#137333] bg-white' : 'border-[#d93025] bg-white'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-[#137333]' : 'bg-[#d93025]'}`} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#202124]">
                {language === 'hi' ? (item.hindiName || item.name) : item.name}
              </h3>
              {language === 'hi' && item.hindiName && (
                <div className="text-[11px] text-[#5f6368] font-normal">
                  {item.name}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4">
          <p className="text-xs text-[#5f6368] leading-relaxed">
            {language === 'hi' ? (item.hindiDescription || item.description) : item.description}
          </p>

          {/* Spice Level Selection */}
          {item.customizations?.spiceLevel && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
                {t('Spice Preference', 'तीखापन पसंद')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Mild', 'Medium', 'Fiery Hot'] as const).map((spice) => {
                  const spiceLabel =
                    spice === 'Mild'
                      ? t('Mild', 'हल्का तीखा')
                      : spice === 'Medium'
                      ? t('Medium', 'मध्यम')
                      : t('Fiery Hot', 'ज्यादा तीखा 🔥');
                  return (
                    <button
                      key={spice}
                      type="button"
                      onClick={() => setSelectedSpice(spice)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1 ${
                        selectedSpice === spice
                          ? 'bg-[#e8f0fe] text-[#1a73e8] border-[#1a73e8] font-bold'
                          : 'border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa]'
                      }`}
                    >
                      <span>{spiceLabel}</span>
                      {selectedSpice === spice && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cooking Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
              {t('Special Cooking Request for Chef', 'शेफ के लिए कोई विशेष निर्देश')}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('e.g. Extra hot & crisp, chutney on side...', 'उदा. गरमा-गरम लाएं, चटनी अलग दें...')}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#dadce0] bg-[#f8f9fa] text-[#202124] focus:outline-hidden focus:ring-1 focus:ring-[#1a73e8]"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add to Cart */}
        <div className="p-4 border-t border-[#dadce0] bg-[#f8f9fa] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white border border-[#dadce0] rounded-lg px-2 py-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1 text-[#5f6368] hover:text-[#202124]"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-bold text-xs min-w-[1.2rem] text-center text-[#202124]">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1 text-[#5f6368] hover:text-[#202124]"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 py-2.5 px-4 bg-[#1a73e8] hover:bg-[#1765c9] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-colors flex items-center justify-between"
          >
            <span>{t('Add to Table Cart', 'कार्ट में जोड़ें')}</span>
            <span className="font-mono">{formatCurrency(calculateCustomizedPrice())}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
