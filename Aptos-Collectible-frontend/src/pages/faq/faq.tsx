import React from 'react'
import { motion } from 'framer-motion'
import FAQItem from '../../components/FAQItem'

const faqs = [
  {
    question: "What is an NFT?",
    answer: "NFT stands for Non-Fungible Token. It's a unique digital asset that represents ownership of a specific item or piece of content, such as digital art, music, or collectibles. Unlike cryptocurrencies, each NFT is unique and can't be exchanged on a like-for-like basis."
  },
  {
    question: "How do I create an NFT on NFT Nexus?",
    answer: "To create an NFT on our platform, you need to connect your wallet, navigate to the 'Create' page, upload your digital asset, fill in the required information (title, description, etc.), set your price or auction details, and mint your NFT. Our platform guides you through each step of the process."
  },
  {
    question: "What types of files can I use to create NFTs?",
    answer: "NFT Nexus supports various file types for NFT creation, including images (JPEG, PNG, GIF), videos (MP4), audio files (MP3), and 3D models (GLB). The maximum file size is 100MB."
  },
  {
    question: "How are royalties handled on NFT Nexus?",
    answer: "When you create an NFT, you can set a royalty percentage (up to 25%) that you'll receive from future sales of your NFT. This is automatically handled by our smart contract, ensuring you continue to benefit from your work's success."
  },
  {
    question: "What are the fees for using NFT Nexus?",
    answer: "NFT Nexus charges a 2% marketplace fee on all sales. This fee is automatically deducted from the sale price. Additionally, there are gas fees for transactions on the Aptos blockchain, which vary depending on network congestion."
  },
  {
    question: "How do I purchase an NFT?",
    answer: "To purchase an NFT, connect your wallet, navigate to the NFT you want to buy, and click the 'Buy Now' button. For auctions, you can place a bid. If your bid is successful at the end of the auction, you'll be able to claim the NFT."
  },
  {
    question: "Is NFT Nexus available worldwide?",
    answer: "Yes, NFT Nexus is a global platform accessible to users worldwide. However, please be aware of and comply with your local regulations regarding NFTs and digital assets."
  }
]

const FAQPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="container mx-auto px-4 py-16 text-center">
        <motion.h1 
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Frequently Asked Questions
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Find answers to common questions about NFT Nexus
        </motion.p>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FAQItem question={faq.question} answer={faq.answer} />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default FAQPage

