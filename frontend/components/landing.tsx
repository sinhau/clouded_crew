import { Flex, Stack, Button, Heading } from "@chakra-ui/react";

import Navbar from "./UI/navbar";
import FAQ from "./faq";

export default function Landing() {
  return (
    <Flex direction="column" minH="100vh" w="100%">
      <Stack
        minH="100vh"
        w="100%"
        bgImage="/assets/bannertweet.png"
        bgRepeat="repeat"
        bgSize="cover"
        alignItems="center"
      >
      <Navbar />

        <Heading variant="medium">How many?</Heading>
        <Button variant="primary" w="fit-content">
          Mint NFT
        </Button>
        <FAQ />
      </Stack>
    </Flex>
  );
}
