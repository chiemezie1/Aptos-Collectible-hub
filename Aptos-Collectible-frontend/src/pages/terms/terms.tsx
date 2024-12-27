import React from 'react'
import { motion } from 'framer-motion'

export default function TermsOfServicePage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing or using NFT Nexus, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services."
    },
    {
      title: "Use of Services",
      content: "You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services in any way that violates any applicable local, state, national, or international law or regulation."
    },
    {
      title: "User Accounts",
      content: "To access certain features of our platform, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device."
    },
    {
      title: "Intellectual Property",
      content: "The content, features, and functionality of NFT Nexus are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our services without our explicit permission."
    },
    {
      title: "NFT Transactions",
      content: "When you create, buy, or sell NFTs on our platform, you are interacting with smart contracts on the Aptos blockchain. You acknowledge that blockchain transactions are irreversible and we cannot recover or reverse any transactions or mistakes."
    },
    {
      title: "Fees and Payments",
      content: "We charge a 2% marketplace fee on all sales. This fee is automatically deducted from the sale price. You are also responsible for any gas fees required to process transactions on the Aptos blockchain."
    },
    {
      title: "Limitation of Liability",
      content: "To the fullest extent permitted by law, NFT Nexus shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses."
    },
    {
      title: "Governing Law",
      content: "These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions."
    },
    {
      title: "Changes to Terms",
      content: "We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion."
    }
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
          Terms of Service
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Last Updated: June 15, 2023
        </motion.p>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          <p className="text-lg text-gray-300">
            Welcome to NFT Nexus. These Terms of Service govern your use of our website and services. Please read these terms carefully before using our platform.
          </p>
          {sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              <p className="text-gray-300">{section.content}</p>
            </motion.section>
          ))}
        </div>
      </main>
    </div>
  )
}

