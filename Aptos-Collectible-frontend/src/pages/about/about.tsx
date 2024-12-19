import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, Coins } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="container mx-auto px-4 py-16 text-center">
        <motion.h1 
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to NFT Nexus
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          The next-generation NFT marketplace powered by Aptos blockchain
        </motion.p>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Our Mission</h2>
          <p className="text-lg text-gray-300 mb-4">
            At NFT Nexus, we're revolutionizing the digital art and collectibles space by providing a secure, efficient, and user-friendly platform for creators and collectors alike. Our mission is to empower artists, fuel innovation, and build a thriving ecosystem for unique digital assets.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Lightning-Fast Transactions", description: "Experience near-instantaneous minting, buying, and selling with Aptos blockchain." },
              { icon: Shield, title: "Robust Security", description: "State-of-the-art security measures to protect your digital assets and transactions." },
              { icon: Coins, title: "Low Fees", description: "Enjoy minimal marketplace fees, maximizing your earnings and savings." },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-gray-800 p-6 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-8">Join the Revolution</h2>
          <p className="text-lg text-gray-300 mb-6">
            Whether you're an artist looking to showcase your work, a collector searching for the next big thing, or an enthusiast exploring the world of NFTs, NFT Nexus is your gateway to the future of digital ownership.
          </p>
          <motion.a 
            href="/marketplace" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore the Marketplace
            <ArrowRight className="ml-2" />
          </motion.a>
        </section>
      </main>
    </div>
  )
}

