import { ethers } from "ethers";

// Адреса контрактов
const UNIVERSITY_TOKEN_ADDRESS = "0xCdA29A8539F3CdF47D00a236349dc024CE47aD2C"; // Замените на реальный адрес токена
const MARKETPLACE_ADDRESS = "0xEB6167114ffe2B72f09164b4B52F7b1272aEaceb"; // Замените на реальный адрес маркетплейса

// ABI контрактов
import UniversityTokenABI from "../../build/contracts/UniversityToken.json";
import AIModelMarketplaceABI from "../../build/contracts/AIMarketplace.json";

export const deleteListing = async (signer, modelId) => {
    try {
      const marketplaceContract = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        AIModelMarketplaceABI.abi,
        signer
      );
      console.log("Deleting listing with ID:", modelId);
      const tx = await marketplaceContract.deleteListing(modelId, { gasLimit: 3000000 });
      console.log("Delete transaction sent:", tx.hash);
      await tx.wait();
      console.log("Listing deleted successfully");
      return tx;
    } catch (error) {
      console.error("Error deleting listing:", error);
      throw error;
    }
};

// Подключение кошелька (MetaMask)
export const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Проверяем сеть:
      const network = await provider.getNetwork();
      console.log("Connected network:", network);

      
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      console.log("Wallet connected:", address);
      return { provider, signer, address };
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Check the console for details.");
    }
  };
  


// Получение баланса токенов
export const getTokenBalance = async (userAddress, provider) => {
    if (!provider || !userAddress) {
        console.error("Invalid provider or user address");
        return;
    }
    try {
        const tokenContract = new ethers.Contract(
            UNIVERSITY_TOKEN_ADDRESS,
            UniversityTokenABI.abi,
            provider
        );
        console.log("Fetching token balance for address:", userAddress);
        const balance = await tokenContract.balanceOf(userAddress);
        console.log("Raw balance:", balance.toString());
        return ethers.formatUnits(balance, 18); // Форматируем баланс в ETH
    } catch (error) {
        console.error("Error fetching token balance:", error);
        alert("Failed to fetch token balance. Check the console for details.");
    }
};

// Одобрение токенов
// Одобрение токенов
export const approveTokens = async (signer, amount) => {
    try {
        const tokenContract = new ethers.Contract(
            UNIVERSITY_TOKEN_ADDRESS,
            UniversityTokenABI.abi,
            signer
        );

        console.log("Approving tokens for marketplace...");
        const tx = await tokenContract.approve(MARKETPLACE_ADDRESS, amount);
        console.log("Approval transaction sent:", tx.hash);

        await tx.wait();
        console.log("Approval confirmed");
        alert("Tokens approved successfully!");
    } catch (error) {
        console.error("Error approving tokens:", error);
        alert("Failed to approve tokens. Check the console for details.");
    }
};

// Создание листинга модели
export const listModel = async (signer, name, description, price) => {
    if (!signer || !name || !description || !price) {
        console.error("Invalid input for listing model");
        return;
    }

    try {
        // Ensure the price is passed as a string
        const priceInWei = ethers.parseEther(price.toString());

        console.log("Price in Wei:", priceInWei.toString()); // Debugging

        const marketplaceContract = new ethers.Contract(
            MARKETPLACE_ADDRESS,
            AIModelMarketplaceABI.abi,
            signer
        );

        console.log("Creating listing with data:", { name, description, price: priceInWei });
        const tx = await marketplaceContract.createListing(name, description, priceInWei, "");
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
        alert("Listing created successfully!");
    } catch (error) {
        console.error("Error creating listing:", error);
        alert("Failed to create listing. Check the console for details.");
    }
};

// Покупка модели
export const purchaseModel = async (signer, modelId, price) => {
    try {
        // Проверяем баланс пользователя
        const tokenContract = new ethers.Contract(
            UNIVERSITY_TOKEN_ADDRESS,
            UniversityTokenABI.abi,
            signer
        );
        const buyerBalance = await tokenContract.balanceOf(await signer.getAddress());
        const buyerBalanceBN = BigInt(buyerBalance);

        console.log("Buyer Balance (Wei):", buyerBalanceBN.toString());

        if (buyerBalanceBN < price) {
            alert("Insufficient balance to purchase the model");
            return;
        }

        // Проверяем allowance (разрешение)
        const allowance = await tokenContract.allowance(await signer.getAddress(), MARKETPLACE_ADDRESS);
        console.log("Allowance (Wei):", allowance.toString());

        if (allowance < price) {
            // Если allowance недостаточно, вызываем approve
            console.log("Insufficient allowance. Approving tokens...");
            await approveTokens(signer, price);
        }

        // Покупаем модель
        const marketplaceContract = new ethers.Contract(
            MARKETPLACE_ADDRESS,
            AIModelMarketplaceABI.abi,
            signer
        );
        console.log("Purchasing model with ID:", modelId, "and price:", price.toString());
        const tx = await marketplaceContract.purchaseModel(modelId, { gasLimit: 3000000 });
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
        alert("Purchase successful!");
    } catch (error) {
        console.error("Error purchasing model:", error);
        alert(`Failed to purchase model: ${error.message}`);
    }
};

// Получение информации о модели
export const getModelDetails = async (provider, modelId) => {
    if (!provider || !modelId) {
        console.error("Invalid provider or model ID");
        return;
    }
    try {
        const marketplaceContract = new ethers.Contract(
            MARKETPLACE_ADDRESS,
            AIModelMarketplaceABI.abi,
            provider
        );
        console.log("Fetching details for model ID:", modelId);
        const [id, name, description, price, seller, fileLink, isSold, isDeleted, rating, ratingCount] =
            await marketplaceContract.getModel(modelId);
        const formattedPrice = ethers.formatEther(price.toString());
        console.log("Model details fetched:", {
            id: id.toString(),
            name,
            description,
            price: formattedPrice,
            seller,
            fileLink,
            isSold,
            isDeleted,
            rating: rating.toString(),
            ratingCount: ratingCount.toString()
        });
        return {
            id: id.toString(),
            name,
            description,
            price: formattedPrice,
            seller,
            fileLink,
            isSold,
            isDeleted,
            rating: rating.toString(),       // Средний рейтинг
            ratingCount: ratingCount.toString() // Количество оценок
        };
    } catch (error) {
        console.error("Error fetching model details:", error);
        alert("Failed to fetch model details. Check the console for details.");
    }
};


// Получение количества моделей
export const getModelsCount = async (provider) => {
    if (!provider) {
        console.error("Invalid provider");
        return;
    }
    try {
        const marketplaceContract = new ethers.Contract(
            MARKETPLACE_ADDRESS,
            AIModelMarketplaceABI.abi,
            provider
        );
        console.log("Fetching models count...");
        const count = await marketplaceContract.getModelsCount();
        console.log("Models count fetched:", count.toString());
        return count;
    } catch (error) {
        console.error("Error fetching models count:", error);
        alert("Failed to fetch models count. Check the console for details.");
    }
};

// Оценка модели
export const rateModel = async (signer, modelId, rating) => {
    try {
        const marketplaceContract = new ethers.Contract(
            MARKETPLACE_ADDRESS,
            AIModelMarketplaceABI.abi,
            signer
        );

        console.log("Rating model with ID:", modelId, "and rating:", rating);
        const tx = await marketplaceContract.rateModel(modelId, rating);
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
        alert("Rating submitted successfully!");
    } catch (error) {
        console.error("Error rating model:", error);
        alert("Failed to submit rating. Check the console for details.");
    }
};


