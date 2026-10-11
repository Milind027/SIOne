import React from 'react';
import { useRestaurant } from '../../store/restaurantStore';

export const DemoRibbon: React.FC = () => {
  const { t } = useRestaurant();
  return (
    <div className="fixed top-3 right-3 z-50 pointer-events-none select-none">
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#202124] border border-[#dadce0] text-[10px] font-mono font-bold tracking-wider shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] animate-pulse" />
        {t('SiOne DEMO', 'SiOne डेमो')}
      </div>
    </div>
  );
};
