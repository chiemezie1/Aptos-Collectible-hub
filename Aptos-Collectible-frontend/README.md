# 🎨 Aptos Collectible Hub Frontend

Welcome to the **Aptos Collectible Hub** repository! This project is a cutting-edge platform for discovering, buying, and selling digital collectibles. Powered by the Aptos blockchain, it combines speed, security, and affordability, offering an unparalleled user experience for creators and collectors alike.

![Aptos Collectible Hub Banner](https://example.com/banner-image.jpg)

## 📚 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Environment Configuration](#environment-configuration)
6. [Available Scripts](#available-scripts)
7. [Project Structure](#project-structure)
8. [Pages and Modules](#pages-and-modules)
9. [Contributing](#contributing)
10. [License](#license)

## 🌟 Overview

**Aptos Collectible Hub** is an NFT marketplace that harnesses the power of the Aptos blockchain. The platform offers lightning-fast transactions, reduced costs, and a user-friendly interface. It caters to both creators looking to showcase their digital art and collectors seeking unique, high-quality NFTs.

### Why Choose Aptos Collectible Hub?

- 🔒 **Blockchain-backed Security:** Built on the Aptos blockchain for trust and transparency.
- 💰 **Low Fees:** Optimized transaction costs to maximize creator earnings.
- 🖱️ **Ease of Use:** An intuitive interface for users of all technical backgrounds.

## 🚀 Features

- ⚡ **Rapid Transactions:** Experience near-instant transaction speeds with the Aptos blockchain.
- 🎨 **Comprehensive NFT Management:** Create, send, edit, and manage your NFTs effortlessly.
- 🔍 **Advanced Search Filters:** Quickly discover collectibles that match your interests.
- 🏆 **Auction System:** Engage in dynamic bidding for exclusive NFTs.
- 👛 **Seamless Wallet Integration:** Compatible with Petra Wallet and other major wallets.

## 📋 Prerequisites

Ensure you have the following tools installed on your system before proceeding:

- **Node.js** (v14.0.0 or later)
- **npm** (v6.0.0 or later)
- **Aptos CLI** for blockchain interaction
- API keys for **Pinata**
  - [Signup for Pinata](https://auth.pinata.cloud/realms/pinata/protocol/openid-connect/registrations?client_id=pinata-app&response_type=code&scope=openid%20email%20profile&redirect_uri=https%3A%2F%2Fapp.pinata.cloud)
  - Navigate to the API section through the sidebar and create a new project
  - Copy the API Key and API Secret

## 🛠️ Installation

Follow these steps to set up the project locally:


1. Clone the repository:
    
    ```bash

    git clone https://github.com/chiemezie1/Aptos-Collectible-hub.git
    
    ```
    
2. Navigate to the frontend directory:
    
    ```bash
    cd Aptos-Collectible-hub/Aptos-Collectible-frontend
    
    ```
    
3. Install dependencies:
    
    ```bash
    npm install
    
    ```
    
4. Start the development server:
    
    ```bash
    npm start
    
    ```
    

### Backend Setup (Optional)
Navigate to the backend directory and follow the setup instructions provided in the README.
**Repository**: [Backend Code](https://github.com/chiemezie1/Aptos-Collectible-hub/tree/main/Aptos-Backend)

---

## 🔧 Environment Configuration

Create a `.env` file in the root of the `Aptos-Collectible-frontend` directory with the following variables:

```
REACT_APP_APTOS_FULLNODE_URL=https://fullnode.testnet.aptoslabs.com/v1
REACT_APP_MARKETPLACE_ADDRESS=0xe773b6a7912e162a7a457417dbb9cd26245bd4dacb30d8a28b483767068c17ba
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_api_secret

```

Replace placeholders with your actual configuration values.

---

## 📜 Available Scripts

Here are the commands available for managing the project:

- **Start Development Server:**
    
    ```bash
    npm start
    
    ```
    
    Launch the app in development mode.
    
- **Build Production Version:**
    
    ```bash
     npm run build
    
    ```
    
    Compile the app for deployment.
    
- **Run Tests:**
    
    ```bash
    npm test
    
    ```
    
    Execute automated tests.

---

## 📁 Project Structure

The repository follows a modular and scalable architecture:

```
Aptos-Collectible-hub/
├── Aptos-Collectible-frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contracts/       # include the contract intraction for blockchain call
│   │   ├── pages/           # Individual page components
│   │   ├── utils/           # Helper functions
│   │   ├── index.css/       # stylesheet
│   │   └── App.js           # Root application component
│   ├── public/              # Publicly accessible files
│   └── .env.example         # Sample environment file
├── Aptos-NFT-Backend/       # Backend service code (optional)
└── README.md                # Documentation file

```

---

## 📄 Pages and Modules

### Pages

- **Home:** Showcase featured collectibles and platform highlights.
- **Marketplace:** Browse, filter, and purchase NFTs.
- **My Collection:** Manage your owned collectibles.
- **Auctions:** Participate in live NFT auctions.


---

## 🤝 Contributing

We welcome contributions! Follow these steps to get involved:

1. **Fork the Repository:**
    
    Click the "Fork" button at the top of this repository.
    
2. **Create a Feature Branch:**
    
    ```bash
    git checkout -b feature/your-feature-name
    
    ```
    
3. **Commit Your Changes:**
    
    Write meaningful commit messages for better tracking:
    
    ```bash
    git commit -m "Add new feature description"
    
    ```
    
4. **Push to Your Fork:**
    
    ```bash
    git push origin feature/your-feature-name
    
    ```
    
5. **Open a Pull Request:**
    
    Submit your branch for review and include a detailed description of the changes.
    