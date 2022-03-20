import {HStack, Button, Flex, useDisclosure} from "@chakra-ui/react";

import NextLink from 'next/link';
import Image from 'next/image';

import ConnectorModal from "./modalConnector";

import {useWeb3} from "@lido-sdk/web3-react";
import {trimAddress} from "../utils";

export default function Navbar() {
  const {account} = useWeb3();

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
              variant="primary"
              onClick={() => connectM.onOpen()}
            >
              {account ? trimAddress(account) : "Connect Wallet"}
            </Button>
        </HStack>

      {connectM.isOpen && <ConnectorModal connectM={connectM} />}

    </>
  )
}
