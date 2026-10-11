import React from 'react';

interface DishImageProps {
  category: string;
  name: string;
  isVeg: boolean;
  className?: string;
}

export const DishImageFallback: React.FC<DishImageProps> = ({ category, name, isVeg, className = 'h-36 w-full' }) => {
  // Curated theme styles per culinary category
  const getTheme = () => {
    switch (category) {
      case 'Wood-Fired Pizza':
        return {
          bg: 'from-amber-900/90 via-orange-950 to-neutral-900',
          accent: 'text-amber-400',
          iconType: 'pizza',
          badge: 'Wood-Fired 450°C',
        };
      case 'Burgers & Handhelds':
        return {
          bg: 'from-yellow-950/90 via-amber-950 to-stone-900',
          accent: 'text-amber-300',
          iconType: 'burger',
          badge: 'Brioche Toasted',
        };
      case 'Pastas & Bowls':
        return {
          bg: 'from-stone-900 via-yellow-950/80 to-amber-950',
          accent: 'text-yellow-400',
          iconType: 'pasta',
          badge: 'Bronze Extruded',
        };
      case 'Desserts':
        return {
          bg: 'from-rose-950/90 via-stone-950 to-neutral-900',
          accent: 'text-rose-400',
          iconType: 'dessert',
          badge: 'House Confection',
        };
      case 'Craft Beverages':
        return {
          bg: 'from-cyan-950/90 via-teal-950 to-slate-900',
          accent: 'text-cyan-300',
          iconType: 'drink',
          badge: 'Artisan Pressed',
        };
      default:
        return {
          bg: 'from-neutral-900 via-amber-950/70 to-stone-950',
          accent: 'text-amber-400',
          iconType: 'starter',
          badge: 'Chef Curated',
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${theme.bg} flex flex-col justify-between p-3 select-none text-white border border-white/10 ${className}`}
    >
      {/* Background geometric pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`pattern-${category.replace(/\s+/g, '')}`} width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#pattern-${category.replace(/\s+/g, '')})`} />
        </svg>
      </div>

      {/* Top row: Veg mark & craft badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-4 h-4 rounded-xs border flex items-center justify-center p-0.5 ${
              isVeg ? 'border-emerald-500 bg-white' : 'border-rose-600 bg-white'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
          </div>
          <span className="text-[10px] tracking-wider font-semibold text-white/80 uppercase">
            {isVeg ? 'VEG' : 'NON-VEG'}
          </span>
        </div>

        <span className="text-[10px] font-mono tracking-tight text-white/70 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10">
          {theme.badge}
        </span>
      </div>

      {/* Center artwork icon */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center py-1">
        {theme.iconType === 'pizza' && (
          <svg className="w-12 h-12 text-amber-400 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 1 10 10l-10 10L2 12A10 10 0 0 1 12 2z" />
            <circle cx="10" cy="9" r="1.5" fill="currentColor" />
            <circle cx="14" cy="13" r="1.5" fill="currentColor" />
            <circle cx="9" cy="15" r="1.2" fill="currentColor" />
          </svg>
        )}
        {theme.iconType === 'burger' && (
          <svg className="w-12 h-12 text-amber-300 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 11h16a1 1 0 0 0 1-1A6 6 0 0 0 3 10a1 1 0 0 0 1 1z" />
            <rect x="3" y="14" width="18" height="2" rx="1" fill="currentColor" fillOpacity="0.4" />
            <path d="M4 18h16a2 2 0 0 1 0 4H4a2 2 0 0 1 0-4z" />
            <circle cx="8" cy="7" r="0.7" fill="currentColor" />
            <circle cx="12" cy="6" r="0.7" fill="currentColor" />
            <circle cx="16" cy="7" r="0.7" fill="currentColor" />
          </svg>
        )}
        {theme.iconType === 'pasta' && (
          <svg className="w-12 h-12 text-yellow-300 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 10a6 6 0 0 0-12 0v2h12v-2z" />
            <path d="M4 12v6a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-6" />
            <path d="M9 10c0-3 1.5-6 3-6s3 3 3 6" strokeDasharray="2 2" />
          </svg>
        )}
        {theme.iconType === 'dessert' && (
          <svg className="w-12 h-12 text-rose-300 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
            <path d="M4 16s2-1 4-1 4 1 4 1 2-1 4-1 4 1 4 1" />
            <circle cx="12" cy="7" r="2.5" fill="currentColor" />
            <path d="M12 2v2.5" />
          </svg>
        )}
        {theme.iconType === 'drink' && (
          <svg className="w-12 h-12 text-cyan-300 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 4 14 0" />
            <path d="m7 4 5 7 5-7" />
            <path d="M12 11v8" />
            <path d="M8 21h8" />
            <path d="m14 7 4-3" strokeDasharray="1 1" />
          </svg>
        )}
        {theme.iconType === 'starter' && (
          <svg className="w-12 h-12 text-amber-300 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 19a4 4 0 0 1-4-4V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a4 4 0 0 1-4 4" />
            <path d="M9 19v3" />
            <path d="M15 19v3" />
            <path d="M7 9h10" />
            <path d="M9 13h6" />
          </svg>
        )}
      </div>

      {/* Subtle dish name bar at bottom */}
      <div className="relative z-10 pt-1 border-t border-white/10 flex items-center justify-between text-[11px] text-white/90">
        <span className="truncate font-medium">{name}</span>
        <span className="text-white/60 text-[10px] shrink-0 font-mono">Made fresh</span>
      </div>
    </div>
  );
};
