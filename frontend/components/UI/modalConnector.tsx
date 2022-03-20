import {Grid, Stack, Button, Modal, ModalContent, ModalBody, ModalHeader, ModalCloseButton, ModalOverlay} from "@chakra-ui/react";

import {useConnectorCoinbase,
useConnectorMetamask,
useConnectorTrust,
useConnectorWalletConnect} from "@lido-sdk/web3-react"

export default function ConnectorModal({connectM}: any) {

  const coinbase = useConnectorCoinbase();
  const metamask = useConnectorMetamask()
  const trustwallet = useConnectorTrust()
  const walletconnect = useConnectorWalletConnect()

  return (
    <Modal isOpen={connectM.isOpen} onClose={connectM.onClose} isCentered>
    <ModalOverlay />
    <ModalContent bg="white">
    <ModalHeader>
    </ModalHeader>
    <ModalCloseButton _focus={{ boxShadow: "none" }} />
    <ModalBody py="1rem">
    <Grid gap="0.5rem">
    <Button
    onClick={() => {
        if (window.ethereum) {
          metamask.connect();
        }
      }}    >
      Metamask
    </Button>
      <Button
        onClick={() => walletconnect.connect()}
      >
        WalletConnect
      </Button>
    </Grid>
    </ModalBody>
    </ModalContent>
    </Modal>
  )
}
