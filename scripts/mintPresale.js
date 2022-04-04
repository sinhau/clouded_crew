require("dotenv").config();

const RINKEBY_API_URL = process.env.RINKEBY_API_URL;
const CONTRACT_ADDRESS = process.env.TESTNET_CONTRACT_ADDRESS;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const web3 = createAlchemyWeb3(RINKEBY_API_URL);

const contract = require("../artifacts/contracts/CloudedCrew.sol/CloudedCrew.json");

const nftContract = new web3.eth.Contract(contract.abi, CONTRACT_ADDRESS);

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
async function mintPresale() {
  console.log("Minting 1 presale Clouded Crew...");

  this.whitelist = require("../whitelist.json");

  const leafNodes = this.whitelist.map((address) => keccak256(address));
  this.merkleTree = new MerkleTree(leafNodes, keccak256, {
    sortPairs: true,
  });

  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: CONTRACT_ADDRESS,
    nonce: nonce,
    gas: 150000,
    data: nftContract.methods
      .mintPresale(this.merkleTree.getHexProof(keccak256(PUBLIC_KEY)))
      .encodeABI(),
  };

  console.log("Minting NFT for address: " + PUBLIC_KEY);
  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth
        .sendSignedTransaction(signedTx.rawTransaction, function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            );
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
          }
        })
        .then(() => {
          console.log("NFT minted successfully!");
        });
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
}

mintPresale();
