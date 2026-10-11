import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { generateQrDataUrl } from '../../lib/qrUtils';
import { QrCode, Printer, ExternalLink, Sparkles } from 'lucide-react';

interface QrTableGeneratorViewProps {
  onOpenCustomerView: (tableNum: number) => void;
}

export const QrTableGeneratorView: React.FC<QrTableGeneratorViewProps> = ({ onOpenCustomerView }) => {
  const { outletName, tableNumber, setTableNumber, t } = useRestaurant();
  const [selectedTable, setSelectedTable] = useState(tableNumber);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const tableUrl = `${window.location.origin}/menu?table=${selectedTable}`;

  useEffect(() => {
    generateQrDataUrl(tableUrl).then((url) => setQrDataUrl(url));
  }, [tableUrl, selectedTable]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#202124]">
            {t('Table Stand QR Generator', 'टेबल स्टैंड QR कोड जनरेटर')}
          </h3>
          <p className="text-xs text-[#5f6368]">
            {t('Generate and print acrylic QR stand cards for dine-in tables.', 'हर टेबल के लिए स्टैंड कार्ड बनाएं और तुरंत प्रिंट करें।')}
          </p>
        </div>

        {/* Table Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5f6368] font-semibold">{t('Table Number:', 'टेबल नंबर:')}</span>
          <select
            value={selectedTable}
            onChange={(e) => {
              const num = parseInt(e.target.value);
              setSelectedTable(num);
              setTableNumber(num);
            }}
            className="px-3 py-1.5 rounded-lg border border-[#dadce0] bg-white text-xs font-bold text-[#202124] focus:outline-hidden"
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {t(`Table ${i + 1}`, `टेबल ${i + 1}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Printable Stand Card Preview */}
        <div className="p-8 rounded-2xl bg-white text-[#202124] border border-[#dadce0] shadow-md flex flex-col items-center text-center space-y-5 max-w-sm mx-auto w-full relative">
          <div className="w-10 h-10 rounded-xl bg-[#d93025] text-white mx-auto flex items-center justify-center font-bold text-lg shadow-xs">
            🛎️
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-base tracking-tight text-[#202124]">SiOne</h4>
            <p className="text-xs text-[#5f6368] font-medium">
              {outletName}
            </p>
          </div>

          {/* QR Code Container */}
          <div className="p-3 bg-white rounded-xl shadow-xs border border-[#dadce0]">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for Table ${selectedTable}`}
                className="w-44 h-44 block"
              />
            ) : (
              <div className="w-44 h-44 bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs">
                Generating QR...
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="inline-block px-4 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-sm font-bold font-mono">
              {t(`TABLE #${selectedTable}`, `टेबल #${selectedTable}`)}
            </div>

            <p className="text-xs text-[#5f6368] max-w-xs leading-relaxed pt-1">
              {t('1. Scan QR code with phone camera', '1. फोन कैमरा से QR स्कैन करें')} <br />
              {t('2. Browse menu & order directly to kitchen', '2. मेन्यू देखें और सीधा किचन को ऑर्डर करें')}
            </p>
          </div>

          <div className="text-[10px] text-[#5f6368] font-mono pt-2 border-t border-[#e8eaed] w-full">
            {t('Zero Paper Billing · Powered by SiOne', 'कागज़ ज़ीरो · SiOne द्वारा संचालित')}
          </div>
        </div>

        {/* Actions & Fast Table Grid */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-white border border-[#dadce0] shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-[#202124]">
              {t('Instant QR Table Deployment', 'त्वरित टेबल डिप्लॉयमेंट')}
            </h4>

            <div className="space-y-2 text-xs text-[#5f6368]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1a73e8] shrink-0" />
                <span>{t(`Auto-detected deep link for Table ${selectedTable}`, `Table ${selectedTable} के लिए ऑटो-डिटेक्टेड लिंक`)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1a73e8] shrink-0" />
                <span>{t('Zero app installation required for customers', 'ग्राहकों को कोई ऐप डाउनलोड करने की जरूरत नहीं')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1a73e8] shrink-0" />
                <span>{t('Instant live sync with chef KDS screen', 'ऑर्डर सीधे किचन और बिलिंग काउंटर पे सिंक')}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => onOpenCustomerView(selectedTable)}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#1a73e8] hover:bg-[#1765c9] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t(`Test Table ${selectedTable} QR App`, `Table ${selectedTable} QR ऐप टेस्ट करें`)}</span>
              </button>

              <button
                onClick={handlePrint}
                className="py-2.5 px-4 rounded-lg border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#202124] flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>{t('Print Acrylic Stand', 'स्टैंड कार्ड प्रिंट करें')}</span>
              </button>
            </div>
          </div>

          {/* Quick Table Grid */}
          <div className="p-5 rounded-xl bg-white border border-[#dadce0] shadow-xs space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#5f6368]">
              {t('Quick Table Select', 'टेबल चुनें')}
            </h4>

            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 18 }).map((_, i) => {
                const tNum = i + 1;
                return (
                  <button
                    key={tNum}
                    onClick={() => {
                      setSelectedTable(tNum);
                      setTableNumber(tNum);
                    }}
                    className={`py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedTable === tNum
                        ? 'bg-[#1a73e8] text-white shadow-xs'
                        : 'bg-[#f8f9fa] border border-[#dadce0] text-[#202124] hover:bg-[#f1f3f4]'
                    }`}
                  >
                    T-{tNum}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
