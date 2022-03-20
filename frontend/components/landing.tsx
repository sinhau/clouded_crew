import { Flex, Stack, Button, Heading } from "@chakra-ui/react";

import Navbar from "./UI/navbar";
import FAQ from "./faq";

export default function Landing() {
  return (
    <Flex direction="column" minH="100vh" w="100%">
      <Stack
        alignItems="center"
        justifyItems="center"
        bgImage="/assets/cloudedCrewBanner.png"
        bgRepeat="no-repeat"
        bgSize={{base: "100% 100%",lg: "cover"}}
        minH="50vh"
      >
        <Navbar />
      </Stack>

      <Stack
        minH="50vh"
        bgImage="/assets/bannertweet.png"
        bgRepeat="repeat"
        transform="rotate(180deg)"
        bgSize="cover"
        position="relative"
      >
        <Heading
          position="absolute"
          bottom="25%"
          left="50%"
          transform="rotate(180deg)"
          variant="medium"
        >
          How many?
        </Heading>
        <Button
          position="absolute"
          top="50%"
          left="50%"
          m="auto"
          transform="rotate(180deg)"
          variant="primary"
          w="fit-content"
        >
          Mint NFT
        </Button>
      </Stack>

      <FAQ />
    </Flex>
  );
}
