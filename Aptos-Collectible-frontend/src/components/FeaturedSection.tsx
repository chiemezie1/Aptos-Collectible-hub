import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { getAllNFTsForSale, getNFTDetails } from '../contracts/nftMarketplaceInteractions'
import NFTCard from './NFTCard'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

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

const FeaturedNFTs: React.FC = () => {
  const [featuredNFTs, setFeaturedNFTs] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const { account } = useWallet()

  const NFTsPerPage = 4

  useEffect(() => {
    const fetchFeaturedNFTs = async () => {
      if (!account?.address) {
        setError("Wallet not connected.")
        return
      }

      setLoading(true)
      setError(null)

      try {
        const nftIds = await getAllNFTsForSale(12, 0) // Fetch 12 NFTs for featured section
        const fetchedNFTs = await Promise.all(
          nftIds.map(async (nft) => {
            const details = await getNFTDetails(nft.id)
            return details as NFT | null
          })
        )

        const validNFTs = fetchedNFTs.filter((nft): nft is NFT => nft !== null)
        setFeaturedNFTs(validNFTs)
      } catch (error) {
        console.error("Failed to fetch featured NFTs:", error)
        setError("Failed to fetch featured NFTs. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedNFTs()
  }, [account])

  const nextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % Math.ceil(featuredNFTs.length / NFTsPerPage))
  }

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + Math.ceil(featuredNFTs.length / NFTsPerPage)) % Math.ceil(featuredNFTs.length / NFTsPerPage))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  const displayedNFTs = featuredNFTs.slice(currentPage * NFTsPerPage, (currentPage + 1) * NFTsPerPage)

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-purple-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Featured NFTs
        </h2>
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {displayedNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} onRefresh={() => {}} />
            ))}
          </motion.div>
          <div className="flex justify-between mt-8">
            <Button
              onClick={prevPage}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2"
              aria-label="Previous Page"
            >
              <ChevronLeft size={24} />
            </Button>
            <Button
              onClick={nextPage}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2"
              aria-label="Next Page"
            >
              <ChevronRight size={24} />
            </Button>
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <Link to="/marketplace">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300">
              Explore All NFTs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedNFTs

