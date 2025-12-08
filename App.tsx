
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Sell from './pages/Sell';
import AIGenerator from './pages/AIGenerator';
import BuyPrimary from './pages/BuyPrimary';
import BuySecondary from './pages/BuySecondary';
import RentOut from './pages/RentOut';
import Preparation from './pages/Preparation';
import Renovation from './pages/Renovation';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Dashboard from './pages/Dashboard';
import AIHub from './pages/AIHub';
import AIInvestForecast from './pages/AIInvestForecast';
import AIEcoScan from './pages/AIEcoScan';
import AIRenovationEst from './pages/AIRenovationEst';
import AITenantCheck from './pages/AITenantCheck';
import StagingAI from './pages/StagingAI';
import AISmartMatch from './pages/AISmartMatch';
import Company from './pages/Company';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { TrackingProvider } from './context/TrackingContext';

// Wrapper to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <TrackingProvider>
        <div className="flex flex-col min-h-screen font-sans text-gray-900 antialiased selection:bg-blue-200 selection:text-blue-900">
          <ScrollToTop />
          <Navbar />
          <ChatWidget />
          <main className="flex-grow pt-4 lg:pt-[100px] transition-all duration-300">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/ai" element={<AIHub />} />
              <Route path="/ai-generator" element={<AIGenerator />} />
              <Route path="/ai/invest-forecast" element={<AIInvestForecast />} />
              <Route path="/ai/eco-scan" element={<AIEcoScan />} />
              <Route path="/ai/renovation-est" element={<AIRenovationEst />} />
              <Route path="/ai/tenant-check" element={<AITenantCheck />} />
              <Route path="/ai/smart-match" element={<AISmartMatch />} />
              <Route path="/buy-new" element={<BuyPrimary />} />
              <Route path="/buy-resale" element={<BuySecondary />} />
              <Route path="/rent-out" element={<RentOut />} />
              <Route path="/preparation" element={<Preparation />} />
              <Route path="/renovation" element={<Renovation />} />
              <Route path="/staging-ai" element={<StagingAI />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/company" element={<Company />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </TrackingProvider>
    </Router>
  );
};

export default App;
