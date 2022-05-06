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
  const proxyRegistryAddressOpensea =
    "0x1E525EEAF261cA41b809884CBDE9DD9E1619573A";
  // 0x1E525EEAF261cA41b809884CBDE9DD9E1619573A //RINKEBY
  // 0xa5409ec958c83c3f309868babaca7c86dcb077c1 // MAINNET

  // Deploy main contract
  console.log("---\nDeploying main contract");

  const contractFactory = await ethers.getContractFactory("CloudedCrew");
  const contract = await contractFactory.deploy(
    merkleTree.getHexRoot(),
    process.env.PUBLIC_KEY,
    "https://gateway.pinata.cloud/ipfs/QmVrLmQgrowmbMf1M9YseiQG6HN1ZHWwhaoui81V6wzahS/",
    proxyRegistryAddressOpensea
  );

  console.log("Contract deployed at: ", contract.address, "\n");
}

deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
