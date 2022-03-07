const { ethers } = require("hardhat");
require("dotenv").config();

async function deployContract() {
  // Deploy main contract
  console.log("---\nDeploying main contract");

  const contractFactory = await ethers.getContractFactory("LoftyClouds");
  const contract = await contractFactory.deploy();

  console.log("Contract deployed at: ", contract.address, "\n");
}

deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
