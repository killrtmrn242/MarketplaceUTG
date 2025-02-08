const UniversityToken = artifacts.require("UniversityToken");
const AIMarketplace = artifacts.require("AIMarketplace");

module.exports = async function (deployer, network, accounts) {
  // Разверните токен (например, с начальными параметрами)
  await deployer.deploy(UniversityToken);
  const tokenInstance = await UniversityToken.deployed();
  console.log("UniversityToken deployed at:", tokenInstance.address);

  // Разверните маркетплейс, передав адрес токена в конструктор
  await deployer.deploy(AIMarketplace, tokenInstance.address);
  const marketplaceInstance = await AIMarketplace.deployed();
  console.log("AIMarketplace deployed at:", marketplaceInstance.address);
};
