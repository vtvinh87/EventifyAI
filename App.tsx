import React, { useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import { vi } from './lang/vi';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import { ChatbotWidget } from './features/chatbot/ChatbotWidget';
import { Spinner } from './components/UI';

// --- Page Imports (Lazy Loading) ---
const HomePage = lazy(() => import('./pages/HomePage'));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const MyTicketsPage = lazy(() => import('./pages/MyTicketsPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
const PaymentCancelPage = lazy(() => import('./pages/PaymentCancelPage'));
const EventAnalyticsPage = lazy(() => import('./pages/dashboard/EventAnalyticsPage'));
const OverviewPage = lazy(() => import('./pages/dashboard/OverviewPage'));
const ManageEventPage = lazy(() => import('./pages/dashboard/ManageEventPage'));
const CreateEventPage = lazy(() => import('./pages/dashboard/CreateEventPage')); // Import new page
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));


// --- i1n Translation Utility ---
const t = (key: string, options?: Record<string, string>): string => {
  let value: any = vi;
  try {
    for (const k of key.split('.')) {
      value = value[k];
    }
    if (typeof value !== 'string') throw new Error();
    
    if (options) {
      Object.entries(options).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, v);
      });
    }

    return value;
  } catch (e) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
};

const LoadingFallback: React.FC = () => (
    <div className="flex items-center justify-center h-screen w-screen fixed inset-0 bg-gray-900 z-[200]">
        <Spinner size="lg" />
    </div>
);


// --- Main App Component ---

export default function App() {
  const { theme } = useAppStore();
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="bg-gray-900 dark:bg-black text-gray-200 min-h-screen font-sans transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-950/50 via-transparent to-black z-0"></div>
      <div className="relative z-10">
        <HashRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/discover" element={<DiscoverPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/my-tickets" element={<MyTicketsPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                {/* Updated create-event route */}
                <Route path="/create-event" element={<CreateEventPage />} />
                <Route path="/payment/success" element={<PaymentSuccessPage />} />
                <Route path="/payment/cancel" element={<PaymentCancelPage />} />
                <Route path="/events/:id/analytics" element={<EventAnalyticsPage />} />
              </Route>

              {/* Dashboard Layout Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<OverviewPage />} />
                  <Route path="events" element={<ManageEventPage />} />
                   {/* Add edit event route */}
                  <Route path="events/:id/edit" element={<CreateEventPage />} />
                  <Route path="analytics-overview" element={<div className="p-8 text-white"><h1 className="text-2xl font-bold">Tổng quan Phân tích</h1></div>} />
              </Route>
              

              {/* Routes without MainLayout */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Routes>
          </Suspense>
        </HashRouter>
        <ChatbotWidget />
      </div>
    </div>
  );
}