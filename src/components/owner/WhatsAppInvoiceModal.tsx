import React, { useState } from 'react';
import { RestaurantOrder } from '../../data/initialOrders';
import { useRestaurant } from '../../store/restaurantStore';
import { formatCurrency } from '../../lib/formatters';
import { MessageSquare, Copy, Check, ExternalLink, X, CheckCheck } from 'lucide-react';

interface WhatsAppInvoiceModalProps {
  order: RestaurantOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppInvoiceModal: React.FC<WhatsAppInvoiceModalProps> = ({ order, isOpen, onClose }) => {
  const { outletName, outletPhone, language, t } = useRestaurant();
  const [copied, setCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen || !order) return null;

  const billWord = t('Bill', 'बिल');
  const totalWord = t('Total', 'कुल');
  const thanksWord = t('Thank you!', 'धन्यवाद!');
  const linkWord = t('E-Invoice Link', 'ई-इनवॉइस लिंक');

  const itemsListFormatted = order.items
    .map((item) => {
      const name = language === 'hi' ? (item.hindiName || item.name) : item.name;
      return `${name} x${item.quantity}: ₹${item.price * item.quantity}`;
    })
    .join('\n');

  const formattedWhatsAppMessage = `*${billWord} - ${t(`Table ${order.tableNumber}`, `टेबल ${order.tableNumber}`)}*
${itemsListFormatted}
----------------------------------------
*${totalWord}:* ₹${order.totalAmount} · ${thanksWord}
_SiOne Digital Invoice · Zero Paper_ 🌿
https://sione.app/receipt/${order.orderNumber}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedWhatsAppMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToWhatsApp = () => {
    setIsSent(true);
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(
      formattedWhatsAppMessage
    )}`;
    try {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-[#dadce0] text-[#202124] max-h-[92vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#dadce0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#202124]">
                {t('WhatsApp Digital Invoice', 'WhatsApp डिजिटल इनवॉइस')}
              </h3>
              <p className="text-xs text-[#5f6368]">
                {t(`Table ${order.tableNumber}`, `टेबल ${order.tableNumber}`)} · {order.customerName} ({order.customerPhone})
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

        {/* Realistic WhatsApp Chat Bubble Mockup from SiOne Video (timestamp 00:27) */}
        <div className="p-4 rounded-xl bg-[#e5ddd5] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#5f6368]">
            <span className="font-medium text-[#202124]">{t('WhatsApp Business Verified', 'WhatsApp बिजनेस वेरिफाइड')}</span>
            <span className="flex items-center gap-1 text-[#128C7E] font-bold font-mono">
              <CheckCheck className="w-4 h-4 text-[#34B7F1]" /> 9:02 PM
            </span>
          </div>

          {/* Green chat bubble */}
          <div className="bg-[#dcf8c6] rounded-xl rounded-tr-xs p-3.5 shadow-sm border border-[#c1e7a5] font-sans text-xs whitespace-pre-wrap leading-relaxed text-[#202124] select-all">
            <div className="font-bold text-sm text-[#111] mb-1">
              {t(`Bill - Table ${order.tableNumber}`, `बिल - टेबल ${order.tableNumber}`)}
            </div>
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between py-0.5">
                <span>{language === 'hi' ? (it.hindiName || it.name) : it.name} x{it.quantity}</span>
                <span className="font-mono font-medium">₹{it.price * it.quantity}</span>
              </div>
            ))}
            <div className="mt-2 pt-1 border-t border-[#b7dc9a] flex justify-between font-bold">
              <span>{t('Total:', 'कुल:')}</span>
              <span className="font-mono text-sm">₹{order.totalAmount} · {t('Thank you!', 'धन्यवाद!')}</span>
            </div>
            <div className="text-[10px] text-[#555] mt-1 italic">
              {t('E-Invoice Link:', 'ई-इनवॉइस लिंक:')} https://sione.app/receipt/{order.orderNumber}
            </div>
          </div>
        </div>

        {/* Paper Zero Message matching video */}
        <div className="p-3 bg-[#e6f4ea] border border-[#ceead6] rounded-xl flex items-center justify-between text-xs text-[#137333]">
          <span className="font-semibold">
            {t('Paper used: 0 Sheets (100% Digital Eco Friendly)', 'पेपर? ज़ीरो! 100% डिजिटल इनवॉइस')}
          </span>
          <span className="font-mono font-bold">0g Paper</span>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={handleCopy}
            className="py-2.5 px-4 rounded-lg border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#202124] flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-[#137333]" /> : <Copy className="w-4 h-4 text-[#5f6368]" />}
            {copied ? t('Copied Message!', 'कॉपी हो गया!') : t('Copy Text', 'टेक्स्ट कॉपी करें')}
          </button>

          <button
            onClick={handleSendToWhatsApp}
            className="py-2.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{isSent ? t('Dispatched!', 'WhatsApp पे भेजा ✓') : t('Send via WhatsApp', 'WhatsApp पे भेजें')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
