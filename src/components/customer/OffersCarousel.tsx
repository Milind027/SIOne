import React from 'react';
import { AVAILABLE_COUPONS, Coupon } from '../../data/couponsData';
import { useRestaurant } from '../../store/restaurantStore';
import { Tag, Check, ArrowRight } from 'lucide-react';

interface OffersCarouselProps {
  appliedCoupon: string | null;
  onApplyCoupon: (code: string | null) => void;
}

export const OffersCarousel: React.FC<OffersCarouselProps> = ({ appliedCoupon, onApplyCoupon }) => {
  const { t } = useRestaurant();

  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-[#1a73e8]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
            {t('Offers & Coupons', 'कूपन व ऑफर्स')}
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-[#1a73e8]">
          {t('Tap to Apply', '1-टैप में अप्लाई')}
        </span>
      </div>

      {/* Horizontal Scroll Carousel */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar snap-x snap-mandatory">
        {AVAILABLE_COUPONS.map((coupon: Coupon) => {
          const isApplied = appliedCoupon === coupon.code;

          return (
            <div
              key={coupon.code}
              className={`snap-center shrink-0 w-64 rounded-xl p-3 border transition-all relative bg-white ${
                isApplied
                  ? 'border-[#1a73e8] bg-[#e8f0fe]/40 ring-1 ring-[#1a73e8] shadow-xs'
                  : 'border-[#dadce0] hover:border-[#bdc1c6]'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold tracking-wider font-mono px-2 py-0.5 rounded-full bg-[#f1f3f4] text-[#202124]">
                  {t(coupon.badge, coupon.hindiBadge)}
                </span>
                <span className="text-[10px] text-[#5f6368]">
                  {t(coupon.expiryText, coupon.hindiExpiryText)}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-bold text-[#202124]">
                {t(coupon.title, coupon.hindiTitle)}
              </h3>
              <p className="text-[11px] text-[#5f6368] line-clamp-1 mt-0.5">
                {t(coupon.description, coupon.hindiDescription)}
              </p>

              {/* Coupon Code Pill & Action Button */}
              <div className="mt-2.5 pt-2 border-t border-[#e8eaed] flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase text-[#202124] px-2 py-0.5 bg-[#f8f9fa] rounded border border-dashed border-[#dadce0]">
                  {coupon.code}
                </span>

                <button
                  onClick={() => onApplyCoupon(isApplied ? null : coupon.code)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                    isApplied
                      ? 'bg-[#137333] text-white shadow-xs'
                      : 'bg-[#1a73e8] hover:bg-[#1765c9] text-white'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3 h-3" />
                      {t('Applied', 'अप्लाई हुआ')}
                    </>
                  ) : (
                    <>
                      {t('Apply', 'अप्लाई')}
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
