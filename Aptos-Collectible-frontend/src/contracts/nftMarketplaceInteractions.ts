import { AptosClient, Types } from "aptos";
import { message } from "antd";
import { HexString } from "aptos";

// Load environment variables
const client = new AptosClient(process.env.REACT_APP_APTOS_FULLNODE_URL!);
const marketplaceAddr = process.env.REACT_APP_MARKETPLACE_ADDRESS!;

// Helper function to convert hex to Uint8Array
const hexToUint8Array = (hexString: string): Uint8Array => {
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }
  return bytes;
};


// Helper function to handle errors
const handleError = (error: any, defaultMessage: string) => {
  console.error(defaultMessage, error);
  if (error.code) {
    switch (error.code) {
      case 1000:
        message.error("Royalty percentage cannot exceed 25%");
        break;
      case 2000:
        message.error("You are not the owner of this NFT");
        break;
      case 2001:
        message.error("NFT is already listed for sale");
        break;
      case 2002:
      case 3001:
        message.error("Price must be greater than zero");
        break;
      case 2003:
        message.error("Auction end time must be at least 1 hour in the future");
        break;
      case 3000:
      case 6000:
      case 7000:
        message.error("You are not the owner of this NFT");
        break;
      case 3002:
        message.error("Cannot change price after auction has ended");
        break;
      case 4000:
        message.error("NFT is not part of an auction");
        break;
      case 4001:
        message.error("Auction has ended");
        break;
      case 4002:
        message.error("Bid must be higher than current highest bid");
        break;
      case 4003:
        message.error("Bid amount must be greater than zero");
        break;
      case 4004:
        message.error("You cannot bid if you are already the highest bidder");
        break;
      case 5000:
        message.error("NFT is not for sale or part of an auction");
        break;
      case 5001:
        message.error("Auction has not ended yet");
        break;
      case 5002:
        message.error("Only the highest bidder can purchase");
        break;
      case 5003:
        message.error("Insufficient payment for auction");
        break;
      case 5004:
        message.error("Insufficient payment for sale");
        break;
      case 6001:
        message.error("Cannot transfer to the same owner");
        break;
      case 7001:
        message.error("Cannot delete an NFT that is listed for sale");
        break;
      case 7002:
        message.error("NFT not found in the marketplace");
        break;
      default:
        message.error(defaultMessage);
    }
  } else {
    message.error(defaultMessage);
  }
};

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

export interface ListedNFT {
  id: string;
  price: number;
  rarity: number;
  listing_date: number;
}

export const fetchNFTs = async (selectedRarity?: number): Promise<NFT[]> => {
  try {
    const response = await client.getAccountResource(
      marketplaceAddr,
      `${marketplaceAddr}::NFTMarketplace_v1::Marketplace`
    );
    const nftList = (response.data as { nfts: NFT[] }).nfts;

    const decodedNfts = nftList.map((nft) => ({
      ...nft,
      name: new TextDecoder().decode(hexToUint8Array(nft.name.slice(2))),
      description: new TextDecoder().decode(hexToUint8Array(nft.description.slice(2))),
      uri: new TextDecoder().decode(hexToUint8Array(nft.uri.slice(2))),
      price: nft.price / 100000000,
    }));

    return decodedNfts.filter((nft) => nft.for_sale && (selectedRarity === undefined || nft.rarity === selectedRarity));
  } catch (error) {
    handleError(error, "Failed to fetch NFTs");
    return [];
  }
};

export const isMarketplaceInitialized = async (): Promise<boolean> => {
  try {
    const response = await client.view({
      function: `${marketplaceAddr}::NFTMarketplace_v1::is_marketplace_initialized`,
      type_arguments: [],
      arguments: [marketplaceAddr],
    });
    return response[0] as boolean;
  } catch (error) {
    handleError(error, "Failed to check if marketplace is initialized");
    return false;
  }
};

export const mintNFT = async (
  name: string,
  description: string,
  uri: string,
  rarity: number,
  royaltyPercentage: number
): Promise<boolean> => {
  try {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${marketplaceAddr}::NFTMarketplace_v1::mint_nft`,
      type_arguments: [],
      arguments: [
        marketplaceAddr,
        Array.from(new TextEncoder().encode(name)),
        Array.from(new TextEncoder().encode(description)),
        Array.from(new TextEncoder().encode(uri)),
        rarity,
        royaltyPercentage,
      ],
    };


    const txnResponse = await (window as any).aptos.signAndSubmitTransaction({ payload });
    await client.waitForTransaction(txnResponse.hash);

    message.success("NFT minted successfully!");
    return true;
  } catch (error) {
    handleError(error, "Failed to mint NFT");
    return false;
  }
};

export const getNFTDetails = async (nftId: string): Promise<NFT | null> => {
  try {
    const response = await client.view({
      function: `${marketplaceAddr}::NFTMarketplace_v1::get_nft_details`,
      type_arguments: [],
      arguments: [marketplaceAddr, nftId],
    });

       if (!response || response.length < 14) {
      console.error("Invalid NFT details response:", response);
      return null;
    }

    // Destructure the response
    const [
      id, owner, originalCreator, name, description, uri, price, forSale, rarity,
      listingDate, royaltyPercentage, isAuction, auctionEnd, highestBid, highestBidder
    ] = response as [
      number, string, string, string, string, string, number, boolean, number,
      number, number, boolean, number, number, string
    ];

      // Decode the relevant fields and return the NFT details
      return {
        id: id.toString(),
        owner: owner,
        originalCreator: originalCreator,
        name: new TextDecoder().decode(new Uint8Array(hexToUint8Array(name.slice(2)))),
        description: new TextDecoder().decode(new Uint8Array(hexToUint8Array(description.slice(2)))),
        uri: new TextDecoder().decode(new Uint8Array(hexToUint8Array(uri.slice(2)))),
        price: price / 100000000, // Convert octas to APT
        for_sale: forSale,
        rarity: rarity,
        listingDate: listingDate,
        royaltyPercentage: royaltyPercentage,
        is_auction: isAuction,
        auction_end: auctionEnd,
        highestBid: highestBid / 100000000, // Convert octas to APT
        highestBidder: highestBidder ? highestBidder : '', // Handling empty or missing highestBidder
      };
  } catch (error) {
    console.error(`Error fetching details for NFT ID ${nftId}:`, error);
    return null;
  }
};


export const listForSale = async (
  nftId: string,
  price: number,
  isAuction: boolean,
  auctionEnd: number
): Promise<boolean> => {
  try {
    const priceInOctas = price * 100000000;
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${marketplaceAddr}::NFTMarketplace_v1::list_for_sale`,
      type_arguments: [],
      arguments: [marketplaceAddr, nftId, priceInOctas.toString(), isAuction, auctionEnd.toString()],
    };

    const txnResponse = await (window as any).aptos.signAndSubmitTransaction({ payload });
    await client.waitForTransaction(txnResponse.hash);

    message.success("NFT listed for sale successfully!");
    return true;
  } catch (error) {
    handleError(error, "Failed to list NFT for sale");
    return false;
  }
};

export const setPrice = async (nftId: string, newPrice: number): Promise<boolean> => {
  try {
    const priceInOctas = newPrice * 100000000;
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${marketplaceAddr}::NFTMarketplace_v1::set_price`,
      type_arguments: [],
      arguments: [marketplaceAddr, nftId, priceInOctas.toString()],
    };

    const txnResponse = await (window as any).aptos.signAndSubmitTransaction({ payload });
    await client.waitForTransaction(txnResponse.hash);

    message.success("NFT price updated successfully!");
    return true;
  } catch (error) {
    handleError(error, "Failed to update NFT price");
    return false;
  }
};

export const placeBid = async (nftId: string, bidAmount: number): Promise<boolean> => {
  try {
    const bidAmountInOctas = bidAmount * 100000000;
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${marketplaceAddr}::NFTMarketplace_v1::place_bid`,
      type_arguments: [],
      arguments: [marketplaceAddr, nftId, bidAmountInOctas.toString()],
    };

    const txnResponse = await (window as any).aptos.signAndSubmitTransaction({ payload });
    await client.waitForTransaction(txnResponse.hash);

    message.success("Bid placed successfully!");
    return true;
  } catch (error) {
    handleError(error, "Failed to place bid");
    return false;
  }
};

export const purchaseNFT = async (nftId: string, payment: number): Promise<boolean> => {
  try {
    const paymentInOctas = payment * 100000000;
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${marketplaceAddr}::NFTMarketplace_v1::purchase_nft`,
      type_arguments: [],
      arguments: [marketplaceAddr, nftId, paymentInOctas.toString()],
    };

    const txnResponse = await (window as any).aptos.signAndSubmitTransaction({ payload });
    await client.waitForTransaction(txnResponse.hash);

    message.success("NFT purchased successfully!");
    return true;
  } catch (error) {
    handleError(error, "Failed to purchase NFT");
    return false;
  }
};

export const isNFTForSale = async (nftId: string): Promise<boolean> => {
  try {
    const response = await client.view({
      function: `${marketplaceAddr}::NFTMarketplace_v1::is_nft_for_sale`,
      type_arguments: [],
      arguments: [marketplaceAddr, nftId],
    });
    return response[0] as boolean;
  } catch (error) {
    handleError(error, "Failed to check if NFT is for sale");
    return false;
  }
};

export const isNFTForAuction = async (nftId: string): Promise<boolean> => {
  try {
    const response = await client.view({
      function: `${marketplaceAddr}::NFTMarketplace_v1::is_nft_for_auction`,
      type_arguments: [],
      arguments: [marketplaceAddr, nftId],
    });
    return response[0] as boolean;
  } catch (error) {
    handleError(error, "Failed to check if NFT is for auction");
    return false;
  }
};

export const getNFTPrice = async (nftId: string): Promise<number> => {
  try {
    const response = await client.view({
      function: `${marketplaceAddr}::NFTMarketplace_v1::get_nft_price`,
      type_arguments: [],
      arguments: [marketplaceAddr, nftId],
    });
    return Number(response[0]) / 100000000;
  } catch (error) {
    handleError(error, "Failed to get NFT price");
    return 0;
  }
};

export const transferOwnership = async (nftId: string, newOwner: string): Promise<boolean> => {
  try {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${marketplaceAddr}::NFTMarketplace_v1::transfer_ownership`,
      type_arguments: [],
      arguments: [marketplaceAddr, nftId, newOwner],
    };

    const txnResponse = await (window as any).aptos.signAndSubmitTransaction({ payload });
    await client.waitForTransaction(txnResponse.hash);

    message.success("NFT ownership transferred successfully!");
    return true;
  } catch (error) {
    handleError(error, "Failed to transfer NFT ownership");
    return false;
  }
};

export const getNFTOwner = async (nftId: string): Promise<string> => {
  try {
    const response = await client.view({
      function: `${marketplaceAddr}::NFTMarketplace_v1::get_owner`,
      type_arguments: [],
      arguments: [marketplaceAddr, nftId],
    });
    return HexString.fromUint8Array(response[0] as Uint8Array).toShortString();
  } catch (error) {
    handleError(error, "Failed to get NFT owner");
    return "";
  }
};

export const getAuctionWinner = async (nftId: string): Promise<string> => {
  try {
    const response = await client.view({
      function: `${marketplaceAddr}::NFTMarketplace_v1::get_auction_winner`,
      type_arguments: [],
      arguments: [marketplaceAddr, nftId],
    });
    return HexString.fromUint8Array(response[0] as Uint8Array).toShortString();
  } catch (error) {
    handleError(error, "Failed to get auction winner");
    return "";
  }
};

export const getAllNFTsForOwner = async (ownerAddr: string, limit: number, offset: number): Promise<string[]> => {
  try {
    const response = await client.view({
      function: `${marketplaceAddr}::NFTMarketplace_v1::get_all_nfts_for_owner`,
      type_arguments: [],
      arguments: [marketplaceAddr, ownerAddr, limit.toString(), offset.toString()],
    });
    return (response[0] as string[]).map(id => id.toString());
  } catch (error) {
    handleError(error, "Failed to get NFTs for owner");
    return [];
  }
};

export const getAllNFTsForSale = async (limit: number, offset: number): Promise<ListedNFT[]> => {
  try {
    const response = await client.view({
      function: `${marketplaceAddr}::NFTMarketplace_v1::get_all_nfts_for_sale`,
      type_arguments: [],
      arguments: [marketplaceAddr, limit.toString(), offset.toString()],
    });
    return (response[0] as any[]).map(nft => ({
      id: nft.id.toString(),
      price: Number(nft.price) / 100000000,
      rarity: nft.rarity,
      listing_date: Number(nft.listing_date),
    }));
  } catch (error) {
    handleError(error, "Failed to get NFTs for sale");
    return [];
  }
};

export const getNFTsInAuction = async (limit: number, offset: number): Promise<ListedNFT[]> => {
  try {
    const response = await client.view({
      function: `${marketplaceAddr}::NFTMarketplace_v1::get_nfts_in_auction`,
      type_arguments: [],
      arguments: [marketplaceAddr, limit.toString(), offset.toString()],
    });
    return (response[0] as any[]).map(nft => ({
      id: nft.id.toString(),
      price: Number(nft.price) / 100000000,
      rarity: nft.rarity,
      listing_date: Number(nft.listing_date),
    }));
  } catch (error) {
    handleError(error, "Failed to get NFTs in auction");
    return [];
  }
};

export const getNFTsByRarity = async (rarity: number): Promise<string[]> => {
  try {
    const response = await client.view({
      function: `${marketplaceAddr}::NFTMarketplace_v1::get_nfts_by_rarity`,
      type_arguments: [],
      arguments: [marketplaceAddr, rarity.toString()],
    });
    return (response[0] as string[]).map(id => id.toString());
  } catch (error) {
    handleError(error, "Failed to get NFTs by rarity");
    return [];
  }
};

export const getNFTsByListingDate = async (listingDate: number): Promise<string[]> => {
  try {
    const response = await client.view({
      function: `${marketplaceAddr}::NFTMarketplace_v1::get_nfts_by_listing_date`,
      type_arguments: [],
      arguments: [marketplaceAddr, listingDate.toString()],
    });
    return (response[0] as string[]).map(id => id.toString());
  } catch (error) {
    handleError(error, "Failed to get NFTs by listing date");
    return [];
  }
};

export const getNFTsByPrice = async (price: number): Promise<string[]> => {
  try {
    const priceInOctas = price * 100000000;
    const response = await client.view({
      function: `${marketplaceAddr}::NFTMarketplace_v1::get_nfts_by_price`,
      type_arguments: [],
      arguments: [marketplaceAddr, priceInOctas.toString()],
    });
    return (response[0] as string[]).map(id => id.toString());
  } catch (error) {
    handleError(error, "Failed to get NFTs by price");
    return [];
  }
};

export const deleteNFT = async (nftId: string): Promise<boolean> => {
  try {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${marketplaceAddr}::NFTMarketplace_v1::delete_nft`,
      type_arguments: [],
      arguments: [marketplaceAddr, nftId],
    };

    const txnResponse = await (window as any).aptos.signAndSubmitTransaction({ payload });
    await client.waitForTransaction(txnResponse.hash);

    message.success("NFT deleted successfully!");
    return true;
  } catch (error) {
    handleError(error, "Failed to delete NFT");
    return false;
  }
};

