require("dotenv").config();

const RINKEBY_API_URL = process.env.RINKEBY_API_URL;
const CONTRACT_ADDRESS = process.env.TESTNET_CONTRACT_ADDRESS;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { base64 } = require("ethers/lib/utils");
const web3 = createAlchemyWeb3(RINKEBY_API_URL);

const contract = require("../artifacts/contracts/CloudedCrew.sol/CloudedCrew.json");

const nftContract = new web3.eth.Contract(contract.abi, CONTRACT_ADDRESS);

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const ALTERNATE_PUBLIC_KEY = process.env.ALTERNATE_PUBLIC_KEY;

async function getBalance(tokenID) {
  const resp = await nftContract.methods.balanceOf(PUBLIC_KEY, tokenID).call();
  const resp2 = await nftContract.methods.balanceOf(ALTERNATE_PUBLIC_KEY, tokenID).call();
  console.log(
    `Balance of ${PUBLIC_KEY}: ${resp}\nBalance of ${ALTERNATE_PUBLIC_KEY}: ${resp2}`
  );
}

var tokenID = process.argv[2];
console.log("TokenID used is: ", tokenID);
getBalance(tokenID);
