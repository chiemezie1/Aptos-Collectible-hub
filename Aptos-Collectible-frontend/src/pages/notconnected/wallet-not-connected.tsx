import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, ArrowRight } from 'lucide-react';

export default function WalletNotConnectedPage() {
  const navigate = useNavigate();

  const handleConnect = () => {
    // Implement your wallet connection logic here
    // For this example, we'll just simulate a connection and redirect
    setTimeout(() => {
      navigate('/my-collection');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
      <div className="text-center max-w-2xl px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Wallet className="w-24 h-24 mx-auto mb-6 text-blue-400" />
        </motion.div>
        <motion.h1 
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Wallet Not Connected
        </motion.h1>
        <motion.p
          className="text-xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Oops! Looks like your wallet is feeling a bit shy. Let's introduce it to our amazing NFT collection!
        </motion.p>
        <motion.button
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center mx-auto"
          onClick={handleConnect}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Connect Wallet
          <ArrowRight className="ml-2" />
        </motion.button>
        <motion.p
          className="mt-6 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Don't worry, we promise your wallet won't get stage fright!
        </motion.p>
      </div>
    </div>
  );
}
