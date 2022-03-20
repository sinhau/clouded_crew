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
        bgSize="cover"
        alignItems="center"
      >

              <Heading
                variant="medium"
              >
                How many?
              </Heading>
              <Button
                variant="primary"
                w="fit-content"
              >
                Mint NFT
              </Button>
        <FAQ />

      </Stack>
    </Flex>
  );
}
