import Web3EthContract from "web3-eth-contract";

export const getPresale = async () => {

  const abiResponse = await fetch("/config/abi.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const abi = await abiResponse.json();
  const configResponse = await fetch("/config/config.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const CONFIG = await configResponse.json();

const { ethereum } = window;

  Web3EthContract.setProvider(ethereum);
  const contract = new Web3EthContract(
    abi,
    CONFIG.CONTRACT_ADDRESS
  );

  async function getPresaleStatus() {
    try{
    const resp = await contract.methods.isPresaleActive().call();
    return resp;
    }catch(err){
      console.log(err)
    }
  }
  var val =  getPresaleStatus();
  return val
}