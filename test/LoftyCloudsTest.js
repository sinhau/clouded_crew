const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LoftyClouds", function () {
  before(async function () {
    this.accounts = await ethers.getSigners();
    this.owner = this.accounts[0];
    this.baseMetadataURI =
      "https://gateway.pinata.cloud/ipfs/Qmaxqbo2ZDBRYv7Ukw7L9B7dq2vUQqB1ysH6x5CLcDAVPa/";
  });

  beforeEach(async function () {
    const contractFactory = await ethers.getContractFactory("LoftyClouds");
    this.contract = await contractFactory.deploy();
  });

  describe("Deployment", function () {
    it("Contract owner should match hardhat owner address", async function () {
      expect(await this.contract.owner()).to.equal(this.owner.address);
    });

    it("Contract metadata URI is valid", async function () {
      validContractURI = this.baseMetadataURI + "contractMetadata.json";
      expect(await this.contract.contractURI()).to.equal(validContractURI);
    });
  });

  describe("Minting", function () {
    it("Should be able to mint 1 NFT", async function () {
      await this.contract.batchMint(this.owner.address, 1, {
        value: ethers.utils.parseEther("0.03"),
      });
      expect(await this.contract.balanceOf(this.owner.address, 1)).to.equal(1);
      expect(await this.contract.balanceOf(this.owner.address, 2)).to.equal(0);
    });

    it("Should not be able to mint more than 3 NFTs in single transaction", async function () {
      await expect(
        this.contract.batchMint(this.owner.address, 4, {
          value: ethers.utils.parseEther("0.12"),
        })
      ).to.be.revertedWith("Too many NFTs being minted");
    });

    it("Should not be able to mint more than 3333 NFTs", async function () {
      for (let i = 0; i < 1111; i++) {
        await this.contract.batchMint(this.owner.address, 3, {
          value: ethers.utils.parseEther("0.09"),
        });
      }
      await expect(
        this.contract.batchMint(this.owner.address, 3, {
          value: ethers.utils.parseEther("0.09"),
        })
      ).to.be.revertedWith("Not enought NFT supply left to mint");
      await expect(
        this.contract.batchMint(this.owner.address, 2, {
          value: ethers.utils.parseEther("0.06"),
        })
      ).to.be.revertedWith("Not enought NFT supply left to mint");
      await expect(
        this.contract.batchMint(this.owner.address, 1, {
          value: ethers.utils.parseEther("0.03"),
        })
      ).to.be.revertedWith("Not enought NFT supply left to mint");
    });

    it("Should successfully update base metadata URI only when updated by owner", async function () {
      await expect(
        this.contract.connect(this.accounts[1]).setBaseMetadataURI("test/")
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await this.contract.setBaseMetadataURI("test/");
      validContractURI = "test/contractMetadata.json";
      expect(await this.contract.contractURI()).to.equal(validContractURI);
    });

    it("Should provide valid NFT metadata URI for minted NFTs only", async function () {
      await expect(this.contract.uri(1)).to.be.revertedWith(
        "Token ID hasn't been minted yet"
      );

      await this.contract.batchMint(this.owner.address, 1, {
        value: ethers.utils.parseEther("0.03"),
      });
      validNFTURI = this.baseMetadataURI + "1.json";
      expect(await this.contract.uri(1)).to.equal(validNFTURI);
    });
  });
});
