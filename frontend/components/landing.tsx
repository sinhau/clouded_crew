import { useState, useEffect } from "react";

import {
  Flex,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Heading,
  Text
} from "@chakra-ui/react";

import Navbar from "./UI/navbar";
import FAQ from "./faq";

//ETH Tools
import abi from "../public/abis/LoftyClouds.json";
import { ethers, utils } from "ethers";
import { useWeb3 } from "@lido-sdk/web3-react";

import { motion } from "framer-motion";

export default function Landing() {
  const { account, chainId, library } = useWeb3();

  const [presale, setPresale] = useState<boolean>();
  const [amount, setAmount] = useState<number>();

  const rinkebyRPC = process.env.NEXT_PUBLIC_RPC_RINKEBY;
  const provider = new ethers.providers.JsonRpcProvider(rinkebyRPC);
  const nftContract = new ethers.Contract(
    "0xFbeFa82E1Dc1C05B1bbF4cb1F4211DEF635Aa463",
    abi.abi,
    provider
  );

  async function getPresaleStatus() {
    const resp = await nftContract.isPresaleActive();
    setPresale(resp);
  }

  async function batchMint() {
  try {
    const connectedContract = new ethers.Contract(
      "0xFbeFa82E1Dc1C05B1bbF4cb1F4211DEF635Aa463",
      abi.abi,
      library?.getSigner()
    );
    const mintTx = await connectedContract.batchMint(account, amount, {
      gasLimit: 505264
    });
    console.log("mint is happening");

    await mintTx().wait();

    console.log(`YOU MINTED ${amount} NFTs SUCCESSFULY!`)
  } catch(e) {
    console.log(e);
    console.log(account);
  }
  }

  async function mintPresale() {
  try {
    const connectedContract = new ethers.Contract(
      "0xFbeFa82E1Dc1C05B1bbF4cb1F4211DEF635Aa463",
      abi.abi,
      library?.getSigner()
    );
    const mintTx = await connectedContract.mintPresale({
      gasLimit: 505264
    });

    await mintTx().wait();

    console.log("MINT SUCCESSFUL!")
  } catch(e) {
    console.log("mint did not happen");
  }
  }

  const changeAmount = async (e: any) => {
    setAmount(e.target.value);
  }

  useEffect(() => {
    getPresaleStatus();
    console.log(amount)
  }, [account, chainId, amount]);

  return (
    <Flex direction="column" minH="100vh" w="100%" overflow="hidden">
      <Stack
        minH="100vh"
        w="100%"
        bgImage="/assets/bannertweet.png"
        bgRepeat="repeat"
        bgSize="cover"
        alignItems="center"
        justifyContent="center"
        spacing="2rem"
      >
        <Navbar />

        <Text variant="large">PRESALE IS:</Text>
        <Heading variant="medium">{presale ? "ACTIVE" : "NOT ACTIVE"}</Heading>

        <Stack alignItems="center">
          <Heading variant="medium">How many?</Heading>
          <NumberInput
            value={amount}
            onChange={(e) => changeAmount(e)}
            placeholder="Number of NFTs you want"
          />
          <NumberInput defaultValue={presale ? 1 : 0} min={0} max={3}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          {amount && amount > 3 ? <Text color="red">You can mint a maximum of 3 NFTs</Text> : null}

          <motion.div whileHover={{ scale: 1.2 }}>
            <Button
            onClick={() => batchMint()}
            variant="primary" w="fit-content">
              Mint NFT
            </Button>
          </motion.div>
        </Stack>

        <Stack alignItems="center">
          <Heading textAlign="center">Our Mission</Heading>
          <Text textAlign="center" w={{ base: "90%", md: "50%" }}>
            Our mission is to onboard more creatives to the NFT space by giving
            them the support and funding they need to build their own project.
            We also are committing 10% of mint sales and 0.333% of royalties to
            charities that support art programs in the school system.
          </Text>
        </Stack>
        <FAQ />
      </Stack>
    </Flex>
  );
}
