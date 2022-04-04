require("dotenv").config();

const RINKEBY_API_URL = process.env.RINKEBY_API_URL;
const CONTRACT_ADDRESS = process.env.TESTNET_CONTRACT_ADDRESS;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(RINKEBY_API_URL);

const contract = require("../artifacts/contracts/CloudedCrew.sol/CloudedCrew.json");

const nftContract = new web3.eth.Contract(contract.abi, CONTRACT_ADDRESS);

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
async function mint(amount) {
  console.log("Minting " + amount + " CloudedCrew...");

  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: CONTRACT_ADDRESS,
    value: web3.utils.toWei((0.03 * amount).toString(), "ether"),
    nonce: nonce,
    gas: 150000,
    data: nftContract.methods.batchMint(amount).encodeABI(),
  };

  console.log("Minting NFT");
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

var amount = process.argv[2];
mint(amount);
