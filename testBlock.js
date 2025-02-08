const { ethers } = require("ethers");
const provider = new ethers.JsonRpcProvider("https://ethereum-holesky.publicnode.com");

async function getBlock() {
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("Latest block number:", blockNumber);
  } catch (err) {
    console.error("Error:", err);
  }
}

getBlock();
