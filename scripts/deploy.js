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
    "0x1E525EEAF261cA41b809884CBDE9DD9E1619573A"; //RINKEBY

  // Deploy main contract
  console.log("---\nDeploying main contract");

  const contractFactory = await ethers.getContractFactory("CloudedCrew");
  const contract = await contractFactory.deploy(
    merkleTree.getHexRoot(),
    "0xdd175a204142040850211B529Dcb9af6eE743e1B",
    "https://gateway.pinata.cloud/ipfs/Qmaxqbo2ZDBRYv7Ukw7L9B7dq2vUQqB1ysH6x5CLcDAVPa/",
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
