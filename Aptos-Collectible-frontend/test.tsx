import React, { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import NFTCard from '../../components/NFTCard'
import { Slider } from '../../components/ui/slider'
import { Checkbox } from '../../components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Input } from '../../components/ui/input'
import { getAllNFTsForSale, getNFTDetails } from '../../contracts/nftMarketplaceInteractions'

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
  listingDate: string;
  royaltyPercentage: string;
  is_auction: boolean;
  auction_end: string;
  highestBid: number;
  highestBidder: string;
}

export default function Marketplace() {
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedCreator, setSelectedCreator] = useState('');
  const [sortBy, setSortBy] = useState('price-asc');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { account } = useWallet()

  const fetchNFTs = useCallback(async () => {
    if (!account?.address) {
      setError("Wallet not connected.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const nftIds = await getAllNFTsForSale(100, 0)
      const fetchedNFTs = await Promise.all(
        nftIds.map(async (nft) => {
          const details = await getNFTDetails(nft.id)
          console.log(details)
          return details
        })
      )

      const validNFTs = fetchedNFTs.filter((nft): nft is NFT => nft !== null)
      setNfts(validNFTs)
    } catch (error) {
      console.error("Failed to fetch NFTs:", error)
      setError("Failed to fetch NFTs. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [account])



  const handleRarityChange = (rarity: string) => {
    setSelectedRarities(prev =>
      prev.includes(rarity)
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    );
  };

  const filteredNfts = mockNfts.filter(nft => 
    nft.price >= priceRange[0] && nft.price <= priceRange[1] &&
    (selectedRarities.length === 0 || selectedRarities.includes(nft.rarity)) &&
    (selectedCreator === '' || nft.creator === selectedCreator) &&
    (selectedYear === '' || new Date(nft.listingDate).getFullYear().toString() === selectedYear) &&
    (selectedMonth === '' || (new Date(nft.listingDate).getMonth() + 1).toString().padStart(2, '0') === selectedMonth) &&
    (walletAddress === '' || nft.walletAddress.toLowerCase().includes(walletAddress.toLowerCase()))
  ).sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'date-asc':
        return new Date(a.listingDate).getTime() - new Date(b.listingDate).getTime();
      case 'date-desc':
        return new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime();
      default:
        return 0;
    }
  });

  const years = Array.from(new Set(mockNfts.map(nft => new Date(nft.listingDate).getFullYear())));
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const paginatedNfts = nfts.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/4 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Price Range</h3>
          <Slider
            min={0}
            max={10}
            step={0.1}
            value={priceRange}
            onChange={setPriceRange}
            label="Price (APT)"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Rarity</h3>
          {['Common', 'Uncommon', 'Rare', 'Super Rare'].map(rarity => (
            <Checkbox
              key={rarity}
              label={rarity}
              checked={selectedRarities.includes(rarity)}
              onChange={() => handleRarityChange(rarity)}
            />
          ))}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Creator</h3>
          <Select
            options={[
              { value: '', label: 'All Creators' },
              ...Array.from(new Set(mockNfts.map(nft => nft.creator))).map(creator => ({
                value: creator,
                label: creator,
              }))
            ]}
            value={selectedCreator}
            onChange={(value: string) => setSelectedCreator(value)}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Listing Date</h3>
          <Select
            options={[
              { value: '', label: 'All Years' },
              ...years.map(year => ({ value: year.toString(), label: year.toString() }))
            ]}
            value={selectedYear}
            onChange={(value: string) => setSelectedYear(value)}
            label="Year"
          />
          <Select
            options={[
              { value: '', label: 'All Months' },
              ...months
            ]}
            value={selectedMonth}
            onChange={(value: string) => setSelectedMonth(value)}
            label="Month"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Wallet Address</h3>
          <Input
            type="text"
            placeholder="Enter wallet address"
            value={walletAddress}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWalletAddress(e.target.value)}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Sort By</h3>
          <Select
            options={[
              { value: 'price-asc', label: 'Price: Low to High' },
              { value: 'price-desc', label: 'Price: High to Low' },
              { value: 'date-asc', label: 'Oldest' },
              { value: 'date-desc', label: 'Newest' },
            ]}
            value={sortBy}
            onChange={(value: string) => setSortBy(value)}
          />
        </div>
      </div>
      <div className="w-full md:w-3/4">
        <h1 className="text-3xl font-bold mb-6">NFT Marketplace</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      </div>
    </div>
  );
}

nft Card


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react'
import { purchaseNFT } from '../contracts/nftMarketplaceInteractions'
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter } from "./ui/card"

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

  const handleBuy = async () => {
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

  return (
    <Card className="bg-gray-800 text-white overflow-hidden">
      <Link to={`/nft/${nft.id}`}>
        <img src={`https://gateway.pinata.cloud/ipfs/${nft.uri}`} alt={nft.name} className="w-full h-48 object-cover" />
      </Link>
      <CardContent className="p-4 space-y-2">
        <Link to={`/nft/${nft.id}`} className="block">
          <h3 className="text-xl font-semibold hover:text-blue-400">{nft.name}</h3>
        </Link>
        <p className="text-sm text-gray-400 line-clamp-2">{nft.description}</p>
        <p className="text-sm text-gray-400">Creator: {nft.originalCreator.slice(0, 6)}...{nft.originalCreator.slice(-4)}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-400">Rarity: {nft.rarity}</span>
          <span className="text-lg font-bold">{nft.price} APT</span>
        </div>
        {message && <p className="text-sm text-yellow-400">{message}</p>}
      </CardContent>
      <CardFooter className="p-4">
        <Button
          onClick={handleBuy}
          disabled={isLoading || !nft.for_sale}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            nft.for_sale ? 'Buy Now' : 'Not for Sale'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default NFTCard

