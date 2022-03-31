import type { NextPage } from 'next'
import Head from 'next/head'
import Landing from '../components/landing';
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
      src: url("../public/fonts/McKloud/MCKLB.ttf") format("ttf");
      font-display: swap;
    }`}
  />
);

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>CloudyButts</title>
        <meta name="CloudedCrew NFTs" content="Generated by create next app" />
        <link rel="icon" href="/assets/logo_fla.png" />
        <link
         href="../public/fonts/Mckloud/MCKLB.ttf"
         rel="stylesheet"
        />
      </Head>
      <Landing />
    </>
  )
}

export default Home