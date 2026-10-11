import React, { useState } from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { formatCurrency } from '../../lib/formatters';
import { TrendingUp, BarChart3, Clock, Flame, ChevronDown } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { hourlySales, language, t } = useRestaurant();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Exact figures from SiOne demo video (timestamp 00:59)
  const todayRevenue = 48250;
  const todayOrders = 186;
  const bestSeller = t('Paneer Tikka', 'पनीर टिक्का');

  const topDishes = [
    { rank: 1, name: 'पनीर टिक्का', en: 'Paneer Tikka', percent: 88, revenue: 16400, count: 58 },
    { rank: 2, name: 'दाल मखनी', en: 'Dal Makhani', percent: 72, revenue: 12800, count: 53 },
    { rank: 3, name: 'बटर नान', en: 'Butter Naan', percent: 64, revenue: 8200, count: 136 },
    { rank: 4, name: 'मसाला छाछ', en: 'Masala Chaas', percent: 42, revenue: 4100, count: 82 },
  ];

  const maxRevenueInChart = Math.max(...hourlySales.map((h) => h.revenue));

  return (
    <div className="space-y-5">
      {/* Google Analytics Style 3-KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Today Sales */}
        <div className="bg-white border border-[#dadce0] rounded-xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5f6368] uppercase tracking-wider">
            <span>{t("Today's Gross Sales", 'आज की बिक्री')}</span>
            <TrendingUp className="w-4 h-4 text-[#137333]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#202124] tabular-nums">
            {formatCurrency(todayRevenue)}
          </div>
          <p className="text-xs text-[#137333] font-medium flex items-center gap-1">
            <span>↑ 24.8%</span>
            <span className="text-[#5f6368] font-normal">{t('vs last Saturday', 'पिछले शनिवार से अधिक')}</span>
          </p>
        </div>

        {/* Metric 2: Orders Count */}
        <div className="bg-white border border-[#dadce0] rounded-xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5f6368] uppercase tracking-wider">
            <span>{t('Total Settled Orders', 'कुल ऑर्डर्स')}</span>
            <BarChart3 className="w-4 h-4 text-[#1a73e8]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#202124] tabular-nums">
            {todayOrders}
          </div>
          <p className="text-xs text-[#5f6368]">
            {t('Average order ticket: ₹259.4', 'औसत टिकट साइज: ₹259.4')}
          </p>
        </div>

        {/* Metric 3: Best Seller */}
        <div className="bg-white border border-[#dadce0] rounded-xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5f6368] uppercase tracking-wider">
            <span>{t('Top Performing Dish', 'बेस्ट-सेलर')}</span>
            <Flame className="w-4 h-4 text-[#ea8600]" />
          </div>
          <div className="text-xl font-bold text-[#202124] truncate pt-1">
            {bestSeller}
          </div>
          <p className="text-xs text-[#5f6368]">
            {t('58 portions sold today', 'आज 58 प्लेट्स सर्व की गईं')}
          </p>
        </div>
      </div>

      {/* Main Charts & Rankings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Hourly Sales Bar Chart (Matching SiOne video) */}
        <div className="lg:col-span-2 bg-white border border-[#dadce0] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#202124]">
                {t('Sales by Hour', 'घंटे के हिसाब से बिक्री')}
              </h3>
              <p className="text-xs text-[#5f6368]">
                {t('Dinner rush analysis with real-time POS timestamps', 'दिनभर की बिक्री का सटीक विश्लेषण')}
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fef7e0] border border-[#fce8b2] text-[11px] font-semibold text-[#b06000]">
              <Clock className="w-3.5 h-3.5" />
              <span>{t('Peak Rush: 8 - 10 PM', 'पीक रश: 8-10 PM')}</span>
            </div>
          </div>

          {/* Interactive Bar Chart */}
          <div className="h-56 pt-4 flex items-end justify-between gap-1.5 sm:gap-2 border-b border-[#dadce0] pb-2">
            {hourlySales.map((point, index) => {
              const heightPercent = Math.max(12, Math.round((point.revenue / maxRevenueInChart) * 100));
              const isPeak = point.isPeak;
              const isHovered = hoveredBar === index;

              return (
                <div
                  key={point.hour}
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 bg-[#202124] text-white text-[10px] py-1 px-2 rounded shadow-md whitespace-nowrap font-mono pointer-events-none">
                      <div>{point.hour}: {formatCurrency(point.revenue)}</div>
                      <div className="text-neutral-400">{point.orders} {t('orders', 'ऑर्डर्स')}</div>
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    className={`w-full max-w-[28px] rounded-t-md transition-all duration-200 ${
                      isPeak
                        ? 'bg-gradient-to-t from-[#ea8600] to-[#f29900] shadow-xs'
                        : isHovered
                        ? 'bg-[#1765c9]'
                        : 'bg-[#1a73e8]'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />

                  {/* Hour caption */}
                  <span className={`text-[10px] mt-2 font-mono whitespace-nowrap ${isPeak ? 'font-bold text-[#b06000]' : 'text-[#5f6368]'}`}>
                    {point.hour.replace(' PM', '').replace(' AM', '')}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-[#5f6368] pt-1">
            <span>{t('11 AM (Opening)', 'सुबह 11 बजे')}</span>
            <span className="font-semibold text-[#b06000]">
              {t('Peak Dinner Hours (8-10 PM: ₹27,500 total)', 'डिनर पीक ऑवर: 8-10 PM')}
            </span>
            <span>{t('11 PM (Closing)', 'रात 11 बजे')}</span>
          </div>
        </div>

        {/* Top Dish Rankings */}
        <div className="bg-white border border-[#dadce0] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#202124]">
              {t('Top Selling Dishes', 'टॉप डिश')}
            </h3>
            <span className="text-xs text-[#1a73e8] font-semibold">{t('Real-Time', 'लाइव')}</span>
          </div>

          <div className="space-y-3.5">
            {topDishes.map((dish) => (
              <div key={dish.rank} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#202124]">
                    <span className="font-mono text-[#5f6368]">#{dish.rank}</span>
                    <span>{language === 'hi' ? dish.name : dish.en}</span>
                  </div>
                  <span className="font-mono font-bold text-[#202124]">
                    {formatCurrency(dish.revenue)}
                  </span>
                </div>

                <div className="w-full h-2 bg-[#f1f3f4] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      dish.rank === 1
                        ? 'bg-gradient-to-r from-[#ea8600] to-[#f29900]'
                        : 'bg-[#1a73e8]'
                    }`}
                    style={{ width: `${dish.percent}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-[#5f6368]">
                  <span>{dish.count} {t('servings', 'प्लेट्स')}</span>
                  <span>{dish.percent}% {t('of total category sales', 'बिक्री शेयर')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
