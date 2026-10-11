import React, { useState, useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from './store/restaurantStore';
import { LandingPage } from './pages/LandingPage';
import { CustomerQrApp } from './pages/CustomerQrApp';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { DemoRibbon } from './components/common/DemoRibbon';
import { GuidedTour } from './components/common/GuidedTour';

function AppContent() {
  const { setTableNumber } = useRestaurant();

  // Route state: 'landing' | 'owner' | 'customer'
  const [route, setRoute] = useState<'landing' | 'owner' | 'customer'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = window.location.search;
      if (path === '/menu' || search.includes('table=')) {
        return 'customer';
      }
      if (path === '/owner' || search.includes('view=owner')) {
        return 'owner';
      }
    }
    return 'landing';
  });

  const [ownerActiveTab, setOwnerActiveTab] = useState<string>('orders');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      if (path === '/menu' || search.includes('table=')) {
        setRoute('customer');
      } else if (path === '/owner' || search.includes('view=owner')) {
        setRoute('owner');
      } else {
        setRoute('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newRoute: 'landing' | 'owner' | 'customer', tableNum?: number) => {
    setRoute(newRoute);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (newRoute === 'customer') {
        const t = tableNum || 4;
        setTableNumber(t);
        url.pathname = '/menu';
        url.searchParams.set('table', t.toString());
      } else if (newRoute === 'owner') {
        url.pathname = '/owner';
        url.searchParams.delete('table');
      } else {
        url.pathname = '/';
        url.searchParams.delete('table');
        url.searchParams.delete('view');
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  const handleTourNavigate = (tabHint: string) => {
    if (route !== 'owner') {
      navigateTo('owner');
    }
    setOwnerActiveTab(tabHint);
  };

  return (
    <div className="relative min-h-screen">
      {/* Demo ribbon in corner */}
      <DemoRibbon />

      {/* Main Pages */}
      {route === 'landing' && (
        <LandingPage
          onSelectOwner={() => navigateTo('owner')}
          onSelectCustomer={(t) => navigateTo('customer', t)}
          onStartTour={() => {
            navigateTo('owner');
            setOwnerActiveTab('orders');
          }}
        />
      )}

      {route === 'owner' && (
        <OwnerDashboard
          activeTab={ownerActiveTab}
          onTabChange={(tab) => setOwnerActiveTab(tab)}
          onOpenCustomerQr={(t) => navigateTo('customer', t)}
        />
      )}

      {route === 'customer' && (
        <CustomerQrApp
          onBackToOwner={() => navigateTo('owner')}
        />
      )}

      {/* Floating Demo Guide */}
      <GuidedTour
        onNavigateToTab={handleTourNavigate}
        onOpenCustomerQr={() => navigateTo('customer', 4)}
      />
    </div>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <AppContent />
    </RestaurantProvider>
  );
}
