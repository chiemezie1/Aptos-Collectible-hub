import React from 'react'
import { motion } from 'framer-motion'

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, list an NFT, or communicate with us. This may include your name, email address, wallet address, and any other information you choose to provide. We also automatically collect certain information about your device and usage of our platform, including your IP address, browser type, operating system, and interactions with our website and services."
    },
    {
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, communicate with you, and comply with legal obligations. We may also use your information to personalize your experience, detect and prevent fraud, and conduct research and analysis to enhance our platform."
    },
    {
      title: "Sharing of Information",
      content: "We may share your information with third-party service providers who perform services on our behalf, such as hosting, data analysis, and customer service. We may also share information when required by law or to protect our rights and the rights of our users."
    },
    {
      title: "Security",
      content: "We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet or electronic storage system is 100% secure, and we cannot guarantee absolute security."
    },
    {
      title: "Your Rights and Choices",
      content: "You may update, correct, or delete your account information at any time by logging into your account or contacting us. You may also opt out of receiving promotional communications from us by following the instructions in those communications."
    },
    {
      title: "Changes to This Privacy Policy",
      content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date at the top of this policy."
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
          Privacy Policy
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
            At NFT Nexus, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services.
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

