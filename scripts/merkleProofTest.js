const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

this.whitelist = require("../whitelist.json");

const leafNodes = this.whitelist.map((address) => keccak256(address));
const merkleTree = new MerkleTree(leafNodes, keccak256, {
  sortPairs: true,
});
const root = merkleTree.getRoot().toString("hex");
console.log("Merkle tree root is", root);

console.log("Merkle tree hex root", merkleTree.getHexRoot());

var leaf = keccak256(this.whitelist[1]);
var proof = merkleTree.getHexProof(leaf);
console.log(merkleTree.verify(proof, leaf, root)); // true

leaf = keccak256(ethers.Wallet.createRandom().address);
proof = merkleTree.getProof(leaf);
console.log(merkleTree.verify(proof, leaf, root)); // false
