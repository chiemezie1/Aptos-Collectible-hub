import React, { useState, useEffect } from 'react'
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { Loader2, Clock, Award, Tag } from 'lucide-react'
import { placeBid, getAuctionWinner, purchaseNFT } from '../contracts/nftMarketplaceInteractions'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Badge } from "./ui/badge"

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

interface AuctionCardProps {
  nft: NFT
  onRefresh: () => void
}

const AuctionCard: React.FC<AuctionCardProps> = ({ nft, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [winner, setWinner] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isBidModalOpen, setIsBidModalOpen] = useState(false)
  const { account } = useWallet()

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const endTime = nft.auction_end ? nft.auction_end * 1000 : 0
      const difference = endTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft('Auction ended')
        clearInterval(timer)
        handleGetWinner()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [nft.auction_end])

  const handlePlaceBid = async () => {
    if (!nft.id || parseFloat(bidAmount) <= 0) {
      setMessage('Please provide a valid bid amount.')
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const success = await placeBid(nft.id, parseFloat(bidAmount))
      if (success) {
        setMessage(`Bid of ${bidAmount} APT placed successfully`)
        onRefresh()
        setIsBidModalOpen(false)
      } else {
        setMessage('Failed to place bid. Please try again.')
      }
    } catch (err) {
      setMessage('An error occurred while placing the bid.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetWinner = async () => {
    try {
      const auctionWinner = await getAuctionWinner(nft.id)
      setWinner(auctionWinner)
    } catch (err) {
      console.error('Failed to retrieve the auction winner:', err)
    }
  }

  const handlePurchase = async () => {
    if (nft.highestBid === undefined) {
      setMessage('Highest bid is not available.')
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const success = await purchaseNFT(nft.id, nft.highestBid)
      if (success) {
        setMessage(`NFT purchased successfully for ${nft.highestBid} APT.`)
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

  const isUserHighestBidder = account?.address === nft.highestBidder

  return (
    <Card className="bg-gray-800 text-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img src={`https://gateway.pinata.cloud/ipfs/${nft.uri}`} alt={nft.name} className="w-full h-48 object-cover" />
        <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
          {nft.rarity === 1 ? 'Common' : 
           nft.rarity === 2 ? 'Uncommon' : 
           nft.rarity === 3 ? 'Rare' : 
           nft.rarity === 4 ? 'Epic' : 'Legendary'}
        </Badge>
      </div>
      <CardContent className="p-4 space-y-3">
        <h3 className="text-xl font-bold">{nft.name}</h3>
        <p className="text-sm text-gray-400 line-clamp-2">{nft.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-green-400 flex items-center">
            <Tag className="w-4 h-4 mr-1" />
            Highest Bid
          </span>
          <span className="text-lg font-bold">
            {nft.highestBid && nft.highestBid > 0 ? `${nft.highestBid} APT` : "Awaiting first bid"}
          </span>
        </div>
        {nft.highestBid && nft.highestBid > 0 && nft.highestBidder && (
          <p className="text-sm text-gray-400 flex items-center">
            <Award className="w-4 h-4 mr-1" />
            Top Bidder: {nft.highestBidder.slice(0, 6)}...{nft.highestBidder.slice(-4)}
          </p>
        )}
        {isUserHighestBidder && (
          <p className="text-sm font-semibold text-yellow-400 flex items-center">
            <Award className="w-4 h-4 mr-1" />
            You're the highest bidder!
          </p>
        )}
        <p className="text-sm text-gray-400 flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {timeLeft === 'Auction ended' ? 'Auction ended' : `Ends in: ${timeLeft}`}
        </p>
        {message && <p className="text-sm text-yellow-400">{message}</p>}
      </CardContent>
      <CardFooter className="p-4">
        {timeLeft !== 'Auction ended' ? (
          isUserHighestBidder ? (
            <p className="text-center text-yellow-400 font-semibold">You're the highest bidder!</p>
          ) : (
            <Button
              onClick={() => setIsBidModalOpen(true)}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              Place Bid
            </Button>
          )
        ) : winner && account?.address === winner ? (
          <Button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Purchase NFT'}
          </Button>
        ) : (
          <p className="text-center text-gray-400">Auction has concluded</p>
        )}
      </CardFooter>

      <Dialog open={isBidModalOpen} onOpenChange={setIsBidModalOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Place Your Bid</DialogTitle>
          </DialogHeader>
          <Input
            type="number"
            placeholder="Enter bid amount in APT"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          />
          <DialogFooter>
            <Button
              onClick={handlePlaceBid}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm Bid'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default AuctionCard

