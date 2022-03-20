import {
  Grid,
  Stack,
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay
} from "@chakra-ui/react";

import {
  useWeb3,
  useConnectorCoinbase,
  useConnectorMetamask,
  useConnectorTrust,
  useConnectorWalletConnect,
  useDisconnect
} from "@lido-sdk/web3-react";

export default function ConnectorModal({ connectM }: any) {
  const { account, connector } = useWeb3();

  const coinbase = useConnectorCoinbase();
  const metamask = useConnectorMetamask();
  const walletconnect = useConnectorWalletConnect();
  const { disconnect }: any = useDisconnect();

  // if (account && connectM.isOpen) {
  //   connectM.onClose();
  // }

  return (
    <Modal isOpen={connectM.isOpen} onClose={connectM.onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="white">
        <ModalHeader></ModalHeader>
        <ModalCloseButton _focus={{ boxShadow: "none" }} />
        <ModalBody py="1rem">
          <Grid gap="0.5rem">
            {connector && account ? (
              <Stack>
                <Button
                  width="100%"
                  onClick={() => {
                    disconnect();
                    connectM.onClose();
                  }}
                >
                  Disconnect
                </Button>
              </Stack>
            ) : (
              <>
                <Button
                  onClick={() => {
                    if (window.ethereum) {
                      metamask.connect();
                      connectM.onClose();
                    }
                  }}
                >
                  Metamask
                </Button>
                <Button
                  onClick={() => {
                    walletconnect.connect();
                    connectM.onClose();
                  }}
                >
                  WalletConnect
                </Button>
                <Button
                  onClick={() => {
                    coinbase.connect();
                    connectM.onClose();
                  }}
                >
                  Coinbase
                </Button>
              </>
            )}
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
