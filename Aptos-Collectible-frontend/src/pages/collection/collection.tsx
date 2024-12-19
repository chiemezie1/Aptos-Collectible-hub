import React, { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Button } from "../../components/ui/button"
import { PlusCircle } from 'lucide-react'
import NFTCard from '../../components/CollectionNFTCard'
import CreateNFTModal from '../../components/CreateNFTModal'
import { TransferNFTModal } from '../../components/TransferNFTModal'
import { getAllNFTsForOwner, getNFTDetails, transferOwnership, setPrice, listForSale, deleteNFT } from '../../contracts/nftMarketplaceInteractions'
import { MessageAlert } from '../../utils/MessageAlert'
import { message } from 'antd'

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

export default function MyCollection() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
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
      const nftIds = await getAllNFTsForOwner(account.address, 100, 0)
      
      const userNFTs = await Promise.all(
        nftIds.map(async (id) => {
          const details = await getNFTDetails(id)
          return details
        })
      )
  
      const validNFTs = userNFTs.filter((nft): nft is NFT => nft !== null)
      setNfts(validNFTs)
    } catch (error) {
      console.error("Failed to fetch NFTs:", error)
      setError("Failed to fetch NFTs. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [account])
  
  useEffect(() => {
    fetchNFTs()
  }, [fetchNFTs])

  const handleEditNFT = async (nftId: string, newPrice: number) => {
    if (!nftId || newPrice <= 0) {
      message.error('Please provide a valid NFT ID and price.')
      return
    }

    const success = await setPrice(nftId, newPrice)
    if (success) {
      message.success('Price updated successfully!')
      fetchNFTs() // Refresh the NFT list
    } else {
      message.error('Failed to update price.')
    }
  }

  const handleDeleteNFT = async (nftId: string) => {
    if (!nftId) {
      message.error('Please provide a valid NFT ID.')
      return
    }

    const success = await deleteNFT(nftId)
    if (success) {
      message.success('NFT deleted successfully!')
      setNfts(nfts.filter(nft => nft.id !== nftId))
    } else {
      message.error('Failed to delete NFT.')
    }
  }

  const handleTransferNFT = async (nftId: string, newOwner: string) => {
    if (!nftId || !newOwner) {
      message.error('Please fill in all fields.')
      return
    }

    const success = await transferOwnership(nftId, newOwner)
    if (success) {
      message.success('Ownership transferred successfully!')
      setNfts(nfts.filter(nft => nft.id !== nftId))
    } else {
      message.error('Failed to transfer ownership.')
    }
  }

  const handleSaleNFT = async (nftId: string, isAuction: boolean, price: number, auctionEnd?: number) => {
    if (!nftId || price <= 0 || (isAuction && auctionEnd === undefined)) {
      message.error('Please fill in all fields correctly.')
      return
    }

    const success = await listForSale(nftId, price, isAuction, auctionEnd || 0)
    if (success) {
      message.success('NFT listed for sale successfully!')
      fetchNFTs() // Refresh the NFT list
    } else {
      message.error('Failed to list NFT for sale.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">My NFT Collection</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-gray-200 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Create NFT
        </Button>
      </div>
      
      {loading && <p className="text-white">Loading NFTs...</p>}
      {error && <MessageAlert message={error} type="error" onClose={() => setError(null)} />}
      {!loading && nfts.length === 0 && !error && <p className="text-white">No NFTs found for this account.</p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <NFTCard 
            key={nft.id} 
            nft={nft} 
            onEdit={handleEditNFT} 
            onDelete={handleDeleteNFT}
            onTransfer={handleTransferNFT}
            onSale={handleSaleNFT}
          />
        ))}
      </div>
      
      <CreateNFTModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={fetchNFTs}
      />
      {selectedNFT && (
        <TransferNFTModal
          isOpen={isTransferModalOpen}
          onClose={() => {
            setIsTransferModalOpen(false)
            setSelectedNFT(null)
          }}
          onTransfer={(newOwner) => handleTransferNFT(selectedNFT.id, newOwner)}
          nftName={selectedNFT.name}
        />
      )}
    </div>
  )
}

