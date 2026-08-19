import { Suspense, lazy, useEffect, useMemo } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';

import { CartDrawer } from './components/ui/CartDrawer';
import { SearchPanel } from './components/ui/SearchPanel';
import { MobileMenu } from './components/ui/MobileMenu';
import { AuthPanel } from './components/ui/AuthPanel';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { FluidPageTransition } from './components/layout/FluidPageTransition';
import { CursorEffect } from './components/ui/CursorEffect';
import { useLenis } from './hooks/useLenis';
import { RequireAuth } from './components/auth/RequireAuth';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const NewArrivals = lazy(() => import('./pages/NewArrivals'));
const Lookbook = lazy(() => import('./pages/Lookbook'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Collections = lazy(() => import('./pages/Collections'));
const CollectionDetail = lazy(() => import('./pages/CollectionDetail'));
const CollectionExperience = lazy(() => import('./pages/CollectionExperience'));
const Watch = lazy(() => import('./pages/Watch'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Shipping = lazy(() => import('./pages/Shipping'));
const GiftCards = lazy(() => import('./pages/GiftCards'));
const Loyalty = lazy(() => import('./pages/Loyalty'));
const Stores = lazy(() => import('./pages/Stores'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

function PageFallback() {
  return (
    <div className="fixed inset-0 atelier-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="atelier-eyebrow text-ink-mute tracking-widest">VOID</div>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-sienna to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const { checkAuth, isAuthenticated, isGuest } = useAuthStore();
  const { initTheme } = useThemeStore();
  
  useLenis();
  
  useEffect(() => {
    initTheme();
    checkAuth();
  }, [initTheme, checkAuth]);

  const hasAccess = isAuthenticated || isGuest;

  const { isAuthPage, isAdminPage, isCheckoutPage } = useMemo(() => ({
    isAuthPage: location.pathname.startsWith('/auth'),
    isAdminPage: location.pathname.startsWith('/admin'),
    isCheckoutPage: location.pathname.startsWith('/checkout'),
  }), [location.pathname]);

  return (
    <div className="min-h-[100dvh] atelier-bg grain-overlay">

      {!isAuthPage && !isAdminPage && !isCheckoutPage && <Navigation />}
      
      <CursorEffect />
      <CartDrawer />
      <SearchPanel />
      <MobileMenu />
      <AuthPanel />
      
      <AnimatePresence mode="wait">
        <FluidPageTransition key={location.pathname}>
          <Suspense fallback={<PageFallback />}>
            <Routes location={location}>
              <Route
                path="/"
                element={hasAccess ? <Home /> : <Navigate to="/auth/login" replace />}
              />
              <Route
                path="/home"
                element={hasAccess ? <Home /> : <Navigate to="/auth/login" replace />}
              />
              <Route path="/products" element={<Products />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/lookbook" element={<Lookbook />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/ivory-series" element={<CollectionExperience />} />
              <Route path="/collections/:slug" element={<CollectionDetail />} />
              <Route path="/watches" element={<Watch />} />
              <Route path="/watch" element={<Watch />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
              <Route path="/auth/*" element={<Auth />} />
              <Route path="/dashboard/*" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/admin/*" element={<RequireAuth><Admin /></RequireAuth>} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/gift-cards" element={<GiftCards />} />
              <Route path="/loyalty" element={<Loyalty />} />
              <Route path="/stores" element={<Stores />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </FluidPageTransition>
      </AnimatePresence>
      
      {!isAuthPage && !isAdminPage && !isCheckoutPage && <Footer />}
    </div>
  );
}
