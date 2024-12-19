import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Slider } from "../components/ui/slider"
import { Loader2, Upload } from 'lucide-react'
import { uploadToPinata } from '../utils/PinataService'
import { mintNFT } from '../contracts/nftMarketplaceInteractions'
import { MessageAlert } from '../utils/MessageAlert'

interface NFTData {
  name: string
  description: string
  imageFile: File | null
  rarity: number
  royaltyPercentage: number
}

const rarityOptions = [
  { value: 1, label: "Common" },
  { value: 2, label: "Uncommon" },
  { value: 3, label: "Rare" },
  { value: 4, label: "Epic" },
  { value: 5, label: "Legendary" }
]

interface CreateNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}

const CreateNFTModal = ({ isOpen, onClose, onSubmit }: CreateNFTModalProps) => {
  const [nftData, setNftData] = useState<NFTData>({
    name: '',
    description: '',
    imageFile: null,
    rarity: 1,
    royaltyPercentage: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [alertState, setAlertState] = useState<{ message: string; type: 'info' | 'success' | 'warning' | 'error' | null }>({
    message: '',
    type: null
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNftData(prev => ({ ...prev, imageFile: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!nftData.imageFile) {
        throw new Error("Please select an image file")
      }
      const ipfsHash = await uploadToPinata(nftData.imageFile)
      const success = await mintNFT(nftData.name, nftData.description, ipfsHash, nftData.rarity, nftData.royaltyPercentage)
      if (success) {
        setAlertState({ message: 'NFT created successfully!', type: 'success' })
        setNftData({
          name: '',
          description: '',
          imageFile: null,
          rarity: 1,
          royaltyPercentage: 0
        })
        setImagePreview(null)
        await onSubmit();
        onClose()
      } else {
        throw new Error("Failed to mint NFT")
      }
    } catch (error) {
      console.error("Error creating NFT:", error)
      setAlertState({ message: 'Failed to create NFT. Please try again.', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-400">Create New NFT</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the details of your new NFT and upload an image to create your unique digital asset.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input
                  id="name"
                  value={nftData.name}
                  onChange={(e) => setNftData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 text-gray-100 border-gray-600"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  value={nftData.description}
                  onChange={(e) => setNftData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-700 text-gray-100 border-gray-600"
                  required
                />
              </div>
              <div>
                <Label htmlFor="image" className="text-gray-300">Image</Label>
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                    required
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="NFT Preview" className="w-16 h-16 object-cover rounded-md" />
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="rarity" className="text-gray-300">Rarity</Label>
                <Select
                  value={nftData.rarity.toString()}
                  onValueChange={(value) => setNftData(prev => ({ ...prev, rarity: parseInt(value) }))}
                >
                  <SelectTrigger className="bg-gray-700 text-gray-100 border-gray-600">
                    <SelectValue placeholder="Select rarity" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-gray-100 border-gray-600">
                    {rarityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="royalty" className="text-gray-300">Royalty Percentage (Optional)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="royalty"
                    min={0}
                    max={25}
                    step={1}
                    value={[nftData.royaltyPercentage]}
                    onValueChange={(value) => setNftData(prev => ({ ...prev, royaltyPercentage: value[0] }))}
                    className="flex-grow"
                  />
                  <span className="text-gray-300 w-12 text-right">{nftData.royaltyPercentage}%</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create NFT'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {alertState.type && (
        <MessageAlert
          message={alertState.message}
          onClose={() => setAlertState({ message: '', type: null })}
          type={alertState.type}
        />
      )}
    </>
  )
}

export default CreateNFTModal

