import React, { useState } from 'react';
import { useRestaurant } from '../store/restaurantStore';
import { LiveOrdersKanban } from '../components/owner/LiveOrdersKanban';
import { InventoryView } from '../components/owner/InventoryView';
import { MenuManagementView } from '../components/owner/MenuManagementView';
import { CrmView } from '../components/owner/CrmView';
import { QrTableGeneratorView } from '../components/owner/QrTableGeneratorView';
import { BillingPosModal } from '../components/owner/BillingPosModal';
import { LedgerView } from '../components/owner/LedgerView';
import { AnalyticsView } from '../components/owner/AnalyticsView';
import { MarketingView } from '../components/owner/MarketingView';
import { PremiumPlansModal } from '../components/owner/PremiumPlansModal';
import { ComingSoonModal } from '../components/common/ComingSoonModal';
import { RestaurantOrder } from '../data/initialOrders';
import { formatCurrency } from '../lib/formatters';
import {
  UtensilsCrossed,
  LayoutDashboard,
  Receipt,
  Package,
  BookOpen,
  Users,
  QrCode,
  Flame,
  Volume2,
  VolumeX,
  Sparkles,
  ExternalLink,
  TrendingUp,
  CreditCard,
  BarChart3,
  Megaphone,
  Globe,
} from 'lucide-react';

interface OwnerDashboardProps {
  onOpenCustomerQr: (tableNum?: number) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  onOpenCustomerQr,
  activeTab: controlledTab,
  onTabChange,
}) => {
  const {
    outletName,
    orders,
    soundEnabled,
    setSoundEnabled,
    isSimulatingRush,
    triggerRushHourSimulation,
    language,
    setLanguage,
    t,
  } = useRestaurant();

  type TabKey = 'orders' | 'billing' | 'inventory' | 'menu' | 'ledger' | 'analytics' | 'marketing' | 'crm' | 'qr';

  const [internalTab, setInternalTab] = useState<TabKey>('orders');
  const currentTab = (controlledTab as TabKey) || internalTab;

  const setCurrentTab = (tab: TabKey) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const [billingOrder, setBillingOrder] = useState<RestaurantOrder | null>(null);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [comingSoonTitle, setComingSoonTitle] = useState<string | null>(null);

  // Exact KPIs matching video
  const totalRevenue = 48250;
  const activeOrdersCount = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length;

  const handleOpenBilling = (order: RestaurantOrder) => {
    setBillingOrder(order);
    setIsBillingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] flex flex-col font-sans selection:bg-[#1a73e8] selection:text-white">
      {/* Google Console Minimal Clean Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#dadce0] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Brand Wordmark & SiOne Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d93025] text-white flex items-center justify-center font-bold shadow-xs">
              <span className="text-lg">🛎️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-[#202124]">
                  SiOne
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333]">
                  REST-OS LIVE
                </span>
              </div>
              <p className="text-[11px] text-[#5f6368] hidden sm:block">
                {t('Complete restaurant in one app: Billing to Marketing', 'पूरा रेस्टोरेंट, एक ही ऐप में: बिलिंग से मार्केटिंग तक')}
              </p>
            </div>
          </div>

          {/* Action Tools: Language Toggle (EN/हिंदी), Sound, Rush Hour, Table 7 QR */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center border border-[#dadce0] rounded-lg overflow-hidden bg-white text-xs font-semibold">
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1.5 transition-colors ${
                  language === 'hi' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-[#5f6368] hover:bg-[#f1f3f4]'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1.5 transition-colors ${
                  language === 'en' ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold' : 'text-[#5f6368] hover:bg-[#f1f3f4]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border transition-colors ${
                soundEnabled
                  ? 'bg-[#e8f0fe] border-[#c2e7ff] text-[#1a73e8]'
                  : 'bg-white border-[#dadce0] text-[#5f6368]'
              }`}
              title={soundEnabled ? 'Kitchen chime active' : 'Audio muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Rush Hour Button */}
            <button
              onClick={triggerRushHourSimulation}
              disabled={isSimulatingRush}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                isSimulatingRush
                  ? 'bg-[#fef7e0] text-[#b06000] border border-[#fce8b2] animate-pulse'
                  : 'bg-[#202124] hover:bg-black text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#ea8600]" />
              <span className="hidden sm:inline">
                {isSimulatingRush ? t('Rush Streaming...', 'रश शुरू...') : t('Simulate Rush Hour', 'रश ऑवर सिमुलेट')}
              </span>
              <span className="sm:hidden">Rush</span>
            </button>

            {/* Launch Table 7 QR Dining App */}
            <button
              onClick={() => onOpenCustomerQr(7)}
              className="px-3 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#1765c9] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t('Customer App (Table 7)', 'ग्राहक QR (Table 7)')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop-first restaurant OS navigation */}
      <div className="owner-workspace">
        <aside className="owner-sidebar">
          <div className="owner-sidebar-brand"><div className="owner-brand-mark">S</div><div><strong>SiOne</strong><span>RESTAURANT OS</span></div></div>
          <div className="owner-outlet-chip"><span className="owner-status-dot" /> {outletName || "The Artisan Kitchen"} <span className="owner-chevron">⌄</span></div>
          <p className="owner-nav-label">WORKSPACE</p>
          <nav className="owner-nav-list" aria-label="Restaurant workspace">
            <button className={"owner-nav-item " + (currentTab === "orders" ? "active" : "")} onClick={() => setCurrentTab("orders")}><LayoutDashboard /><span>Dashboard</span><i>⌘1</i></button>
            <button className={"owner-nav-item " + (currentTab === "billing" ? "active" : "")} onClick={() => setCurrentTab("billing")} id="tour-billing"><Receipt /><span>POS Billing</span><i>⌘2</i></button>
            <button className="owner-nav-item" onClick={() => setCurrentTab("orders")}><Flame /><span>Live Orders</span><b className="owner-live-count">{activeOrdersCount}</b></button>
            <button className={"owner-nav-item " + (currentTab === "menu" ? "active" : "")} onClick={() => setCurrentTab("menu")}><BookOpen /><span>Menu Management</span></button>
            <button className={"owner-nav-item " + (currentTab === "inventory" ? "active" : "")} onClick={() => setCurrentTab("inventory")} id="tour-inventory"><Package /><span>Inventory</span></button>
            <button className={"owner-nav-item " + (currentTab === "ledger" ? "active" : "")} onClick={() => setCurrentTab("ledger")}><CreditCard /><span>Purchases & Finance</span></button>
            <button className={"owner-nav-item " + (currentTab === "analytics" ? "active" : "")} onClick={() => setCurrentTab("analytics")}><BarChart3 /><span>Reports & Analytics</span></button>
            <button className={"owner-nav-item " + (currentTab === "marketing" ? "active" : "")} onClick={() => setCurrentTab("marketing")}><Megaphone /><span>Marketing & Loyalty</span></button>
            <button className={"owner-nav-item " + (currentTab === "crm" ? "active" : "")} onClick={() => setCurrentTab("crm")}><Users /><span>Customers / CRM</span></button>
            <button className={"owner-nav-item " + (currentTab === "qr" ? "active" : "")} onClick={() => setCurrentTab("qr")} id="tour-customer-qr"><QrCode /><span>Table QR Codes</span></button>
          </nav>
          <p className="owner-nav-label owner-nav-label-lower">OPERATIONS</p>
          <button className="owner-nav-item" onClick={() => setComingSoonTitle("Staff Management")}><Users /><span>Staff & Shifts</span><b className="owner-soon">PRO</b></button>
          <button className="owner-nav-item" onClick={() => setComingSoonTitle("Restaurant Settings")}><Globe /><span>Settings</span></button>
          <div className="owner-sidebar-bottom"><div className="owner-help-icon">✦</div><strong>Need a hand?</strong><p>Explore the guided tour to get the most out of SiOne.</p><button onClick={() => setComingSoonTitle("SiOne Help Centre")}>Open help centre <ExternalLink /></button></div>
          <div className="owner-profile"><div className="owner-avatar">MP</div><div><strong>Restaurant Admin</strong><span>Owner access</span></div><span className="owner-profile-more">•••</span></div>
        </aside>
        <main className="owner-main flex-1 w-full px-4 sm:px-6 xl:px-8 py-6 space-y-5">
          <div className="owner-page-heading"><div><p>OVERVIEW / RESTAURANT</p><h1>{currentTab === "orders" ? "Good evening, Admin" : ({billing:"POS Billing",menu:"Menu Management",inventory:"Inventory",ledger:"Purchases & Finance",analytics:"Reports & Analytics",marketing:"Marketing & Loyalty",crm:"Customers & CRM",qr:"Table QR Codes"} as Record<string,string>)[currentTab] || "Restaurant Operations"}</h1><span>Here’s what’s happening at your outlet today.</span></div><div className="owner-heading-date"><span className="owner-status-dot" /> Outlet is open <span className="owner-date-divider" /> <span>{new Date().toLocaleDateString("en-IN",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})}</span></div></div>
        {/* Google Analytics / Search Console Minimal KPI Scorecard */}
        <div id="tour-dashboard" className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Card 1: Today's Revenue */}
          <div className="bg-white border border-[#dadce0] rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#5f6368] font-medium">
              <span>{t("Today's Settled Revenue", 'आज की कुल बिक्री')}</span>
              <span className="text-[10px] font-mono font-bold text-[#137333] bg-[#e6f4ea] px-1.5 py-0.5 rounded">
                +14.2%
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#202124] mt-1.5">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-[11px] text-[#5f6368] mt-1 flex items-center gap-1">
              <span className="text-[#137333]">↑ ₹5,800</span> {t('vs yesterday', 'कल के मुकाबले')}
            </div>
          </div>

          {/* Card 2: Occupied Tables */}
          <div className="bg-white border border-[#dadce0] rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#5f6368] font-medium">
              <span>{t('Active Occupancy', 'सक्रिय टेबल्स')}</span>
              <span className="text-[10px] font-mono font-bold text-[#1a73e8] bg-[#e8f0fe] px-1.5 py-0.5 rounded">
                58% {t('Full', 'फुल')}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#202124] mt-1.5">
              14 / 24 <span className="text-xs font-normal text-[#5f6368]">{t('Tables', 'टेबल्स')}</span>
            </div>
            <div className="text-[11px] text-[#5f6368] mt-1">
              {t('Table 7 active now · QR Dine', 'Table 7 सक्रिय है · QR डाइन')}
            </div>
          </div>

          {/* Card 3: Live Orders in Kitchen */}
          <div className="bg-white border border-[#dadce0] rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#5f6368] font-medium">
              <span>{t('Live Kitchen Tickets', 'किचन में सक्रिय टिकट्स')}</span>
              <span className="text-[10px] font-mono font-bold text-[#b06000] bg-[#fef7e0] px-1.5 py-0.5 rounded">
                {activeOrdersCount} {t('Pending', 'पेंडिंग')}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#202124] mt-1.5">
              {activeOrdersCount} <span className="text-xs font-normal text-[#5f6368]">{t('Live', 'लाइव')}</span>
            </div>
            <div className="text-[11px] text-[#5f6368] mt-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {t('Real-time sync on', 'रियल-टाइम सिंक सक्रिय')}
            </div>
          </div>

          {/* Card 4: Avg Turnaround Time */}
          <div className="bg-white border border-[#dadce0] rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#5f6368] font-medium">
              <span>{t('Avg Kitchen Prep', 'औसत तैयारी समय')}</span>
              <span className="text-[10px] font-mono font-bold text-[#137333] bg-[#e6f4ea] px-1.5 py-0.5 rounded">
                -3 {t('min', 'मिनट')}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#202124] mt-1.5">
              18 <span className="text-xs font-normal text-[#5f6368]">{t('minutes', 'मिनट')}</span>
            </div>
            <div className="text-[11px] text-[#5f6368] mt-1">
              {t('Woodstone oven & tandoor hot', 'तंदूर व ओवन रेडी')}
            </div>
          </div>
        </div>

        {/* Google Analytics Style Navigation Tabs */}
        <div className="hidden">
          <button
            onClick={() => setCurrentTab('orders')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'orders'
                ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold'
                : 'text-[#5f6368] hover:bg-[#f1f3f4]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t('03 · Live Orders', '03 · लाइव ऑर्डर्स')}</span>
          </button>

          <button
            id="tour-billing-legacy"
            onClick={() => setCurrentTab('billing')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'billing'
                ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold'
                : 'text-[#5f6368] hover:bg-[#f1f3f4]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>{t('01 · Billing & WhatsApp', '01 · बिलिंग (WhatsApp)')}</span>
          </button>

          <button
            onClick={() => setCurrentTab('menu')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'menu'
                ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold'
                : 'text-[#5f6368] hover:bg-[#f1f3f4]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('02 · Menu Manager', '02 · मेन्यू मैनेजर')}</span>
          </button>

          <button
            id="tour-inventory-legacy"
            onClick={() => setCurrentTab('inventory')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'inventory'
                ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold'
                : 'text-[#5f6368] hover:bg-[#f1f3f4]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{t('05 · Stock & Alerts', '05 · स्टॉक (अलर्ट)')}</span>
          </button>

          <button
            onClick={() => setCurrentTab('ledger')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'ledger'
                ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold'
                : 'text-[#5f6368] hover:bg-[#f1f3f4]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{t('06 · Liabilities & Assets', '06 · देनदारी + एसेट्स')}</span>
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'analytics'
                ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold'
                : 'text-[#5f6368] hover:bg-[#f1f3f4]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t('07 · Analytics (Reports)', '07 · एनालिटिक्स')}</span>
          </button>

          <button
            onClick={() => setCurrentTab('marketing')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'marketing'
                ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold'
                : 'text-[#5f6368] hover:bg-[#f1f3f4]'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>{t('08 & 09 · Marketing', '08 & 09 · मार्केटिंग')}</span>
          </button>

          <button
            id="tour-customer-qr-legacy"
            onClick={() => setCurrentTab('qr')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'qr'
                ? 'bg-[#e8f0fe] text-[#1a73e8] font-bold'
                : 'text-[#5f6368] hover:bg-[#f1f3f4]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t('QR Stands', 'टेबल QR स्टैंड')}</span>
          </button>

          <div className="ml-auto pl-2 shrink-0">
            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-[#fce8b2] bg-[#fef7e0] text-[#b06000] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#feefc3] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ea8600]" />
              <span>{t('Premium Suite', '10 · प्रीमियम')}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Live Orders Kanban */}
        {currentTab === 'orders' && (
          <div id="tour-live-orders">
            <LiveOrdersKanban onOpenBilling={handleOpenBilling} />
          </div>
        )}

        {/* Tab 2: Billing & POS */}
        {currentTab === 'billing' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#202124]">
                  {t('1-Tap POS Billing & WhatsApp Dispatch', 'एक टैप में बिल — इनवॉइस सीधा ग्राहक के WhatsApp पे')}
                </h3>
                <p className="text-xs text-[#5f6368]">
                  {t('Zero thermal paper wasted. Direct tax receipt delivery.', 'पेपर? ज़ीरो! 100% डिजिटल इनवॉइसिंग।')}
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#dadce0] bg-[#f8f9fa] text-[#5f6368] font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">{t('Order / Table', 'ऑर्डर / टेबल')}</th>
                      <th className="py-3 px-4">{t('Customer', 'ग्राहक')}</th>
                      <th className="py-3 px-4">{t('Items Ordered', 'डिशेज')}</th>
                      <th className="py-3 px-4 text-right">{t('Bill Amount', 'बिल')}</th>
                      <th className="py-3 px-4">{t('Status', 'स्थिति')}</th>
                      <th className="py-3 px-4 text-right">{t('Actions', 'कार्रवाई')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8eaed]">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#f8f9fa] transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#202124] font-mono">
                            #{o.orderNumber}
                          </span>
                          <span className="text-[#1a73e8] font-semibold text-[11px] ml-2">
                            {t(`Table ${o.tableNumber}`, `टेबल ${o.tableNumber}`)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#202124]">{o.customerName}</div>
                          <div className="text-[11px] font-mono text-[#5f6368]">{o.customerPhone}</div>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs truncate text-[#5f6368]">
                          {o.items.map((i) => `${i.quantity}x ${language === 'hi' ? (i.hindiName || i.name) : i.name}`).join(', ')}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-[#202124]">
                          {formatCurrency(o.totalAmount)}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              o.paymentStatus === 'paid'
                                ? 'bg-[#e6f4ea] text-[#137333]'
                                : 'bg-[#fef7e0] text-[#b06000]'
                            }`}
                          >
                            {o.paymentStatus === 'paid' ? t('PAID', 'भुगतान संपन्न') : t('PENDING', 'बाकी')} {o.paymentMode ? `(${o.paymentMode})` : ''}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            id="tour-whatsapp-invoice"
                            onClick={() => handleOpenBilling(o)}
                            className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-xs transition-colors"
                          >
                            {t('WhatsApp Invoice →', 'WhatsApp इनवॉइस →')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Menu */}
        {currentTab === 'menu' && <MenuManagementView />}

        {/* Tab 4: Inventory */}
        {currentTab === 'inventory' && <InventoryView />}

        {/* Tab 5: Ledger (Liabilities + Assets) */}
        {currentTab === 'ledger' && <LedgerView />}

        {/* Tab 6: Analytics */}
        {currentTab === 'analytics' && <AnalyticsView />}

        {/* Tab 7: Marketing & Loyalty */}
        {currentTab === 'marketing' && <MarketingView />}

        {/* Customer relationship management */}
        {currentTab === 'crm' && <CrmView />}

        {/* Tab 8: QR Table Stand Generator */}
        {currentTab === 'qr' && (
          <QrTableGeneratorView
            onOpenCustomerView={(tbl) => onOpenCustomerQr(tbl)}
          />
        )}
        </main>
      </div>

      {/* POS Billing Modal */}
      <BillingPosModal
        order={billingOrder}
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
      />

      {/* Premium Plans Modal */}
      <PremiumPlansModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onSelectPlan={(plan) => {
          setIsPremiumModalOpen(false);
          setComingSoonTitle(`${plan} Upgrade`);
        }}
      />

      {/* Polished Coming Soon Modal */}
      <ComingSoonModal
        isOpen={Boolean(comingSoonTitle)}
        onClose={() => setComingSoonTitle(null)}
        featureTitle={comingSoonTitle || 'Feature Module'}
      />
    </div>
  );
};
