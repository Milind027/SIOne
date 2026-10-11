import React from 'react';
import { MenuItem } from '../../data/menuData';
import { formatCurrency } from '../../lib/formatters';
import { useRestaurant } from '../../store/restaurantStore';
import { Star, Plus, Minus, SlidersHorizontal, Flame } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  cartQuantity: number;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (delta: number) => void;
  onCustomize: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
  onCustomize,
}) => {
  const { language, t } = useRestaurant();

  const primaryName = language === 'hi' ? (item.hindiName || item.name) : item.name;
  const secondaryName = undefined; // Keep clean single-language presentation matching chosen language
  const displayDescription = language === 'hi' ? (item.hindiDescription || item.description) : item.description;

  return (
    <div className="bg-white border border-[#dadce0] rounded-xl p-3.5 transition-all hover:border-[#bdc1c6] flex flex-col justify-between gap-3 shadow-xs">
      {/* Top Details & Veg indicator */}
      <div className="space-y-1.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center p-0.5 shrink-0 ${
                item.isVeg ? 'border-[#137333] bg-white' : 'border-[#d93025] bg-white'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-[#137333]' : 'bg-[#d93025]'}`} />
            </div>

            <div>
              <h3 className="font-bold text-sm text-[#202124] leading-snug">
                {primaryName}
              </h3>
              {secondaryName && (
                <div className="text-[11px] text-[#5f6368] font-normal">
                  {secondaryName}
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1">
            {item.isBestseller && (
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#fef7e0] text-[#b06000]">
                {t('BESTSELLER', 'बेस्टसेलर')}
              </span>
            )}
            {item.isNew && (
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#fce8e6] text-[#c5221f]">
                {t('NEW', 'नया')}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-[#5f6368] line-clamp-2 leading-relaxed pt-0.5">
          {displayDescription}
        </p>

        {/* Rating and prep metadata */}
        <div className="flex items-center gap-2 text-[11px] text-[#5f6368] pt-1">
          <span className="flex items-center gap-0.5 font-bold text-[#b06000]">
            <Star className="w-3.5 h-3.5 fill-[#ea8600] text-[#ea8600]" />
            {item.rating}
          </span>
          <span>·</span>
          <span>{item.ratingCount} {t('ratings', 'रिव्यूज')}</span>
          <span>·</span>
          <span>{item.prepTimeMinutes} {t('mins', 'मिनट')}</span>
        </div>
      </div>

      {/* Price & Add Action Row */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#e8eaed]">
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-base font-mono text-[#202124]">
            {formatCurrency(item.price)}
          </span>
          {item.originalPrice && (
            <span className="text-xs font-mono text-[#5f6368] line-through">
              {formatCurrency(item.originalPrice)}
            </span>
          )}
        </div>

        {/* Add button or Counter */}
        {cartQuantity > 0 ? (
          <div className="flex items-center gap-2 bg-[#e8f0fe] border border-[#c2e7ff] rounded-lg px-2 py-1">
            <button
              onClick={() => onUpdateQuantity(-1)}
              className="p-0.5 text-[#1a73e8] hover:text-[#1765c9]"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-bold text-xs text-[#1a73e8] min-w-[1rem] text-center">
              {cartQuantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(1)}
              className="p-0.5 text-[#1a73e8] hover:text-[#1765c9]"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {item.customizations && (
              <button
                onClick={() => onCustomize(item)}
                className="p-1.5 rounded-lg text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
                title={t('Customize', 'कस्टमाइज़')}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onAddToCart(item)}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#1a73e8] hover:bg-[#1765c9] text-white shadow-xs transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('Add', 'जोड़ें')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
