# NFT Marketplace Smart Contract

This repository contains a comprehensive Move smart contract implementation for an NFT Marketplace built on the Aptos blockchain. The contract facilitates a wide range of functionalities, including minting, listing, purchasing, and managing NFTs. Additional features include support for auctions, royalty distributions, and configurable marketplace fees, ensuring a robust and user-friendly experience.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Compilation](#compilation)
4. [Deployment](#deployment)
5. [Key Functions](#key-functions)
6. [Testing](#testing)
7. [Security Considerations](#security-considerations)
8. [Contributing](#contributing)
9. [License](#license)

---

## Prerequisites

Before starting, ensure the following tools and resources are available:

- [**Aptos CLI**](https://aptos.dev/cli-tools/aptos-cli-tool/install-aptos-cli): A command-line interface for interacting with the Aptos blockchain.
- [**Move Prover**](https://github.com/move-language/move/tree/main/language/move-prover) (optional): For formal verification of smart contract functionality.
- **Aptos Wallet**: A compatible wallet, such as [Petra Wallet](https://petra.app/) ([Chrome Extension](https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci)).

---

## Setup

Follow these steps to set up your development environment:

1. **Clone the Repository**:
    
    ```bash
    git clone https://github.com/chiemezie1/Aptos-Collectible-hub.git
    cd Aptos-Collectible-hub
    cd Aptos-NFT-Backend
    
    ```
    
2. **Update Configuration**:
    
    Edit the `Move.toml` file and set your Aptos account address. Replace `your-account-address-here` with your actual account address.
    
    ```toml
    [addresses]
    NFTMarketplace = "your-account-address-here"
    
    ```
    
3. **Update source file address**:
Open the `contracts/sources/NFTMarketplace.move` file, 
At the `Define Module and Marketplace Address` Replace <insert-your-address-here> with your own wallet address. 
The line should look something like this:
```
// Define Module and Marketplace Address
address 0x6b351bc476f9c6c909f86ce554f9ef8dda5a518ecb759190d10894f33f53a035 {
    <!-- code -->
}
```

3. **Install the Aptos CLI**:
    
    If the CLI is not already installed, run:
    
    ```bash
        curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
    
    ```
    
    Verify the installation:
    
    ```bash
    aptos info
    
    ```
    

---

## Compilation

Compile the smart contract to ensure it is error-free and ready for deployment.

```bash
cd contracts

aptos move compile

```

This will generate artifacts in the `build` directory for deployment.

---

## Deployment

### Steps to Deploy:

1. **Initialize the Aptos Environment**:
    
    Run the following command to set up the Aptos environment and profile:
    
    ```bash
    aptos init
    
    ```
    
    - When prompted, select the network (e.g., `devnet` or `testnet`).
    - Provide your private key (retrievable from the Petra Wallet under `Settings > Manage Account`).
2. **Publish the Smart Contract**:
    
    Deploy the contract to the blockchain with:
    
    ```bash
      aptos move publish
    
    ```
    
    Approve the transaction when prompted. After successful deployment, you can verify the contract status via Aptos Explorer by searching for your account address.
    
3. **Initialize the Marketplace Using Aptos Explorer**:

    - **Navigate to Aptos Explorer**:
        
        Open [Aptos Explorer](https://explorer.aptoslabs.com/?network=testnet) and ensure the network is set to either `testnet` or `devnet` based on the environment you're using.
        
    - **Search for Your Account**:
        
        Search for your account address in the search bar to locate your wallet. In the account page, navigate to the "Modules" tab.
        
    - **Find and Run the `initialize` Function**:
        - Look for the `NFTMarketplace` module under the Modules tab.
        - You will see a list of available functions. Select the `initialize` function.
        - After selecting it, you’ll be prompted to connect your wallet (if not already connected). Use the "Connect Wallet" button and approve the connection in your wallet.
        - After connecting your wallet, you will be able to input any arguments required by the `initialize` function and then run - **Approve the Transaction**:
        
        Once you click "Run," your wallet will ask for approval to execute the function. After approving, the contract will be initialized on the blockchain.

---

## Key Functions

The contract includes the following key functions:

- **`mint_nft`**: Create a new NFT and assign it to the minting account.
- **`list_for_sale`**: List an NFT for sale with a fixed price or auction.
- **`purchase_nft`**: Buy an NFT listed on the marketplace.
- **`place_bid`**: Bid on an NFT that is part of an ongoing auction.
- **`transfer_ownership`**: Transfer ownership of an NFT to another user.
- **`get_nft_details`**: Retrieve detailed metadata for a specific NFT.

---

## Testing

Comprehensive testing ensures contract stability and security:

```bash
aptos move test

```

Run this command to execute all test cases and verify functionality before deploying to a live environment.

---

## Security Considerations

Security is a priority. Follow these guidelines:

- **Input Validation**: Validate all user-provided data to prevent exploits.
- **Audit**: Audit the smart contract for vulnerabilities before production.

---

## Contributing

We welcome contributions! To contribute:

1. Fork this repository.
2. Make your changes in a feature branch.
3. Ensure all changes are documented and tested.
4. Submit a pull request with a detailed explanation of your changes.

For major changes, open an issue first to discuss the proposed modification.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for full details.
