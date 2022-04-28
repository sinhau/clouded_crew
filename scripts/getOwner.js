require("dotenv").config();

const RINKEBY_API_URL = process.env.RINKEBY_API_URL;
const CONTRACT_ADDRESS = process.env.TESTNET_CONTRACT_ADDRESS;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { base64 } = require("ethers/lib/utils");
const InputDataDecoder = require("ethereum-input-data-decoder");

const web3 = createAlchemyWeb3(RINKEBY_API_URL);

const contract = require("../artifacts/contracts/CloudedCrew.sol/CloudedCrew.json");
const decoder = new InputDataDecoder(contract.abi);

const nftContract = new web3.eth.Contract(contract.abi, CONTRACT_ADDRESS);

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

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

async function getOwner() {
  try {
    const resp = await nftContract.methods.owner().call();
    console.log(resp);
  } catch (e) {
    var result = decoder.decodeData(e.data);
    console.log(`Error: ${result.method}`);
  }
}

getOwner();
