import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/marketplace/marketplace';
import MyCollection from './pages/collection/collection';
import Auctions from './pages/auctions/auctions';
import HelpCenterPage from './pages/help/help';
import AboutPage from './pages/about/about';
import Footer from './components/Footer';
import TermsOfServicePage from './pages/privacy/privacy';
import FAQPage from './pages/faq/faq';
import PrivacyPolicyPage from './pages/privacy/privacy';
import NotFoundPage from './pages/notfound/not-found';
import WalletNotConnectedPage from './pages/notconnected/wallet-not-connected';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/my-collection" element={<MyCollection />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/wallet-not-connected" element={<WalletNotConnectedPage />} />
            <Route path="/*" element={<NotFoundPage />} />
Z          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
