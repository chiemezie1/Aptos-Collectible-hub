import { useState } from 'react';
import { motion } from 'framer-motion';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement newsletter signup logic here
    console.log('Signing up with email:', email);
    setIsSubmitted(true);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-2xl">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-gray-200 mb-8">Get the latest news and updates from the NFT world</p>
          {isSubmitted ? (
            <motion.div
              className="text-green-300 text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Thank you for subscribing!
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-l-lg sm:rounded-r-none mb-2 sm:mb-0 w-full sm:w-auto text-gray-900"
                required
              />
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-r-lg sm:rounded-l-none transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSignup;

