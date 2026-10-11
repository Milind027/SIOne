import React, { useState } from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { formatCurrency } from '../../lib/formatters';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, User, Phone, CheckCircle2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOrderPlaced }) => {
  const {
    cart,
    tableNumber,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartTotal,
    placeOrder,
    currentCustomer,
    language,
    t,
  } = useRestaurant();

  const [customerName, setCustomerName] = useState(language === 'hi' ? (currentCustomer.hindiName || currentCustomer.name) : currentCustomer.name);
  const [customerPhone, setCustomerPhone] = useState(currentCustomer.phone || '');
  const [orderNotes, setOrderNotes] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerPhone.trim() || customerPhone.trim().length < 6) {
      setErrorMessage(t('Please provide a valid contact number', 'कृपया सही मोबाइल नंबर दर्ज करें'));
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const newOrder = await placeOrder(customerName, customerPhone, orderNotes);
      onOrderPlaced(newOrder.id);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Could not place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto border border-[#dadce0] shadow-2xl flex flex-col text-[#202124]">
        {/* Header */}
        <div className="p-4 border-b border-[#dadce0] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-bold text-base text-[#202124]">
              {t('Table Order Cart', 'आपकी टेबल का कार्ट')}
            </h3>
            <p className="text-xs text-[#5f6368]">
              {t('Self-ordering for', 'ऑर्डर गंतव्य:')} <strong className="text-[#1a73e8]">Table {tableNumber}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 flex-1">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-[#5f6368] space-y-2">
              <p className="text-sm">{t('Your cart is currently empty', 'कार्ट में अभी कोई डिश नहीं है')}</p>
              <button
                onClick={onClose}
                className="text-xs font-semibold text-[#1a73e8] hover:underline"
              >
                {t('Browse menu to add items →', 'मेन्यू देखें और डिश जोड़ें →')}
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="divide-y divide-[#e8eaed]">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-3 h-3 rounded-xs border flex items-center justify-center p-0.5 ${
                            item.isVeg ? 'border-[#137333] bg-white' : 'border-[#d93025] bg-white'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-[#137333]' : 'bg-[#d93025]'}`} />
                        </div>
                        <h4 className="text-xs font-bold text-[#202124]">
                          {language === 'hi' ? (item.hindiName || item.name) : item.name}
                        </h4>
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-[#5f6368] italic pl-4">
                          {t('Note', 'नोट')}: "{item.notes}"
                        </p>
                      )}

                      <div className="text-xs font-mono font-semibold text-[#202124] pl-4">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>

                    {/* Quantity actions */}
                    <div className="flex items-center gap-2 bg-[#f1f3f4] rounded-lg px-2 py-1">
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            removeFromCart(item.id);
                          } else {
                            updateCartQuantity(item.id, -1);
                          }
                        }}
                        className="p-1 text-[#5f6368] hover:text-[#202124]"
                      >
                        {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-[#d93025]" /> : <Minus className="w-3.5 h-3.5" />}
                      </button>
                      <span className="font-mono font-bold text-xs min-w-[1rem] text-center text-[#202124]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-1 text-[#5f6368] hover:text-[#202124]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Box */}
              <div className="p-3 rounded-xl bg-[#f8f9fa] border border-[#dadce0] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#5f6368]">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#1a73e8]" />
                    {t('Coupon & Offers', 'कूपन व डिस्काउंट')}
                  </span>
                  {appliedCoupon && (
                    <span className="text-[11px] font-mono text-[#137333] font-bold">
                      {appliedCoupon} {t('applied', 'अप्लाई हुआ')}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. WEEKEND20, RIYA100"
                    className="flex-1 px-3 py-1.5 text-xs font-mono uppercase rounded-lg border border-[#dadce0] bg-white text-[#202124]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (couponInput.trim()) {
                        applyCoupon(couponInput.trim());
                        setCouponInput('');
                      } else if (appliedCoupon) {
                        applyCoupon(null);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#202124] text-white hover:bg-black"
                  >
                    {appliedCoupon ? t('Clear', 'हटाएं') : t('Apply', 'अप्लाई')}
                  </button>
                </div>
              </div>

              {/* Guest Information */}
              <form onSubmit={handlePlaceOrder} className="space-y-3 pt-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
                  {t('Customer Details for Invoice', 'ग्राहक विवरण')}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#5f6368]" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={t('Full Name', 'नाम')}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-[#dadce0] bg-white text-[#202124]"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-[#5f6368]" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder={t('Mobile Number', 'मोबाइल नंबर')}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-[#dadce0] bg-white text-[#202124]"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={t('Cooking instructions e.g. extra spicy, serve hot...', 'किचन निर्देश, उदा. गरमा-गरम लाएं, कम तीखा...')}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#dadce0] bg-white text-[#202124]"
                />

                {errorMessage && (
                  <p className="text-xs text-[#d93025] font-medium">{errorMessage}</p>
                )}

                {/* Bill Breakdown */}
                <div className="pt-2 border-t border-[#dadce0] space-y-1.5 text-xs text-[#5f6368]">
                  <div className="flex justify-between">
                    <span>{t('Subtotal', 'सबटोटल')}</span>
                    <span className="font-mono text-[#202124]">{formatCurrency(cartSubtotal)}</span>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-[#137333] font-semibold">
                      <span>{t('Discount', 'छूट')} ({appliedCoupon})</span>
                      <span className="font-mono">- {formatCurrency(cartDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-mono">{formatCurrency(cartTax)}</span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-[#202124] pt-2 border-t border-dashed border-[#dadce0]">
                    <span>{t('Total Amount', 'कुल रकम')}</span>
                    <span className="font-mono text-base text-[#1a73e8]">{formatCurrency(cartTotal)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-3 px-4 rounded-xl bg-[#1a73e8] hover:bg-[#1765c9] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-between disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? t('Sending to Chef...', 'किचन भेजा जा रहा है...') : t('Place Order to Kitchen', 'ऑर्डर किचन में भेजें')}</span>
                  </span>
                  <span className="font-mono text-sm flex items-center gap-1">
                    {formatCurrency(cartTotal)}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
