import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Wallet, LogOut } from 'lucide-react';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { AptosClient } from 'aptos';

const client = new AptosClient(process.env.REACT_APP_APTOS_FULLNODE_URL!);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation(); // React Router's hook for current path
  const { connected, account, network, disconnect } = useWallet();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        try {
          const resources: any[] = await client.getAccountResources(account.address);
          const accountResource = resources.find(
            (r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
          );
          if (accountResource) {
            const balanceValue = (accountResource.data as any).coin.value;
            setBalance(balanceValue ? parseInt(balanceValue) / 100000000 : 0);
          } else {
            setBalance(0);
          }
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    if (connected) {
      fetchBalance();
    }
  }, [account, connected]);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setBalance(null);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const navItems = [
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Auctions', href: '/auctions' },
    { name: 'Collection', href: '/my-collection' },
  ];

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="/Aptos_Primary_WHT.png"
                alt="NFT Marketplace Logo"
              />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.href
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {connected && account ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connected
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-50 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <div className="px-4 py-2 text-sm text-gray-700">
                          <p className="font-bold">Address:</p>
                          <p className="truncate">{account.address}</p>
                        </div>
                        <div className="px-4 py-2 text-sm text-gray-700">
                          <p className="font-bold">Network:</p>
                          <p>{network ? network.name : 'Unknown'}</p>
                        </div>
                        <div className="px-4 py-2 text-sm text-gray-700">
                          <p className="font-bold">Balance:</p>
                          <p>
                            {balance !== null
                              ? `${balance.toFixed(2)} APT`
                              : 'Loading...'}
                          </p>
                        </div>
                        <button
                          onClick={handleDisconnect}
                          className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100 hover:text-red-900"
                          role="menuitem"
                        >
                          <LogOut className="inline-block mr-2 h-4 w-4" />
                          Disconnect
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <WalletSelector />
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              {connected && account ? (
                <div className="w-full">
                  <button
                    onClick={toggleDropdown}
                    className="w-full flex items-center justify-between bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium transition-colors duration-300"
                  >
                    <span className="flex items-center">
                      <Wallet className="mr-2 h-5 w-5" />
                      Connected
                    </span>
                    <ChevronDown className="h-5 w-5" />
                  </button>
                  {isDropdownOpen && (
                     <div className="z-50 mt-2 w-full rounded-md shadow-lg bg-gray-800 ring-1 ring-gray-700 ring-opacity-5">
                     <div
                       className="py-1"
                       role="menu"
                       aria-orientation="vertical"
                       aria-labelledby="options-menu"
                     >
                       <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                         <p className="font-bold text-white">Address:</p>
                         <p className="truncate">{account.address}</p>
                       </div>
                       <div className="px-4 py-2 text-sm bg-gray-700 text-gray-300 border-b border-gray-700">
                         <p className="font-bold text-white">Network:</p>
                         <p>{network ? network.name : 'Unknown'}</p>
                       </div>
                       <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                         <p className="font-bold text-white">Balance:</p>
                         <p>
                           {balance !== null
                             ? `${balance.toFixed(2)} APT`
                             : 'Loading...'}
                         </p>
                       </div>
                        <button
                          onClick={handleDisconnect}
                          className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100 hover:text-red-900"
                          role="menuitem"
                        >
                          <LogOut className="inline-block mr-2 h-4 w-4" />
                          Disconnect
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full">
                  <WalletSelector />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
