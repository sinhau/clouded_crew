import { CHAINS } from "@lido-sdk/constants";

export const supportedChainIds = [1, 4];

export const rpc = {
  1: "https://main-light.eth.linkpool.io",
  4: process.env.NEXT_PUBLIC_SC_RPC_RINKEBY
};
