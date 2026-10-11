import React, { useState } from 'react';
import { RestaurantOrder } from '../../data/initialOrders';
import { useRestaurant } from '../../store/restaurantStore';
import { formatCurrency } from '../../lib/formatters';
import { WhatsAppInvoiceModal } from './WhatsAppInvoiceModal';
import {
  CreditCard,
  QrCode,
  Banknote,
  Printer,
  MessageSquare,
  CheckCircle2,
  X,
  Receipt,
} from 'lucide-react';

interface BillingPosModalProps {
  order: RestaurantOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BillingPosModal: React.FC<BillingPosModalProps> = ({ order, isOpen, onClose }) => {
  const { outletName, outletAddress, gstin, settleOrderPayment, language, t } = useRestaurant();
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'UPI' | 'Card' | 'Cash' | 'WhatsApp'>('WhatsApp');
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  if (!isOpen || !order) return null;

  const handleSettle = () => {
    settleOrderPayment(order.id, selectedPaymentMode);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-[#dadce0] text-[#202124] max-h-[92vh] overflow-y-auto space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#dadce0]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-bold">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#202124]">
                  {t('SiOne POS Billing', 'SiOne POS बिलिंग')}
                </h3>
                <p className="text-xs text-[#5f6368]">
                  {t(`Table ${order.tableNumber}`, `टेबल ${order.tableNumber}`)} · {t('Order', 'ऑर्डर')} #{order.orderNumber}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Restaurant Tax Header */}
          <div className="text-center space-y-0.5 text-xs text-[#5f6368] border-b border-[#dadce0] pb-3">
            <h4 className="font-bold text-sm text-[#202124]">{outletName}</h4>
            <p>{outletAddress}</p>
            <p className="font-mono text-[11px]">GSTIN: {gstin}</p>
          </div>

          {/* Itemized Bill Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
              <span>{t('Item Description', 'आइटम विवरण')}</span>
              <span className="font-mono">{t('Amount', 'रकम')}</span>
            </div>

            <div className="divide-y divide-[#e8eaed] text-xs">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#202124]">
                      {item.quantity}x {language === 'hi' ? (item.hindiName || item.name) : item.name}
                    </span>
                  </div>
                  <span className="font-mono font-medium text-[#202124]">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-dashed border-[#dadce0] space-y-1.5 text-xs text-[#5f6368]">
              <div className="flex justify-between">
                <span>{t('Subtotal', 'सबटोटल')}</span>
                <span className="font-mono text-[#202124]">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#137333] font-semibold">
                  <span>{t('Discount Promo', 'छूट')} ({order.couponCode || 'APPLIED'})</span>
                  <span className="font-mono">- {formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t('GST (5%)', 'जीएसटी (5%)')}</span>
                <span className="font-mono">{formatCurrency(order.taxes)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#202124] pt-2 border-t border-[#dadce0]">
                <span>{t('Total Due', 'कुल बिल')}</span>
                <span className="font-mono text-[#1a73e8] text-lg">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#5f6368]">
              {t('Payment / Settlement Mode', 'पेमेंट माध्यम')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedPaymentMode('WhatsApp')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  selectedPaymentMode === 'WhatsApp'
                    ? 'border-[#25D366] bg-[#e6f4ea] text-[#137333]'
                    : 'border-[#dadce0] hover:bg-[#f8f9fa]'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMode('UPI')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  selectedPaymentMode === 'UPI'
                    ? 'border-[#1a73e8] bg-[#e8f0fe] text-[#1a73e8]'
                    : 'border-[#dadce0] hover:bg-[#f8f9fa]'
                }`}
              >
                <QrCode className="w-4 h-4 text-[#1a73e8]" />
                <span>UPI QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMode('Cash')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  selectedPaymentMode === 'Cash'
                    ? 'border-[#137333] bg-[#e6f4ea] text-[#137333]'
                    : 'border-[#dadce0] hover:bg-[#f8f9fa]'
                }`}
              >
                <Banknote className="w-4 h-4 text-[#137333]" />
                <span>{t('Cash', 'नकद')}</span>
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="space-y-2 pt-2 border-t border-[#dadce0]">
            <div className="flex gap-2">
              <button
                onClick={() => setIsWhatsAppOpen(true)}
                className="flex-1 py-2.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('Send WhatsApp Invoice', 'WhatsApp पे इनवॉइस भेजें')}</span>
              </button>

              <button
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-lg border border-[#dadce0] hover:bg-[#f1f3f4] text-xs font-semibold text-[#5f6368] flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>{t('Print', 'प्रिंट')}</span>
              </button>
            </div>

            <button
              onClick={handleSettle}
              disabled={order.paymentStatus === 'paid'}
              className={`w-full py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                order.paymentStatus === 'paid'
                  ? 'bg-[#e6f4ea] text-[#137333] cursor-not-allowed'
                  : 'bg-[#1a73e8] hover:bg-[#1765c9] text-white shadow-xs'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {order.paymentStatus === 'paid'
                ? t('Bill Settled & Table Closed', 'बिल चुकता (टेबल खाली किया गया)')
                : `${t('Settle Bill', 'बिल क्लोज करें')} · ${formatCurrency(order.totalAmount)}`}
            </button>
          </div>
        </div>
      </div>

      <WhatsAppInvoiceModal
        order={order}
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />
    </>
  );
};
