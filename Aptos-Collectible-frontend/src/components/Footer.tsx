import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <img className="h-10" src="/Aptos_Primary_WHT.png" alt="NFT Marketplace Logo" />
            <p className="text-gray-400 text-base">
              Discover, collect, and sell extraordinary NFTs
            </p>
            <div className="flex space-x-6">
              {/* Add social media icons here */}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Marketplace</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/marketplace" className="text-base text-gray-400 hover:text-white">
                      All NFTs
                    </Link>
                  </li>
                  <li>
                    <Link to="/auctions" className="text-base text-gray-400 hover:text-white">
                      Live Auctions
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Account</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/about" className="text-base text-gray-400 hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-collection" className="text-base text-gray-400 hover:text-white">
                      My Collection
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Resources</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/help" className="text-base text-gray-400 hover:text-white">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-base text-gray-400 hover:text-white">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/privacy" className="text-base text-gray-400 hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-base text-gray-400 hover:text-white">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2024 NFT Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

