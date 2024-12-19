import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

interface TransferNFTModalProps {
  isOpen: boolean
  onClose: () => void
  onTransfer: (address: string) => void
  nftName: string
}

export function TransferNFTModal({ isOpen, onClose, onTransfer, nftName }: TransferNFTModalProps) {
  const [address, setAddress] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onTransfer(address)
    setAddress('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-400">Transfer NFT</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the address to transfer "{nftName}" to.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right text-gray-300">
                Address
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="col-span-3 bg-gray-700 text-gray-100 border-gray-600"
                placeholder="Enter recipient's address"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Transfer NFT
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
