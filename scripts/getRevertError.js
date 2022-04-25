require("dotenv").config();
const InputDataDecoder = require("ethereum-input-data-decoder");

const RINKEBY_API_URL = process.env.RINKEBY_API_URL;
const CONTRACT_ADDRESS = process.env.TESTNET_CONTRACT_ADDRESS;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(RINKEBY_API_URL);

const contract = require("../artifacts/contracts/CloudedCrew.sol/CloudedCrew.json");
const decoder = new InputDataDecoder(contract.abi);

async function getRevertReason(txHash) {
  const tx = await web3.eth.getTransaction(txHash);
  web3.eth.handleRevert = true;
  try {
    var result = await web3.eth.call(tx, tx.blockNumber);
  } catch (e) {
    console.log(e);
    var result = decoder.decodeData(e.data);
    if (result.method == null) {
      result.method = e.reason;
    }
  }
  return result;
}

getRevertReason(
  "0x1ac2a86e300a86c92f97f8fdface2923a7940326f14c556d60c89dd120e859a1"
).then((result) => {
  console.log(result);
});
