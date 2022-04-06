require("dotenv").config();
const InputDataDecoder = require("ethereum-input-data-decoder");

const RINKEBY_API_URL = process.env.RINKEBY_API_URL;
const CONTRACT_ADDRESS = process.env.TESTNET_CONTRACT_ADDRESS;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(RINKEBY_API_URL);

const contract = require("../artifacts/contracts/CloudedCrew.sol/CloudedCrew.json");
const decoder = new InputDataDecoder(contract.abi);

const nftContract = new web3.eth.Contract(contract.abi, CONTRACT_ADDRESS);

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const ALTERNATE_PUBLIC_KEY = process.env.ALTERNATE_PUBLIC_KEY;
const ALTERNATE_PRIVATE_KEY = process.env.ALTERNATE_PRIVATE_KEY;

async function getRevertReason(txHash) {
  const tx = await web3.eth.getTransaction(txHash);
  web3.eth.handleRevert = true;
  try {
    var result = await web3.eth.call(tx, tx.blockNumber);
  } catch (e) {
    var result = decoder.decodeData(e.data);
    if (result.method == null) {
      result.method = e.reason;
    }
  }
  return result;
}

async function setPresaleStatus(presaleStatus) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");

  const tx = {
    from: PUBLIC_KEY,
    to: CONTRACT_ADDRESS,
    nonce: nonce,
    gas: 15000000,
    data: nftContract.methods.updatePresaleStatus(presaleStatus).encodeABI(),
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  const resp = await nftContract.methods.isPresaleActive().call();
  console.log("Current presale status:", resp);

  console.log(`Setting presale status to ${presaleStatus}`);
  try {
    const resp = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  } catch (e) {
    const reason = await getRevertReason(e.receipt.transactionHash);
    console.log("Error:", reason.method);
  } finally {
    const resp = await nftContract.methods.isPresaleActive().call();
    console.log("Presale status:", resp);
  }
}

var inp = process.argv[2];
var presaleStatus = inp === "true" ? true : false;
setPresaleStatus(presaleStatus);
