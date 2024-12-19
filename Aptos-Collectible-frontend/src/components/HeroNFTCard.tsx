import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom';
import { Clock, Zap, User } from 'lucide-react'

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

function CountdownTimer({ endTime }: { endTime: number }) {
  const [timeLeft, setTimeLeft] = React.useState('')

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = endTime * 1000 - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft('Auction ended')
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return <span className="font-mono text-sm">{timeLeft}</span>
}

const HeroNFTCard: React.FC<{ nft: NFT }> = ({ nft }) => (
  <motion.div
    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 w-full max-w-sm mx-auto"
    whileHover={{ scale: 1.03 }}
  >
    <div className="relative">
      <img src={`https://gateway.pinata.cloud/ipfs/${nft.uri}`} alt={nft.name} className="w-full h-64 sm:h-80 object-cover" />
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black to-transparent">
        <h3 className="text-xl sm:text-2xl font-bold text-white truncate">{nft.name}</h3>
        <p className="text-gray-300 text-xs sm:text-sm mt-1 line-clamp-2">{nft.description}</p>
      </div>
    </div>
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">Current Bid</p>
          <p className="text-white font-bold text-xl sm:text-2xl">{nft.highestBid || nft.price} APT</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs mb-1">Ends in</p>
          <div className="flex items-center text-yellow-400">
            <Clock className="w-4 h-4 mr-1" />
            {nft.auction_end && <CountdownTimer endTime={nft.auction_end} />}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-gray-300 text-sm">
            {nft.originalCreator.slice(0, 6)}...{nft.originalCreator.slice(-4)}
          </span>
        </div>
        <div className="text-gray-400 text-sm">
          #{nft.id}
        </div>
      </div>
      <Link to='/auctions'>
        <motion.button
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 sm:py-3 px-4 rounded-full text-base sm:text-lg transition-all duration-300 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-5 h-5 mr-2" />
          Place Bid
        </motion.button>
      </Link>
    </div>
  </motion.div>
)

export default HeroNFTCard

