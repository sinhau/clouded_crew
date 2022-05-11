/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");

const { RINKEBY_API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.11",
  settings: {
    optimizer: {
      enabled: true,
      run: 100000,
    },
  },
  networks: {
    hardhat: {},
    rinkeby: {
      url: RINKEBY_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    mainnet: {
      url: MAINNET_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 50,
    enabled: true,
    coinmarketcap: "cb2bc4d1-c791-4b17-b6cb-3d9182deeebd",
  },
};
