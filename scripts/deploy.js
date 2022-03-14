const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
require("dotenv").config();

async function deployContract() {
  const whitelist = require("../whitelist.json");

  const leafNodes = whitelist.map((address) => keccak256(address));
  const merkleTree = new MerkleTree(leafNodes, keccak256, {
    sortPairs: true,
  });

  // Deploy main contract
  console.log("---\nDeploying main contract");

  const contractFactory = await ethers.getContractFactory("LoftyClouds");
  const contract = await contractFactory.deploy(merkleTree.getHexRoot());

  console.log("Contract deployed at: ", contract.address, "\n");
}

deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
