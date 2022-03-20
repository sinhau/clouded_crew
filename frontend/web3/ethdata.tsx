import { CHAINS } from "@lido-sdk/constants";

export const supportedChainIds = [CHAINS.Mainnet, CHAINS.Rinkeby];

export const rpc = {
  [CHAINS.Mainnet]: "https://main-light.eth.linkpool.io",
  [CHAINS.Rinkeby]: "https://eth-rinkeby.alchemyapi.io/v2/Tu1kbaSWQJAlqnmR1vdwfFWdWm-NqGYL"
};
