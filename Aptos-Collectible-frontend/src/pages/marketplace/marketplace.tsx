import React, { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import NFTCard from '../../components/NFTCard'
import { Checkbox } from '../../components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Input } from '../../components/ui/input'
import { getAllNFTsForSale, getNFTDetails } from '../../contracts/nftMarketplaceInteractions'
import { Button } from '../../components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet'
import { Menu, X } from 'lucide-react'

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

export default function Marketplace() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState('0.0');
  const [maxPrice, setMaxPrice] = useState('100');
  const [selectedRarities, setSelectedRarities] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('price-asc');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [walletAddress, setWalletAddress] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pageSize = 9; // Number of NFTs per page
  
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
          return details as NFT | null
        })
      )

      const validNFTs = fetchedNFTs.filter((nft): nft is NFT => nft !== null)
      console.log(validNFTs)
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

  const handleRarityChange = (rarity: number) => {
    setSelectedRarities(prev =>
      prev.includes(rarity)
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    );
  };

  const filteredNfts = nfts.filter(nft => 
    nft.for_sale &&
    !nft.is_auction &&
    nft.price >= parseFloat(minPrice) && 
    nft.price <= parseFloat(maxPrice) &&
    (selectedRarities.length === 0 || selectedRarities.includes(nft.rarity)) &&
    (selectedYear === 'all' || new Date(nft.listingDate * 1000).getFullYear().toString() === selectedYear) &&
    (selectedMonth === 'all' || (new Date(nft.listingDate * 1000).getMonth() + 1).toString().padStart(2, '0') === selectedMonth) &&
    (walletAddress === '' || nft.owner.toLowerCase().includes(walletAddress.toLowerCase())) &&
    (searchTerm === '' || nft.name.toLowerCase().split(' ').some(word => word.startsWith(searchTerm.toLowerCase())))
  ).sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'date-asc':
        return a.listingDate - b.listingDate;
      case 'date-desc':
        return b.listingDate - a.listingDate;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const years = ['2020', '2021', '2022', '2023', '2024'];
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

  const paginatedNfts = filteredNfts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Filters</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
          <X className="h-6 w-6 text-white" />
        </Button>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Search by Name</h3>
        <Input
          type="text"
          placeholder="Enter NFT name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 text-white border-purple-500 focus:border-cyan-400"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Price Range</h3>
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="bg-gray-800 text-white border-purple-500 focus:border-cyan-400 w-1/2"
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="bg-gray-800 text-white border-purple-500 focus:border-cyan-400 w-1/2"
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Rarity</h3>
        {[1, 2, 3, 4].map(rarity => (
          <div key={rarity} className="flex items-center space-x-2">
            <Checkbox
              id={`rarity-${rarity}`}
              checked={selectedRarities.includes(rarity)}
              onCheckedChange={() => handleRarityChange(rarity)}
              className="border-purple-500 text-cyan-400"
            />
            <label htmlFor={`rarity-${rarity}`} className="text-sm text-gray-300">
              {rarity === 1 ? 'Common' : rarity === 2 ? 'Uncommon' : rarity === 3 ? 'Rare' : 'Super Rare'}
            </label>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Listing Date</h3>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="bg-gray-800 text-white border-purple-500">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map(year => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="bg-gray-800 text-white border-purple-500 mt-2">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {months.map(month => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Wallet Address</h3>
        <Input
          type="text"
          placeholder="Enter wallet address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="bg-gray-800 text-white border-purple-500 focus:border-cyan-400"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Sort By</h3>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="bg-gray-800 text-white border-purple-500">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="date-asc">Oldest</SelectItem>
            <SelectItem value="date-desc">Newest</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          NFT Marketplace
        </h1>
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden border-purple-500 text-purple-400 hover:bg-purple-900 hover:text-purple-300">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-gray-900 border-r border-purple-500">
            <FilterSidebar />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block w-1/4 bg-gray-900 p-4 rounded-lg border border-purple-500 shadow-lg shadow-purple-500/20">
          <FilterSidebar />
        </div>
        <div className="w-full lg:w-3/4">
          {loading ? (
            <p className="text-white">Loading NFTs...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedNfts.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} onRefresh={fetchNFTs} />
                ))}
              </div>
              <div className="mt-6 flex justify-center space-x-2">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * pageSize >= filteredNfts.length}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

