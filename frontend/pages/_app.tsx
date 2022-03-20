import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import theme from "../styles/theme";
import { Global } from "@emotion/react";
import { rpc, supportedChainIds } from "../web3/ethdata";
import { ProviderWeb3 } from "@lido-sdk/web3-react";
import "@fontsource/inter/variable-full.css";
import "@fontsource/inter";

export const Fonts = () => (
  <Global
    styles={`
    @font-face {
      font-family: "Mckloud Black";
      src: url("./fonts/MckloudBlack.ttf") format("ttf"),
      font-display: fallback;
    }`}
  />
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ProviderWeb3
      defaultChainId={1}
      supportedChainIds={supportedChainIds}
      rpc={rpc}
    >
    <ChakraProvider theme={theme}>
    <Fonts />
    <Component {...pageProps} />
    </ChakraProvider>
  </ProviderWeb3>
)
}

export default MyApp
