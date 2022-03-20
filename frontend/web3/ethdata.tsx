import { CHAINS } from "@lido-sdk/constants";

export const supportedChainIds = [CHAINS.Mainnet, CHAINS.Rinkeby];

export const rpc = {
  [CHAINS.Mainnet]: "https://main-light.eth.linkpool.io",
  [CHAINS.Rinkeby]: process.env.NEXT_PUBLIC_SC_RPC_RINKEBY
};
