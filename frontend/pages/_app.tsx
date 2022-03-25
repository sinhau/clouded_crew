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
      font-family: "McKloud";
      src: url("./fonts/Mckloud/MCKLB.ttf") format("ttf");
      font-display: swap;
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;

    }`}
  />
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <ProviderWeb3
    defaultChainId={4}
    rpc={rpc}
    supportedChainIds={supportedChainIds}>
    <ChakraProvider theme={theme}>
    <Fonts />
    <Component {...pageProps} />
    </ChakraProvider>
  </ProviderWeb3>
)
}

export default MyApp
