import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getNFTsInAuction, getNFTDetails } from '../contracts/nftMarketplaceInteractions';
import HeroNFTCard from './HeroNFTCard'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

interface NFT {
  id: string;
  name: string;
  description: string;
  uri: string;
  price: number;
  rarity: number;
  for_sale: boolean;
  owner: string;
  originalCreator: string;
  listingDate: number;
  royaltyPercentage: number;
  is_auction: boolean;
  auction_end?: number;
  highestBid?: number;
  highestBidder?: string;
}

const defaultNFT: NFT = {
  id: "default",
  name: "Eternal Cascade",
  description: "A waterfall that flows endlessly, reflecting the infinite beauty of nature.",
  uri: "https://fastly.picsum.photos/id/572/200/200.jpg?hmac=YFsNUCQc2Dfz_5O0HY8HmDfquz04XrdcpJ0P4Z7plRY",
  price: 0,
  rarity: 1,
  for_sale: false,
  owner: "",
  originalCreator: "",
  listingDate: 0,
  royaltyPercentage: 0,
  is_auction: false
};

const Hero: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentNFTIndex, setCurrentNFTIndex] = useState(0)

  const fetchNFTs = useCallback(async () => {
    try {
      const auctionNFTs = await getNFTsInAuction(100, 0)
      const fullNFTDetails = await Promise.all(
        auctionNFTs.map(async (nft) => {
          const details = await getNFTDetails(nft.id)
          return details
        })
      )
      const validNFTs = fullNFTDetails.filter((nft): nft is NFT => nft !== null)
      setNfts(validNFTs.length > 0 ? validNFTs.slice(0, 5) : [defaultNFT]) // Display up to 5 NFTs or the default NFT
    } catch (err) {
      console.error("Failed to fetch NFTs:", err)
      setError("Failed to load NFTs. Please try again later.")
      setNfts([defaultNFT]) // Set default NFT on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNFTs()
  }, [fetchNFTs])

  const nextNFT = () => {
    setCurrentNFTIndex((prevIndex) => (prevIndex + 1) % nfts.length)
  }

  const prevNFT = () => {
    setCurrentNFTIndex((prevIndex) => (prevIndex - 1 + nfts.length) % nfts.length)
  }

  return (
    <section className="py-2 md:py-12 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
          <motion.div 
            className="w-full lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Discover & Collect
              </span>
              <br />
              <span className="text-white">Extraordinary NFTs</span>
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8">
              Dive into the future of digital ownership. Explore unique artworks, trade with confidence, and join a thriving community of collectors and creators.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/marketplace">
                <motion.button 
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full text-white text-lg font-medium hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Collection
                </motion.button>
              </Link>
              <Link to="/my-collection">
                <motion.button 
                  className="px-8 py-4 rounded-full border-2 border-purple-500 text-purple-500 text-lg font-medium hover:bg-purple-500 hover:text-white transition-all duration-300 w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create NFT
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <div className="w-full lg:w-1/2 relative h-[400px]">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-16 h-16 animate-spin text-purple-500" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 text-xl">{error}</div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentNFTIndex}
                    className="absolute inset-0 flex justify-center items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                  >
                    <HeroNFTCard nft={nfts[currentNFTIndex]} />
                  </motion.div>
                </AnimatePresence>
                {nfts.length > 1 && (
                  <>
                    <button
                      onClick={prevNFT}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                      aria-label="Previous NFT"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextNFT}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                      aria-label="Next NFT"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <motion.div 
          className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            { label: 'Artworks', value: '32k+' },
            { label: 'Artists', value: '20k+' },
            { label: 'Auctions', value: '90k+' },
            { label: 'Market Cap', value: '$25M+' },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{stat.value}</p>
              <p className="text-purple-400 text-sm uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
 
export default Hero

