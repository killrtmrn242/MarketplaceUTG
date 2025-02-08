# Marketplace UTG

A decentralized marketplace dApp for buying, selling, and rating AI models using the UniversityToken (UTG) ERC-20 token.

> **Note:**  
> This project is built for testing on the Holesky testnet. Smart contracts are deployed via Truffle, and the frontend is built using React, Webpack, and Ethers.js.

---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Compile and Deploy Smart Contracts](#3-compile-and-deploy-smart-contracts)
  - [4. Configure MetaMask and the Holesky Testnet](#4-configure-metamask-and-the-holesky-testnet)
  - [5. Run the Frontend](#5-run-the-frontend)
- [Usage](#usage)

---

## Description

**Marketplace UTG** is a decentralized application (dApp) that allows users to create listings for AI models, purchase models using UTG tokens, and rate them. The dApp interacts with two smart contracts:

- **UniversityToken.sol** – An ERC-20 token contract (UTG) used as the currency within the marketplace.
- **AIMarketplace.sol** – The marketplace contract that enables:
  - Creating listings for models.
  - Purchasing models by transferring UTG tokens from the buyer to the seller.
  - Deleting listings (only by the seller, if the model is not sold).
  - Rating models (calculating an average rating and tracking the number of ratings).

All transactions occur on the Holesky testnet, and test ETH (required for gas) can be obtained via the official faucet.

---

## Features

- **Create Listing:** Sellers can create a listing by providing a model name, description, price (in UTG), and a file link (e.g., an IPFS hash).
- **Purchase Model:** Buyers can purchase a model using UTG tokens. The marketplace contract uses the `approve` mechanism to transfer tokens.
- **Delete Listing:** Sellers can delete their listing if the model has not been sold.
- **Rate Model:** Users can rate models. The average rating and the total number of ratings are displayed on the listing.
- **Modern UI:** The frontend is built using React and Webpack, with a responsive design for a better user experience.

---

## Technologies

- **Smart Contracts:** Solidity 0.8.0, OpenZeppelin Contracts
- **Deployment:** Truffle, HDWalletProvider
- **Testnet:** Holesky (RPC URL: `https://rpc.holesky.ethpandaops.io/v1`, Chain ID: 17000)
- **Frontend:** React, Ethers.js, Webpack, Babel
- **Styling:** CSS

---

## Project Structure
```
MarketplaceUTG/
├── contracts/                # Smart contracts (UniversityToken.sol, AIMarketplace.sol)
├── migrations/               # Truffle migration scripts
├── src/                      # React application source code
│   ├── index.js              # Frontend entry point
│   ├── App.js                # Main React component
│   ├── components/           # React components (e.g., Listing.js)
│   └── styles/               # CSS files
├── build/                    # Compiled artifacts (ABI and deployed contract addresses)
├── truffle-config.js         # Truffle configuration file
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
```



## Installation and Setup

### 1. Clone the Repository

Clone the repository to your local machine:

git clone https://github.com/killrtmrn242/MarketplaceUTG.git
cd MarketplaceUTG

### 2. Install Dependencies

Install all necessary npm packages:

npm install

This will install packages for both Truffle and the React frontend.

### 3. Compile and Deploy Smart Contracts

Ensure your truffle-config.js is set up for the Holesky testnet (with the correct RPC URL, chain id, and mnemonic). Then compile and deploy:

truffle compile
truffle migrate --network holesky

After deployment, note the contract addresses printed in the console and update them in your frontend code if necessary.

### 4. Configure MetaMask and the Holesky Testnet

Add Holesky Network in MetaMask with the following settings:

- Network Name: Holesky Testnet
- New RPC URL: https://rpc.holesky.ethpandaops.io/v1
- Chain ID: 17000
- Currency Symbol: ETH
- Block Explorer URL: (if available, e.g., https://explorer.holesky.etherscan.io)

Obtain Test ETH using the official faucet: https://cloud.google.com/application/web3/faucet/ethereum/holesky

### 5. Run the Frontend

Build and start the React application:

npm run build    # Builds the project (if using webpack)
npm start        # Starts the development server (default port: 8080)

Your application should now open in your browser.

## Usage

- **Connect Wallet:**  
  Click the "Connect Wallet" button in your dApp. Ensure MetaMask is connected to the Holesky testnet.

- **View Balance:**  
  Your UTG token balance will be displayed after connecting your wallet.

- **Create a Listing:**  
  Fill in the Model Name, Description, Price (in UTG), and File Link. Click "Create Listing" to add a new model listing.

- **Purchase a Model:**  
  Select a listing and click "Purchase". (Make sure you use a different account from the seller to see a change in balance.)

- **Delete a Listing:**  
  Sellers can delete their listing if the model hasn’t been sold by clicking "Delete Listing".

- **Rate a Model:**  
  Users can rate a model by clicking one of the rating buttons. The average rating and the number of ratings will be updated accordingly.
