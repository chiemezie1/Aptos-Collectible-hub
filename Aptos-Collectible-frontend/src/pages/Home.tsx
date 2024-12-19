import { useState } from 'react';
import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';
import { motion } from 'framer-motion';
import {  Palette, DollarSign, Gavel, ShoppingCart } from 'lucide-react';
import TrendingCollections from '../components/TrendingCollections';
import NewsletterSignup from '../components/NewsletterSignup';


const Home = () => {

  return (
    <div className="space-y-16">
      <Hero />
      <FeaturedSection />
      <HowItWorksSection />
      <TrendingCollections />
      <NewsletterSignup />
    </div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    { icon: Palette, title: "Create NFT", description: "Mint your own unique NFT" },
    { icon: DollarSign, title: "List for Sale", description: "Sell your NFT on the marketplace" },
    { icon: Gavel, title: "Place Bid", description: "Participate in exciting auctions" },
    { icon: ShoppingCart, title: "Purchase", description: "Buy NFTs directly from creators" },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center bg-gray-800 rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <step.icon className="w-16 h-16 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;

