import { Flex, Stack, Button, Heading, Text } from "@chakra-ui/react";

import Navbar from "./UI/navbar";
import FAQ from "./faq";

import {motion} from "framer-motion";

export default function Landing() {
  return (
    <Flex direction="column" minH="100vh" w="100%" overflow="hidden">
      <Stack
        minH="100vh"
        w="100%"
        bgImage="/assets/bannertweet.png"
        bgRepeat="repeat"
        bgSize="cover"
        alignItems="center"
      >
      <Navbar />

        <Heading>Our Mission</Heading>
        <Text w={{base: "90%", md: "50%"}}>Our mission is to onboard more creatives to the NFT space by giving them the support and funding they need to build their own project. We also are committing 10% of mint sales and 0.333% of royalties to charities that support art programs in the school system.</Text>

        <Heading variant="medium">How many?</Heading>
        <motion.div
          whileHover={{scale: 1.2}}
        >
          <Button variant="primary" w="fit-content">
            Mint NFT
          </Button>
        </motion.div>
        <FAQ />
      </Stack>
    </Flex>
  );
}
