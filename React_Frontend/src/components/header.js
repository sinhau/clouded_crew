import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  connect,
  updatecurrentTokenID,
} from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import { handler } from "../api/index";
import Web3 from "web3";
import { FaTwitter, FaDiscord, FaInstagram } from "react-icons/fa";
import Open from "../assets/open.png";
import { getPresale } from "./getPresaleStatus";
import { getPause } from "./getPauseStatus";
const InputDataDecoder = require("ethereum-input-data-decoder");
const contract_abi = require("./abi.json");

export default function Header({ myRef }) {
  const decoder = new InputDataDecoder(contract_abi);
  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    PRE_WEI_COST: 0,
    PRE_DISPLAY_COST: 0,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimFreeNFTs = () => {
    let cost = CONFIG.PRE_WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mintFree(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        try {
          var lines = err?.message.split("\n");
          const tx = lines[12].slice(22, 88);
          getRevertReason(tx);
          setClaimingNft(false);
        } catch (err) {
          console.log(err);
          setFeedback("The transaction has been cancelled!");
          setClaimingNft(false);
        }
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mintRegular(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        try {
          var lines = err?.message.split("\n");
          const tx = lines[12].slice(22, 88);
          getRevertReason(tx);
          setClaimingNft(false);
        } catch (err) {
          console.log(err);
          setFeedback("The transaction has been cancelled!");
          setClaimingNft(false);
        }
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const claimPreNFTs = async () => {
    let cost = CONFIG.PRE_WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    console.log("Merkle proof: ", proof);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    try {
      const receipt = await blockchain.smartContract.methods
        .mintPresale(proof, mintAmount)
        .send({
          gasLimit: String(totalGasLimit),
          to: CONFIG.CONTRACT_ADDRESS,
          from: blockchain.account,
          value: totalCostWei,
        });
      console.log("Successful: ", receipt);
      setFeedback(
        `WOW, the ${CONFIG.NFT_NAME} is yours! Visit Opensea.io to view it.`
      );
      setClaimingNft(false);
      dispatch(fetchData(blockchain.account));
    } catch (err) {
      console.log("Unsuccessful: ", err);
      const error = await getRevertReason(err.receipt.transactionHash);
      setFeedback("Error while minting: " + error.method);
      setClaimingNft(false);
      dispatch(fetchData(blockchain.account));
    }
    // try {
    //   blockchain.smartContract.methods
    //     .mintPresale(proof, mintAmount)
    //     .send({
    //       gasLimit: String(totalGasLimit),
    //       to: CONFIG.CONTRACT_ADDRESS,
    //       from: blockchain.account,
    //       value: totalCostWei,
    //     })
    //     .once("error", (err) => {
    //       try {
    //         var lines = err?.message.split("\n");
    //         const tx = lines[12].slice(22, 88);
    //         getRevertReason(tx);
    //         setClaimingNft(false);
    //       } catch (err) {
    //         console.log(err);
    //         setFeedback("The transaction has been cancelled!");
    //         setClaimingNft(false);
    //       }
    //     })
    //     .then((receipt) => {
    //       console.log(receipt);
    //       setFeedback(
    //         `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
    //       );
    //       setClaimingNft(false);
    //       dispatch(fetchData(blockchain.account));
    //     });
    // } catch (err) {
    //   console.log(err);
    //   getRevertReason(err.receipt.transactionHash);
    //   setClaimingNft(false);
    // }
  };

  const getRevertReason = async (txHash) => {
    const tx = await web3.eth.getTransaction(txHash);
    web3.eth.handleRevert = true;
    try {
      var err = await web3.eth.call(tx, tx.blockNumber);
      console.log("Tx error: ", err);
    } catch (e) {
      console.log("Revert error: ", e);
      var result = decoder.decodeData(e.data);
      if (result.method == null) {
        result.method = e.reason;
      }

      return result;
    }
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    const limit = preSale
      ? 3
      : data.currentTokenID <= CONFIG.MAX_FREE_SUPPLY
      ? 1
      : 6;
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > limit) {
      newMintAmount = limit;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  useEffect(async () => {
    await updatecurrentTokenID(dispatch);
  }, [CONFIG.CONTRACT_ADDRESS]);

  const [proof, setProof] = useState(null);

  useEffect(() => {
    handler({ event: blockchain.account, setVal: setProof });
  }, [blockchain.account]);

  const [pause, setPause] = useState();

  useEffect(() => {
    getPause().then((val) => setPause(val));
  }, []);

  const [preSale, setPreSale] = useState();

  useEffect(() => {
    getPresale().then((val) => setPreSale(val));
  }, []);

  return (
    <>
      <div className={"NavCon"}>
        <div className={"NavBar"}>
          <div className="Logo" />
          <div className={"FlexContainer"} />
          <div className="SocCon">
            <FaInstagram
              size={25}
              color={"#fff"}
              style={{ cursor: "pointer" }}
              onClick={() => window.open("https://instagram.com/")}
            />
            <FaTwitter
              size={25}
              color={"#fff"}
              style={{ cursor: "pointer" }}
              onClick={() => window.open("https://twitter.com/")}
            />
            <FaDiscord
              size={30}
              color={"#fff"}
              style={{ cursor: "pointer" }}
              onClick={() => window.open("https://discord.gg/")}
            />
            <img
              style={{ height: 25, width: 25, cursor: "pointer" }}
              src={Open}
              onClick={() => window.open("https://opensea.io/")}
            />
          </div>
          {blockchain.account ? (
            <button>
              {blockchain.account?.substring(0, 6)}
              ...
              {blockchain.account?.substring(38, 42)}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch(connect());
                getData();
              }}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
      {pause ? (
        <div ref={myRef} className={"Header"}>
          <div className={"HeaderBg"}>
            <div className="HeadMint">
              <h1>The sale is temporarily paused!</h1>
            </div>
          </div>
        </div>
      ) : (
        <>
          {preSale ? (
            <div ref={myRef} className={"Header"}>
              <div className={"HeaderBg"}>
                <div className="HeadMint">
                  <h1>
                    {data.currentTokenID} / {CONFIG.MAX_SUPPLY}
                  </h1>
                  <h1 onClick={() => console.log(blockchain)}>
                    Mint up to 3 NFTs for free if you are on the whitelist.
                    {/* First {CONFIG.MAX_FREE_SUPPLY} NFTs cost{" "}
                    {data.currentTokenID <= CONFIG.MAX_FREE_SUPPLY
                      ? "0 ETH"
                      : CONFIG.PRE_DISPLAY_COST + CONFIG.NETWORK.SYMBOL} */}
                  </h1>
                  <h3>
                    {blockchain.account != null && proof == null
                      ? "Minting address is not on whitelist"
                      : null}
                  </h3>
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ||
                  proof == null ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        Connect Wallet
                      </button>
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <h3>{blockchain.errorMsg}</h3>
                        </>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <h3>{feedback}</h3>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 20,
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount();
                          }}
                        >
                          -
                        </button>
                        <h1
                          style={{
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 15,
                          }}
                        >
                          {mintAmount}
                        </h1>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount();
                          }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className={"MintBtn1"}
                        onClick={(e) => {
                          e.preventDefault();
                          claimPreNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "MINTING" : "MINT"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div ref={myRef} className={"Header"}>
              <div className={"HeaderBg"}>
                <div className="HeadMint">
                  <h1>
                    {data.currentTokenID} / {CONFIG.MAX_SUPPLY}
                  </h1>
                  <h1>
                    {data.currentTokenID <= CONFIG.MAX_FREE_SUPPLY
                      ? `First ${CONFIG.MAX_FREE_SUPPLY} NFTs cost`
                      : `Last ${
                          CONFIG.MAX_SUPPLY - CONFIG.MAX_FREE_SUPPLY
                        } NFTs cost`}{" "}
                    {data.currentTokenID <= CONFIG.MAX_FREE_SUPPLY
                      ? "0 ETH"
                      : CONFIG.DISPLAY_COST + CONFIG.NETWORK.SYMBOL}
                  </h1>
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        Connect Wallet
                      </button>
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <h3>{blockchain.errorMsg}</h3>
                        </>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <h3>{feedback}</h3>
                      {data.currentTokenID <= CONFIG.MAX_FREE_SUPPLY ? null : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 20,
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              decrementMintAmount();
                            }}
                          >
                            -
                          </button>
                          <h1
                            style={{
                              marginLeft: 20,
                              marginRight: 20,
                              marginTop: 15,
                            }}
                          >
                            {mintAmount}
                          </h1>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              incrementMintAmount();
                            }}
                          >
                            +
                          </button>
                        </div>
                      )}
                      <button
                        className={"MintBtn1"}
                        onClick={(e) => {
                          e.preventDefault();
                          data.currentTokenID <= CONFIG.MAX_FREE_SUPPLY
                            ? claimFreeNFTs()
                            : claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "MINTING" : "MINT"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
