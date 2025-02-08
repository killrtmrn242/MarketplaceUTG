import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import {
    connectWallet,
    getTokenBalance,
    listModel,
    purchaseModel,
    rateModel,
    getModelDetails,
    getModelsCount,
    deleteListing
} from "./utils/web3";
import Listing from "./components/Listing";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const UNIVERSITY_TOKEN_ADDRESS = "0xCdA29A8539F3CdF47D00a236349dc024CE47aD2C"; // Замените на реальный адрес токена
const MARKETPLACE_ADDRESS = "0xEB6167114ffe2B72f09164b4B52F7b1272aEaceb"; // Замените на реальный адрес маркетплейса

// ABI контрактов
import UniversityTokenABI from "./../build/contracts/UniversityToken.json";
import AIModelMarketplaceABI from "./../build/contracts/AIMarketplace.json";

const App = () => {
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState(0);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(false);

    const connect = async () => {
        try {
            const walletData = await connectWallet();
            if (walletData) {
                setWallet(walletData);
                refreshBalance(walletData.address, walletData.provider);
            }
        } catch (error) {
            console.error("Error connecting wallet:", error);
            toast.error("Failed to connect wallet");
        }
    };

    const refreshBalance = async (address, provider) => {
        try {
            const newBalance = await getTokenBalance(address, provider);
            setBalance(newBalance);
            toast.success("Token balance refreshed!");
        } catch (error) {
            console.error("Error refreshing token balance:", error);
            toast.error("Failed to refresh token balance");
        }
    };

    const loadModels = async () => {
        if (!wallet) {
            toast.error("Please connect your wallet first");
            return;
        }
        setLoading(true);
        try {
            const count = await getModelsCount(wallet.provider);
            const modelsData = [];
            for (let i = 1; i <= count; i++) {
                const model = await getModelDetails(wallet.provider, i);
                // Если модель помечена как удалённая, пропускаем её
                if (model && model.isDeleted) continue;
                if (model) {
                    modelsData.push({ id: i, ...model });
                }
            }
            setModels(modelsData);
            toast.success("Models loaded successfully!");
        } catch (error) {
            console.error("Error loading models:", error);
            toast.error("Failed to load models");
        } finally {
            setLoading(false);
        }
    };
    
    

    const handleCreateListing = async () => {
        const name = document.getElementById("modelName").value;
        const description = document.getElementById("modelDescription").value;
        const price = document.getElementById("modelPrice").value;

        if (!name || !description || !price || parseFloat(price) <= 0) {
            toast.error("Please fill in all fields correctly");
            return;
        }

        try {
            await listModel(wallet.signer, name, description, price);
            toast.success("Listing created!");
            loadModels();
        } catch (error) {
            console.error("Error creating listing:", error);
            toast.error("Failed to create listing");
        }
    };

    const handlePurchase = async (id, price) => {
        try {
            // Конвертируем цену (полученную из модели, например "1.0") в wei
            const priceInWei = ethers.parseEther(price.toString());
            console.log("Price in Wei:", priceInWei.toString()); // Debugging
    
            // Проверяем баланс пользователя
            const tokenContract = new ethers.Contract(
                UNIVERSITY_TOKEN_ADDRESS,
                UniversityTokenABI.abi,
                wallet.signer
            );
            const buyerBalance = await tokenContract.balanceOf(wallet.address);
            const buyerBalanceBN = BigInt(buyerBalance);
            console.log("Buyer Balance (Wei):", buyerBalanceBN.toString());
    
            if (buyerBalanceBN < priceInWei) {
                toast.error("Insufficient balance to purchase the model");
                return;
            }
    
            // Передаем цену в wei в функцию purchaseModel
            await purchaseModel(wallet.signer, id, priceInWei);
            toast.success("Purchase successful!");
            loadModels(); // Обновляем список моделей
        } catch (error) {
            console.error("Error purchasing model:", error);
            toast.error("Failed to purchase model");
        }
    };
    
    const handleRate = async (id, rating) => {
        try {
            await rateModel(wallet.signer, id, rating);
            toast.success("Rating submitted!");
            loadModels();
        } catch (error) {
            console.error("Error rating model:", error);
            toast.error("Failed to submit rating");
        }
    };
    // Добавьте функцию для удаления листинга в App.js
    const handleDeleteListing = async (id) => {
        try {
            await deleteListing(wallet.signer, id); // Предполагается, что функция deleteListing реализована в utils/web3
            toast.success("Listing deleted!");
            loadModels(); // Обновляем список моделей
        } catch (error) {
            console.error("Error deleting listing:", error);
            toast.error("Failed to delete listing");
        }
    };


    useEffect(() => {
        if (wallet) {
            loadModels();
        }
    }, [wallet]);

    return (
        <div className="app">
            <h1>AI Marketplace</h1>
            <button onClick={connect}>Connect Wallet</button>
            {wallet && (
                <>
                    <p>Connected Address: {wallet.address}</p>
                    <p>
                        Token Balance: {balance}{" "}
                        <button onClick={() => refreshBalance(wallet.address, wallet.provider)}>
                            Refresh Balance
                        </button>
                    </p>
                </>
            )}
            <div>
                <h2>Create New Listing</h2>
                <input type="text" placeholder="Model Name" id="modelName" />
                <input type="text" placeholder="Description" id="modelDescription" />
                <input type="text" placeholder="Price (in ETH)" id="modelPrice" />
                <button onClick={handleCreateListing}>Create Listing</button>
            </div>
            <button onClick={loadModels} disabled={loading}>
                {loading ? "Loading models..." : "Refresh Models"}
            </button>
            <div className="listings">
                {loading ? (
                    <p>Loading models...</p>
                ) : models.length > 0 ? (
                    models.map((model) => (
                        <Listing
                            key={model.id}
                            model={model}
                            onPurchase={handlePurchase}
                            onRate={handleRate}
                            onDelete={handleDeleteListing} // Передаем функцию удаления
                        />
                    ))
                ) : (
                    <p>No models available</p>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default App;