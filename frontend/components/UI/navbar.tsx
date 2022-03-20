import {HStack, Button, Flex, useDisclosure} from "@chakra-ui/react";

import NextLink from 'next/link';
import Image from 'next/image';

import ConnectorModal from "./modalConnector";

export default function Navbar() {

  const connectM = useDisclosure();

  return (
    <>
        <HStack
          zIndex="tooltip"
          w="100vw"
          bg="transparent"
          px="1rem"
          justifyContent="space-between"
          alignItems="center"
          p="16px"
          h="56px"
        >
          <NextLink href="/" passHref>
            <Flex
              alignItems="center"
              cursor="pointer"
            >
              <Image
                alt="clouds crew logo"
                width="64px"
                height="64px"
                src="/assets/logo_fla.png"
              />
            </Flex>
          </NextLink>

            <Button
              onClick={() => connectM.onOpen()}
            >
              Connect Wallet
            </Button>
        </HStack>

      {connectM.isOpen && <ConnectorModal connectM={connectM} />}

    </>
  )
}
