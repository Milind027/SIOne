import React from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { formatCurrency } from '../../lib/formatters';
import { Sparkles, Plus, Flame } from 'lucide-react';
import { MenuItem } from '../../data/menuData';

interface NearbyTrendingProps {
  onQuickAdd: (item: MenuItem) => void;
}

export const NearbyTrending: React.FC<NearbyTrendingProps> = ({ onQuickAdd }) => {
  const { menuItems } = useRestaurant();

  // Curate 3 trending items
  const trendingItems = menuItems.filter((i) => i.isBestseller || i.isChefSpecial).slice(0, 3);

  return (
    <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            While You Wait
          </h4>
        </div>
        <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
          Nearby Tables
        </span>
      </div>

      <p className="text-xs text-neutral-600 dark:text-neutral-400">
        People at tables 2, 5 & 8 are currently enjoying:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {trendingItems.map((item) => (
          <div
            key={item.id}
            className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between gap-2 shadow-2xs hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}
                />
                <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                  {item.name}
                </div>
              </div>
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                {formatCurrency(item.price)}
              </div>
            </div>

            <button
              onClick={() => onQuickAdd(item)}
              className="p-1.5 rounded-lg bg-neutral-100 hover:bg-amber-500 text-neutral-700 hover:text-neutral-950 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-amber-400 dark:hover:text-neutral-950 transition-colors shrink-0"
              title="Add to order"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
