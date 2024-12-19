import { useState } from 'react'
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { MoreVertical, Pencil, Trash2, Send, Loader2, DollarSign, Gavel } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Badge } from "../components/ui/badge"

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
  onEdit: (id: string, newPrice: number) => void;
  onDelete: (id: string) => void;
  onTransfer: (id: string, address: string) => void;
  onSale: (id: string, isAuction: boolean, price: number, auctionEnd?: number) => void;
}

export default function NFTCard({ nft, onEdit, onDelete, onTransfer, onSale }: NFTCardProps) {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [transferAddress, setTransferAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [saleType, setSaleType] = useState<'direct' | 'auction'>('direct')
  const [salePrice, setSalePrice] = useState(nft.price)
  const [auctionEnd, setAuctionEnd] = useState<string>('')
  const [newPrice, setNewPrice] = useState(nft.price)

  const handleTransfer = () => {
    onTransfer(nft.id, transferAddress)
    setIsTransferModalOpen(false)
    setTransferAddress('')
  }

  const handleSale = () => {
    setIsLoading(true)
    const auctionEndTime = saleType === 'auction' ? new Date(auctionEnd).getTime() / 1000 : undefined
    onSale(nft.id, saleType === 'auction', salePrice, auctionEndTime)
    setIsSaleModalOpen(false)
    setIsLoading(false)
  }

  const handleEdit = () => {
    onEdit(nft.id, newPrice)
    setIsEditModalOpen(false)
  }

  const rarityOptions = [
    { value: 1, label: "Common" },
    { value: 2, label: "Uncommon" },
    { value: 3, label: "Rare" },
    { value: 4, label: "Epic" },
    { value: 5, label: "Legendary" }
  ]

  const getRarityLabel = (rarity: number): string => {
    const option = rarityOptions.find(opt => opt.value === rarity)
    return option ? option.label : 'Unknown'
  }

  return (
    <Card className="overflow-hidden bg-gray-800 text-gray-100">
      <div className="relative">
        <img src={`https://gateway.pinata.cloud/ipfs/${nft.uri}`} alt={nft.name} className="w-full h-48 object-cover" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="absolute top-2 right-2 h-8 w-8 p-0 text-white hover:bg-gray-700">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-700 text-gray-100">
            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)} className="hover:bg-gray-600">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Price
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsTransferModalOpen(true)} className="hover:bg-gray-600">
              <Send className="mr-2 h-4 w-4" />
              Transfer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(nft.id)} className="hover:bg-gray-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{nft.name}</h3>
        <p className="text-sm text-gray-400 mb-2">{nft.description}</p>
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="bg-blue-600 text-white">
            {getRarityLabel(nft.rarity)}
          </Badge>
          {nft.for_sale && (
            <span className="text-lg font-bold">{nft.price} APT</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-700 p-4 flex justify-between items-center">
        {nft.for_sale ? (
          <Badge variant="outline" className="text-green-400 border-green-400">
            {nft.is_auction ? 'On Auction' : 'For Sale'}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-yellow-400 border-yellow-400">Not Listed</Badge>
        )}
        <Button
          onClick={() => setIsSaleModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {nft.for_sale ? 'Update Listing' : 'List for Sale'}
        </Button>
      </CardFooter>

      <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>Transfer NFT</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transferAddress" className="text-right">
                Address
              </Label>
              <Input
                id="transferAddress"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                className="col-span-3 bg-gray-700 text-gray-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleTransfer} className="bg-blue-600 hover:bg-blue-700">Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSaleModalOpen} onOpenChange={setIsSaleModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>List NFT for Sale</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RadioGroup value={saleType} onValueChange={(value: 'direct' | 'auction') => setSaleType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="direct" id="direct" />
                <Label htmlFor="direct">Direct Sale</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auction" id="auction" />
                <Label htmlFor="auction">Auction</Label>
              </div>
            </RadioGroup>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (APT)
              </Label>
              <Input
                id="price"
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="col-span-3 bg-gray-700 text-gray-100"
                min="0"
                step="0.01"
                required
              />
            </div>
            {saleType === 'auction' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="auctionEnd" className="text-right">
                  Auction End
                </Label>
                <Input
                  id="auctionEnd"
                  type="datetime-local"
                  value={auctionEnd}
                  onChange={(e) => setAuctionEnd(e.target.value)}
                  className="col-span-3 bg-gray-700 text-gray-100"
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSale} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : saleType === 'direct' ? <DollarSign className="mr-2" /> : <Gavel className="mr-2" />}
              List for {saleType === 'direct' ? 'Sale' : 'Auction'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>Edit NFT Price</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPrice" className="text-right">
                New Price (APT)
              </Label>
              <Input
                id="newPrice"
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="col-span-3 bg-gray-700 text-gray-100"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">Update Price</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

