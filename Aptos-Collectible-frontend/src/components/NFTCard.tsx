import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { purchaseNFT } from '../contracts/nftMarketplaceInteractions'
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter } from "./ui/card"
import NFTDetailsModal from './NFTDetailsModal'
import { getRarityLabel } from '../utils/rarityUtils'
import { useWallet } from '@aptos-labs/wallet-adapter-react'

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

interface NFTCardProps {
  nft: NFT;
  onRefresh: () => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { account } = useWallet()

  const handleBuy = async () => {
    if (account?.address === nft.owner) {
      setMessage('You already own this NFT.')
      return
    }
    setIsLoading(true)
    setMessage(null)

    try {
      const success = await purchaseNFT(nft.id, nft.price)
      if (success) {
        setMessage(`NFT purchased successfully for ${nft.price} APT.`)
        onRefresh()
      } else {
        setMessage('Failed to purchase the NFT. Please try again.')
      }
    } catch (err) {
      setMessage('An error occurred during the purchase.')
    } finally {
      setIsLoading(false)
    }
  }

  const rarityLabel = getRarityLabel(nft.rarity)
  const rarityColor = {
    1: "text-gray-400",
    2: "text-green-400",
    3: "text-blue-400",
    4: "text-purple-400",
    5: "text-yellow-400"
  }[nft.rarity] || "text-gray-400"

  return (
    <>
      <Card className="bg-gray-800 text-white overflow-hidden">
        <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
          <img src={`https://gateway.pinata.cloud/ipfs/${nft.uri}`} alt={nft.name} className="w-full h-48 object-cover" />
        </div>
        <CardContent className="p-4 space-y-2">
          <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
            <h3 className="text-xl font-semibold hover:text-blue-400">{nft.name}</h3>
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">{nft.description}</p>
          <p className="text-sm text-gray-400">Creator: {nft.originalCreator.slice(0, 6)}...{nft.originalCreator.slice(-4)}</p>
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${rarityColor}`}>Rarity: {rarityLabel}</span>
            <span className="text-lg font-bold">{nft.price} APT</span>
          </div>
          {message && <p className="text-sm text-yellow-400">{message}</p>}
        </CardContent>
        <CardFooter className="p-4">
          <Button
            onClick={handleBuy}
            disabled={isLoading || !nft.for_sale || account?.address === nft.owner}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : account?.address === nft.owner ? (
              'You Own This NFT'
            ) : nft.for_sale ? (
              'Buy Now'
            ) : (
              'Not for Sale'
            )}
          </Button>
        </CardFooter>
      </Card>
      <NFTDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nft={nft}
        onRefresh={onRefresh}
      />
    </>
  )
}

export default NFTCard

