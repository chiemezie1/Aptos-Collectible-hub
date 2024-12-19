import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Heart, Clock, Tag, Shield, User } from 'lucide-react'
import { purchaseNFT } from '../contracts/nftMarketplaceInteractions'
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { MessageAlert } from '../utils/MessageAlert'
import { getRarityLabel } from '../utils/rarityUtils'

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
  attributes?: {
    trait_type: string;
    value: string;
  }[];
  history?: {
    type: string;
    from: string;
    to: string;
    price: number;
    date: string;
  }[];
}

interface NFTDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: NFT;
  onRefresh: () => void;
}

export default function NFTDetailsModal({ isOpen, onClose, nft, onRefresh }: NFTDetailsModalProps) {
  const [purchasing, setPurchasing] = useState(false)
  const [liked, setLiked] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' as 'info' | 'success' | 'warning' | 'error' })

  const showAlert = (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    setAlert({ show: true, message, type })
  }

  const hideAlert = () => {
    setAlert({ show: false, message: '', type: 'info' })
  }

  const handlePurchase = async () => {
    setPurchasing(true)
    try {
      const success = await purchaseNFT(nft.id, nft.price)
      if (success) {
        showAlert(`Successfully purchased ${nft.name} for ${nft.price} APT`, "success")
        onRefresh()
      }
    } catch (error) {
      console.error('Purchase failed:', error)
      showAlert("Failed to purchase NFT. Please try again.", "error")
    } finally {
      setPurchasing(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: nft.name,
        text: nft.description,
        url: window.location.href,
      })
    } catch (error) {
      console.log('Sharing failed:', error)
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{nft.name}</DialogTitle>
        </DialogHeader>
        {alert.show && (
          <MessageAlert
            message={alert.message}
            onClose={hideAlert}
            type={alert.type}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden">
              <img
                src={`https://gateway.pinata.cloud/ipfs/${nft.uri}`}
                alt={nft.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{nft.name}</h1>
                <p className={`${rarityColor}`}>Rarity: {rarityLabel}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setLiked(!liked)}
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-current text-red-500' : ''}`} />
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>Listed {new Date(nft.listingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-5 w-5 text-gray-500" />
                    <span className="text-2xl font-bold">{nft.price} APT</span>
                  </div>
                </div>

                <Button
                  onClick={handlePurchase}
                  disabled={!nft.for_sale || purchasing}
                  className="w-full"
                >
                  {purchasing ? 'Processing...' : nft.for_sale ? 'Buy Now' : 'Not for Sale'}
                </Button>
              </CardContent>
            </Card>

            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <p className="text-gray-300">{nft.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Creator</p>
                      <p className="text-sm">{nft.originalCreator.slice(0, 6)}...{nft.originalCreator.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Royalty</p>
                      <p className="text-sm">{nft.royaltyPercentage}%</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attributes">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {nft.attributes?.map((attr, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-500">{attr.trait_type}</p>
                        <p className="font-medium">{attr.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="space-y-4">
                  {nft.history?.map((event, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{event.type}</p>
                          <p className="text-sm text-gray-500">
                            From {event.from.slice(0, 6)}...{event.from.slice(-4)} to{' '}
                            {event.to.slice(0, 6)}...{event.to.slice(-4)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{event.price} APT</p>
                          <p className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

