import React from 'react'
import { motion } from 'framer-motion'
import { Search, Book, MessageCircle, Phone } from 'lucide-react'

export default function HelpCenterPage() {
  const categories = [
    { icon: Book, title: "Getting Started", description: "Learn the basics of using NFT Nexus" },
    { icon: MessageCircle, title: "FAQ", description: "Find answers to common questions" },
    { icon: Phone, title: "Contact Support", description: "Get in touch with our support team" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="container mx-auto px-4 py-16 text-center">
        <motion.h1 
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Help Center
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Find answers, get support, and learn more about NFT Nexus
        </motion.p>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="mb-16">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for help..." 
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Help Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div 
                key={index}
                className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-400">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-8 text-center">Popular Articles</h2>
          <ul className="space-y-4 max-w-2xl mx-auto">
            {[
              "How to create your first NFT",
              "Understanding gas fees and transaction costs",
              "Securing your NFT wallet",
              "Participating in NFT auctions",
              "Transferring NFTs between wallets",
            ].map((article, index) => (
              <motion.li 
                key={index}
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <a href="#" className="text-blue-400 hover:underline">{article}</a>
              </motion.li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

