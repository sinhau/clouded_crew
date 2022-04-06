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

async function setSaleStatus(saleStatus) {
  const nonce = await web3.eth.getTransactionCount(ALTERNATE_PUBLIC_KEY, "latest");

  const tx = {
    from: ALTERNATE_PUBLIC_KEY,
    to: CONTRACT_ADDRESS,
    nonce: nonce,
    gas: 15000000,
    data: nftContract.methods.updateSalePausedStatus(saleStatus).encodeABI(),
  };

  const resp = await nftContract.methods.isSalePaused().call();
  console.log("Current sale pause status:", resp);

  const signedTx = await web3.eth.accounts.signTransaction(tx, ALTERNATE_PRIVATE_KEY);
  console.log(`Setting sale pause status to ${saleStatus}`);
  try {
    const resp = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  } catch (e) {
    const reason = await getRevertReason(e.receipt.transactionHash);
    console.log("Error:", reason.method);
  } finally {
    const resp = await nftContract.methods.isSalePaused().call();
    console.log("Sale pause status:", resp);
  }
}

var inp = process.argv[2];
var saleStatus = inp === "true" ? true : false;
setSaleStatus(saleStatus);
