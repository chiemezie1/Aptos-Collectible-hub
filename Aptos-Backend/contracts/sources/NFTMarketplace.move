
// Define Module and Marketplace Address
address 0x6b351bc476f9c6c909f86ce554f9ef8dda5a518ecb759190d10894f33f53a035 {

    module NFTMarketplace_v1 {
        use 0x1::signer;
        use 0x1::vector;
        use 0x1::coin;
        use 0x1::aptos_coin;
        use std::timestamp; 

        //  NFT Structure
           struct NFT has store, key, drop {
            id: u64,
            owner: address,
            original_creator: address,
            name: vector<u8>,
            description: vector<u8>,
            uri: vector<u8>,
            price: u64,
            for_sale: bool,
            rarity: u8,
            listing_date: u64,
            royalty_percentage: u64,
            is_auction: bool,
            auction_end: u64,
            highest_bid: u64,
            highest_bidder: address
        }

      // Marketplace Structure
        struct Marketplace has key {
            nfts: vector<NFT>
        }
        
        // ListedNFT Structure
        struct ListedNFT has copy, drop {
            id: u64,
            price: u64,
            rarity: u8,
            listing_date: u64
        }


        // Set Marketplace Fee
        const MARKETPLACE_FEE_PERCENT: u64 = 2; // 2% fee
        const MAX_ROYALTY_PERCENTGE: u64 = 25;

        // Initialize the Marketplace
        public entry fun initialize(account: &signer) {
            let marketplace = Marketplace {
                nfts: vector::empty<NFT>()
            };
            move_to(account, marketplace);
        }       


        // Check if Marketplace is Initialized
        #[view]
        public fun is_marketplace_initialized(marketplace_addr: address): bool {
            exists<Marketplace>(marketplace_addr)
        }


        // Mint A New NFT
        public entry fun mint_nft(
            account: &signer,
            name: vector<u8>,
            description: vector<u8>,
            uri: vector<u8>,
            rarity: u8,
            royalty_percentage: u64
        ) acquires Marketplace {
            assert!(royalty_percentage <= MAX_ROYALTY_PERCENTGE, 1000); // Error code 1000: "Royalty percentage cannot exceed 25%"

            let marketplace = borrow_global_mut<Marketplace>(signer::address_of(account));
            let nft_id = vector::length(&marketplace.nfts);

            let new_nft = NFT {
                id: nft_id,
                owner: signer::address_of(account),
                original_creator: signer::address_of(account),
                name,
                description,
                uri,
                price: 0,
                for_sale: false,
                rarity,
                listing_date: 0,
                royalty_percentage,
                is_auction: false,
                auction_end: 0,
                highest_bid: 0,
                highest_bidder: @0x0
            };

            vector::push_back(&mut marketplace.nfts, new_nft);
        }


       // View NFT Details
        #[view]
        public fun get_nft_details(
            marketplace_addr: address, 
            nft_id: u64
        ): (u64, address, address, vector<u8>, vector<u8>, vector<u8>, u64, bool, u8, u64, u64, bool, u64, u64, address) 
        acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft = vector::borrow(&marketplace.nfts, nft_id);

            (
                nft.id,
                nft.owner,
                nft.original_creator,
                nft.name,
                nft.description,
                nft.uri,
                nft.price,
                nft.for_sale,
                nft.rarity,
                nft.listing_date,           
                nft.royalty_percentage,
                nft.is_auction,
                nft.auction_end,
                nft.highest_bid,
                nft.highest_bidder
            )
        }


        
        // TO List NFT for Sale
        public entry fun list_for_sale(
            account: &signer,
            marketplace_addr: address,
            nft_id: u64,
            price: u64,
            is_auction: bool, 
            auction_end: u64
        ) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);
            let now = timestamp::now_seconds();
            
            assert!(nft_ref.owner == signer::address_of(account), 2000); // Error code 2000: "Caller is not the owner"
            assert!(!nft_ref.for_sale, 2001); // Error code 2001: "NFT is already listed for sale"
            assert!(price > 0, 2002); // Error code 2002: "Price must be greater than zero"

            if (is_auction) {
                assert!(auction_end > now + 3600, 2003); // Error code 2003: Auction end time must be at least 1 hour in the future
            };

            nft_ref.for_sale = true;
            nft_ref.price = price;
            nft_ref.is_auction = is_auction;
            nft_ref.auction_end = if (is_auction) { auction_end } else { 0 };
            nft_ref.highest_bid = if (is_auction) { 0 } else { nft_ref.highest_bid };
            nft_ref.highest_bidder = if (is_auction) { @0x0 } else { nft_ref.highest_bidder };
            nft_ref.listing_date = now;
        }


        //  Update NFT Price
        public entry fun set_price(
            account: &signer,
            marketplace_addr: address,
            nft_id: u64,
            price: u64
        ) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);
            
            assert!(nft_ref.owner == signer::address_of(account), 3000); // set_price function
            assert!(price > 0, 3001); // Error code 3001: "Price must be greater than zero
            
            // If the NFT is in an auction, ensure the auction has not ended
            if (nft_ref.is_auction) {
                let now = timestamp::now_seconds();
                assert!(nft_ref.auction_end > now, 3002); // Error code 3002: "Cannot change price after auction has ended"
            };

            nft_ref.price = price;
        }

         // Place a bid on an NFT in auction
        public entry fun place_bid(account: &signer, marketplace_addr: address, nft_id: u64, bid_amount: u64) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);
            let now = timestamp::now_seconds();

            assert!(nft_ref.is_auction, 4000); // Error code 4000: "NFT is not part of an auction"
            assert!(nft_ref.auction_end > now, 4001); // Error code 4001: "Auction has ended"
            assert!(bid_amount > nft_ref.highest_bid, 4002); // Error code 4002: "Bid must be higher than current highest bid"
            assert!(bid_amount > 0, 4003); // Error code 4003: "Bid amount must be greater than zero"
            assert!(signer::address_of(account) != nft_ref.highest_bidder, 4004); // Error code 4004: "You cannot bid if you are already the highest bidder"

            // Update the highest bid and bidder
            nft_ref.highest_bid = bid_amount;
            nft_ref.highest_bidder = signer::address_of(account);
        }


        //  Purchase NFT
        public entry fun purchase_nft(
            account: &signer,
            marketplace_addr: address,
            nft_id: u64,
            payment: u64
        ) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

            assert!(nft_ref.is_auction || nft_ref.for_sale, 5000); // Error code 5000: "NFT is not for sale or part of an auction"

            // If it's an auction, check if the auction has ended
            if (nft_ref.is_auction) {
                let now = timestamp::now_seconds();
                assert!(nft_ref.auction_end <= now, 5001); // Error code 5001: "Auction has not ended yet"
                assert!(signer::address_of(account) == nft_ref.highest_bidder, 5002); // Error code 5002: "Only the highest bidder can purchase"
                assert!(payment >= nft_ref.highest_bid, 5003); // Error code 5003: "Insufficient payment for auction"
            } else {
                // If it's a regular sale, check the price
                assert!(payment >= nft_ref.price, 5004); // Error code 5004: "Insufficient payment for sale"
            };

            // Calculate marketplace fee
            let fee = (nft_ref.price * MARKETPLACE_FEE_PERCENT) / 100;
            let seller_revenue = payment - fee;

            // If royalty is set, transfer the royalty to the original creator
            if (nft_ref.royalty_percentage > 0) {
                let royalty = (seller_revenue * nft_ref.royalty_percentage) / 100;
                let creator = nft_ref.original_creator;
                coin::transfer<aptos_coin::AptosCoin>(account, creator, royalty);
            };

            // Transfer payment to the seller and fee to the marketplace
            coin::transfer<aptos_coin::AptosCoin>(account, marketplace_addr, seller_revenue);
            coin::transfer<aptos_coin::AptosCoin>(account, signer::address_of(account), fee);

            // Transfer ownership
            nft_ref.owner = signer::address_of(account);
            nft_ref.for_sale = false;
            nft_ref.is_auction = false;
            nft_ref.price = 0;
        }


        //  Check if NFT is for Sale
        #[view]
        public fun is_nft_for_sale(marketplace_addr: address, nft_id: u64): bool acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft = vector::borrow(&marketplace.nfts, nft_id);
            nft.for_sale
        }
        
        //  Check if NFT is for Sale
        #[view]
        public fun is_nft_for_auction(marketplace_addr: address, nft_id: u64): bool acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft = vector::borrow(&marketplace.nfts, nft_id);
            nft.is_auction
        }


        //  Get NFT Price
        #[view]
        public fun aget_nft_price(marketplace_addr: address, nft_id: u64): u64 acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft = vector::borrow(&marketplace.nfts, nft_id);
            nft.price
        }


        // Transfer Ownership
                public entry fun transfer_ownership(account: &signer, marketplace_addr: address, nft_id: u64, new_owner: address) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

            assert!(nft_ref.owner == signer::address_of(account), 6000); // Error code 6000: "Caller is not the owner"
            assert!(nft_ref.owner != new_owner, 6001); // Error code 6001: "Prevent transfer to the same owner"

            // Update NFT ownership and reset its for_sale status and price
            nft_ref.owner = new_owner;
            nft_ref.for_sale = false;
            nft_ref.price = 0;
        }


        // Retrieve NFT Owner
         #[view]
        public fun get_owner(marketplace_addr: address, nft_id: u64): address acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft = vector::borrow(&marketplace.nfts, nft_id);
            nft.owner
        }

        // Retrieve Auction winner
         #[view]
        public fun get_auction_winner(marketplace_addr: address, nft_id: u64): address acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft = vector::borrow(&marketplace.nfts, nft_id);
            nft.highest_bidder
        }


        //  Retrieve NFTs for an Owner
        #[view]
        public fun get_all_nfts_for_owner(marketplace_addr: address, owner_addr: address, limit: u64, offset: u64): vector<u64> acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft_ids = vector::empty<u64>();

            let nfts_len = vector::length(&marketplace.nfts);
            let end = min(offset + limit, nfts_len);
            let mut_i = offset;
            while (mut_i < end) {
                let nft = vector::borrow(&marketplace.nfts, mut_i);
                if (nft.owner == owner_addr) {
                    vector::push_back(&mut nft_ids, nft.id);
                };
                mut_i = mut_i + 1;
            };

            nft_ids
        }
 

        // Retrieve NFTs for Sale
        #[view]
        public fun get_all_nfts_for_sale(marketplace_addr: address, limit: u64, offset: u64): vector<ListedNFT> acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nfts_for_sale = vector::empty<ListedNFT>();

            let nfts_len = vector::length(&marketplace.nfts);
            let end = min(offset + limit, nfts_len);
            let mut_i = offset;
            while (mut_i < end) {
                let nft = vector::borrow(&marketplace.nfts, mut_i);
                if (nft.for_sale) {
                    let listed_nft = ListedNFT {
                        id: nft.id,
                        price: nft.price,
                        rarity: nft.rarity,
                        listing_date: nft.listing_date,
                    };
                    vector::push_back(&mut nfts_for_sale, listed_nft);
                };
                mut_i = mut_i + 1;
            };

            nfts_for_sale
        }

        // Retrieve All NFTs Currently in Auction
        #[view]
        public fun get_nfts_in_auction(
            marketplace_addr: address,
            limit: u64,
            offset: u64
        ): vector<ListedNFT> acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nfts_in_auction = vector::empty<ListedNFT>();

            let nfts_len = vector::length(&marketplace.nfts);
            let end = min(offset + limit, nfts_len);
            let mut_i = offset;

            while (mut_i < end) {
                let nft = vector::borrow(&marketplace.nfts, mut_i);
                if (nft.is_auction) {
                    let auctioned_nft = ListedNFT {
                        id: nft.id,
                        price: nft.price,
                        rarity: nft.rarity,
                        listing_date: nft.listing_date,
                    };
                    vector::push_back(&mut nfts_in_auction, auctioned_nft);
                };
                mut_i = mut_i + 1;
            };

            nfts_in_auction
        }



         // Helper function to find the minimum of two u64 numbers
        public fun min(a: u64, b: u64): u64 {
            if (a < b) { a } else { b }
        }


        // New function to retrieve NFTs by rarity
        #[view]
        public fun get_nfts_by_rarity(marketplace_addr: address, rarity: u8): vector<u64> acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft_ids = vector::empty<u64>();

            let nfts_len = vector::length(&marketplace.nfts);
            let mut_i = 0;
            while (mut_i < nfts_len) {
                let nft = vector::borrow(&marketplace.nfts, mut_i);
                if (nft.rarity == rarity) {
                    vector::push_back(&mut nft_ids, nft.id);
                };
                mut_i = mut_i + 1;
            };

            nft_ids
        }

         // Retrieve NFTs by Listing Date
        #[view]
        public fun get_nfts_by_listing_date(marketplace_addr: address, listing_date: u64): vector<u64> acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft_ids = vector::empty<u64>();

            let nfts_len = vector::length(&marketplace.nfts);
            let i = 0;
            while (i < nfts_len) {
                let nft = vector::borrow(&marketplace.nfts, i);
                if (nft.listing_date == listing_date) {
                    vector::push_back(&mut nft_ids, nft.id);
                };
                i = i + 1;
            };

            nft_ids
        }

        // Retrieve NFTs by Price
        #[view]
        public fun get_nfts_by_price(marketplace_addr: address, price: u64): vector<u64> acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft_ids = vector::empty<u64>();

            let nfts_len = vector::length(&marketplace.nfts);
            let i = 0;
            while (i < nfts_len) {
                let nft = vector::borrow(&marketplace.nfts, i);
                if (nft.price == price) {
                    vector::push_back(&mut nft_ids, nft.id);
                };
                i = i + 1;
            };

            nft_ids
        }

        // Delete NFTs
        public entry fun delete_nft(
            account: &signer,
            marketplace_addr: address,
            nft_id: u64,
        ) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
            let mut_index = 0;
            let nfts_len = vector::length(&marketplace.nfts);

            // Iterate through the vector to find the index of the NFT to delete
            while (mut_index < nfts_len) {
                let nft_ref = vector::borrow_mut(&mut marketplace.nfts, mut_index);

                // Check if this is the NFT to delete
                if (nft_ref.id == nft_id) {
                    assert!(nft_ref.owner == signer::address_of(account), 7000); // Error code 7000: "Caller must be the owner of the NFT"
                    assert!(!nft_ref.for_sale, 7001); // Error code 7001: "Cannot delete an NFT that is listed for sale"

                    // Remove the NFT from the vector
                    vector::remove(&mut marketplace.nfts, mut_index);
                    return
                };

                mut_index = mut_index + 1;
            };

            abort 7002 // Abort code 7003: "NFT not found in the marketplace"
        }
        
    }
}
