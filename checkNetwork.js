const { ethers } = require("ethers");
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
provider.getNetwork().then(network => console.log("Chain ID:", network.chainId));
