import React, { useState, useEffect, useCallback } from 'react'
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { getNFTsInAuction, getNFTDetails } from '../../contracts/nftMarketplaceInteractions'
import AuctionCard from '../../components/AuctionCard'
import { MessageAlert } from '../../utils/MessageAlert'

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

export default function Auctions() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { account } = useWallet()

  const fetchNFTs = useCallback(async () => {
    if (!account?.address) {
      setError("Wallet not connected.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('Fetching NFTs in auction')
      const auctionNFTs = await getNFTsInAuction(100, 0)
      console.log('Fetched auction NFTs:', auctionNFTs)

      const fullNFTDetails = await Promise.all(
        auctionNFTs.map(async (nft) => {
          const details = await getNFTDetails(nft.id)
          return details
        })
      )

      const validNFTs = fullNFTDetails.filter((nft): nft is NFT => nft !== null)
      console.log('Full NFT details:', validNFTs)
      setNfts(validNFTs)
    } catch (err) {
      console.error("Failed to fetch NFTs:", err)
      setError("Failed to load NFTs. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [account])

  useEffect(() => {
    fetchNFTs()
  }, [fetchNFTs])

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Live Auctions</h1>
      
      {loading && <p className="text-white">Loading auctions...</p>}
      {error && <MessageAlert message={error} type="error" onClose={() => setError(null)} />}
      {!loading && nfts.length === 0 && !error && <p className="text-white">No active auctions found.</p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <AuctionCard key={nft.id} nft={nft} onRefresh={fetchNFTs} />
        ))}
      </div>
    </div>
  )
}

