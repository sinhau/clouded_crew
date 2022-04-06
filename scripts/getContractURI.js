require("dotenv").config();

const RINKEBY_API_URL = process.env.RINKEBY_API_URL;
const CONTRACT_ADDRESS = process.env.TESTNET_CONTRACT_ADDRESS;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(RINKEBY_API_URL);

const contract = require("../artifacts/contracts/CloudedCrew.sol/CloudedCrew.json");

const nftContract = new web3.eth.Contract(contract.abi, CONTRACT_ADDRESS);

async function getContractURI() {
  const resp = await nftContract.methods.contractURI().call();
  console.log(resp);
}
getContractURI();
