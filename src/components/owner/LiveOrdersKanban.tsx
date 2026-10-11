import React, { useState } from 'react';
import { useRestaurant } from '../../store/restaurantStore';
import { RestaurantOrder, OrderStatus } from '../../data/initialOrders';
import { formatCurrency, formatElapsedTime } from '../../lib/formatters';
import {
  Clock,
  ArrowRight,
  Receipt,
  Filter,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface LiveOrdersKanbanProps {
  onOpenBilling: (order: RestaurantOrder) => void;
}

export const LiveOrdersKanban: React.FC<LiveOrdersKanbanProps> = ({ onOpenBilling }) => {
  const { orders, updateOrderStatus, isSimulatingRush, language, t } = useRestaurant();
  const [selectedTableFilter, setSelectedTableFilter] = useState<number | 'all'>('all');

  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');

  const filteredOrders = activeOrders.filter((o) =>
    selectedTableFilter === 'all' ? true : o.tableNumber === selectedTableFilter
  );

  const columns: { id: OrderStatus; labelEn: string; labelHi: string; badge: string }[] = [
    { id: 'received', labelEn: 'New Received', labelHi: 'नया ऑर्डर प्राप्त', badge: 'bg-[#e8f0fe] text-[#1a73e8]' },
    { id: 'preparing', labelEn: 'Kitchen Preparing', labelHi: 'किचन में तैयारी', badge: 'bg-[#fef7e0] text-[#b06000]' },
    { id: 'ready', labelEn: 'Ready & Plated', labelHi: 'तैयार व प्लेटेड', badge: 'bg-[#f3e8fd] text-[#9334e8]' },
    { id: 'served', labelEn: 'Served to Table', labelHi: 'टेबल पे सर्व हुआ', badge: 'bg-[#e6f4ea] text-[#137333]' },
  ];

  const getOrdersForStatus = (status: OrderStatus) =>
    filteredOrders.filter((o) => o.status === status);

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'received':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'served';
      default:
        return null;
    }
  };

  const getNextStatusLabel = (current: OrderStatus): string => {
    switch (current) {
      case 'received':
        return t('Send to Kitchen', 'किचन भेजें');
      case 'preparing':
        return t('Mark Ready', 'तैयार मार्क करें');
      case 'ready':
        return t('Mark Served', 'सर्व हुआ');
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#dadce0] text-xs font-semibold text-[#5f6368]">
            <Filter className="w-3.5 h-3.5 text-[#5f6368]" />
            <span>{t('Table Filter:', 'टेबल चुनें:')}</span>
            <select
              value={selectedTableFilter}
              onChange={(e) =>
                setSelectedTableFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
              }
              className="bg-transparent font-bold text-[#1a73e8] focus:outline-hidden"
            >
              <option value="all">{t('All Tables', 'सभी टेबल्स')} ({activeOrders.length})</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14].map((tbl) => (
                <option key={tbl} value={tbl}>
                  Table {tbl}
                </option>
              ))}
            </select>
          </div>

          {isSimulatingRush && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fef7e0] border border-[#fce8b2] text-[#b06000] text-xs font-mono font-bold animate-pulse">
              <Flame className="w-4 h-4 fill-[#ea8600]" />
              <span>{t('RUSH HOUR SIMULATION STREAMING (5 ORDERS)...', 'रश ऑवर सिमुलेशन सक्रिय — 5 ऑर्डर्स आ रहे हैं...')}</span>
            </div>
          )}
        </div>

        <div className="text-xs text-[#5f6368]">
          {t('Real-time kitchen broadcast sync', 'टेबल QR से सीधा लाइव किचन सिंक')}
        </div>
      </div>

      {/* 4-Column Minimal Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colOrders = getOrdersForStatus(col.id);

          return (
            <div
              key={col.id}
              className="bg-white border border-[#dadce0] rounded-xl p-3 flex flex-col min-h-[480px] shadow-xs"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#dadce0]">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
                    {t(col.labelEn, col.labelHi)}
                  </h3>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                    {colOrders.length}
                  </span>
                </div>
              </div>

              {/* Order Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                {colOrders.length === 0 ? (
                  <div className="py-16 text-center text-[#5f6368] text-xs">
                    {t('No orders in this state', 'कोई ऑर्डर नहीं')}
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const nextStatus = getNextStatus(order.status);
                    const nextLabel = getNextStatusLabel(order.status);

                    return (
                      <div
                        key={order.id}
                        className="p-3.5 rounded-lg bg-[#f8f9fa] border border-[#dadce0] hover:border-[#bdc1c6] hover:bg-white transition-all space-y-2.5 shadow-xs"
                      >
                        {/* Order Top Bar */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#202124] text-white">
                              T-{order.tableNumber}
                            </span>
                            <span className="font-mono text-xs font-semibold text-[#5f6368]">
                              #{order.orderNumber}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-mono text-[#5f6368]">
                            <Clock className="w-3 h-3 text-[#1a73e8]" />
                            <span>{formatElapsedTime(order.placedAt)}</span>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="text-[11px] text-[#5f6368] flex items-center justify-between">
                          <span className="font-medium text-[#202124] truncate max-w-[130px]">
                            {order.customerName}
                          </span>
                          <span className="font-mono">{order.customerPhone}</span>
                        </div>

                        {/* Items Checklist */}
                        <div className="space-y-1 pt-1 border-t border-[#e8eaed] text-xs">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-start gap-1">
                              <span className="text-[#202124]">
                                <strong className="font-mono text-[#1a73e8]">
                                  {item.quantity}x
                                </strong>{' '}
                                {language === 'hi' ? (item.hindiName || item.name) : item.name}
                              </span>
                              <span className="font-mono text-[11px] text-[#5f6368] shrink-0">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <div className="p-2 rounded bg-[#fef7e0] text-[11px] text-[#b06000] italic border border-[#fce8b2]">
                            "{order.notes}"
                          </div>
                        )}

                        {/* Total & Action Buttons */}
                        <div className="pt-2 border-t border-[#e8eaed] flex items-center justify-between">
                          <div className="font-mono font-bold text-xs text-[#202124]">
                            {formatCurrency(order.totalAmount)}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {nextStatus && (
                              <button
                                onClick={() => updateOrderStatus(order.id, nextStatus)}
                                className="px-2.5 py-1 rounded-md bg-[#1a73e8] hover:bg-[#1765c9] text-white text-[11px] font-semibold transition-colors flex items-center gap-1"
                              >
                                <span>{nextLabel}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              onClick={() => onOpenBilling(order)}
                              className="p-1 rounded-md border border-[#dadce0] hover:bg-white text-[#5f6368] hover:text-[#202124] transition-colors"
                              title={t('POS Bill & WhatsApp', 'बिलिंग व WhatsApp इनवॉइस')}
                            >
                              <Receipt className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
