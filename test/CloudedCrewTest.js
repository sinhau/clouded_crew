const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
require("dotenv").config();

describe("CloudedCrew", function () {
  before(async function () {
    this.accounts = await ethers.getSigners();
    this.whitelist_account = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.getDefaultProvider());
    this.owner = this.accounts[0];
    this.baseMetadataURI =
      "https://gateway.pinata.cloud/ipfs/Qmaxqbo2ZDBRYv7Ukw7L9B7dq2vUQqB1ysH6x5CLcDAVPa/";

    this.whitelist = require("../whitelist.json");

    const leafNodes = this.whitelist.map((address) => keccak256(address));
    this.merkleTree = new MerkleTree(leafNodes, keccak256, {
      sortPairs: true,
    });
  });

  beforeEach(async function () {
    const contractFactory = await ethers.getContractFactory("CloudedCrew");
    this.contract = await contractFactory.deploy(
      this.merkleTree.getHexRoot(),
      this.owner.address,
      this.baseMetadataURI
    );
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
    it("Should not be able to mint presale NFT if presale or sale is not active", async function () {
      await this.contract.updatePresaleStatus(false);
      await expect(
        this.contract.mintPresale(
          this.merkleTree.getProof(keccak256(this.owner.address))
        )
      ).to.be.revertedWith("PresaleNotActive()");

      await this.contract.updatePresaleStatus(true);
      await this.contract.updateSalePausedStatus(true);
      await expect(
        this.contract.mintPresale(
          this.merkleTree.getProof(keccak256(this.owner.address))
        )
      ).to.be.revertedWith("SalePaused()");
    });

    it("Should not be able to mint if address is not whitelisted", async function () {
      await expect(
        this.contract
          .connect(this.accounts[1])
          .mintPresale(
            this.merkleTree.getHexProof(keccak256(this.accounts[1].address))
          )
      ).to.be.revertedWith("NotOnWhitelist()");

      expect(await this.contract.balanceOf(this.whitelist_account.address, 1)).to.equal(0);
      await this.contract.connect(this.whitelist_account).mintPresale(
        this.merkleTree.getHexProof(keccak256(this.whitelist_account.address))
      );
      expect(await this.contract.balanceOf(this.whitelist_account.address, 1)).to.equal(1);
    });

    it("Should not be able to mint more than 1 per whitelisted wallet", async function () {
      expect(await this.contract.balanceOf(this.owner.address, 1)).to.equal(0);
      await this.contract.mintPresale(
        this.merkleTree.getHexProof(keccak256(this.owner.address))
      );
      expect(await this.contract.balanceOf(this.owner.address, 1)).to.equal(1);
      await expect(
        this.contract.mintPresale(
          this.merkleTree.getHexProof(keccak256(this.owner.address))
        )
      ).to.be.revertedWith("AlreadyMintedPresaleNFT()");
    });

    it("Should not be able to mint regular NFTs if presale is active or sale is paused", async function () {
      await expect(this.contract.batchMint(1)).to.be.revertedWith(
        "PresaleIsActive()"
      );

      await this.contract.updatePresaleStatus(false);
      await this.contract.updateSalePausedStatus(true);
      await expect(this.contract.batchMint(1)).to.be.revertedWith(
        "SalePaused()"
      );
    });

    it("Should be able to mint up to only 3 regular NFTs at a time with the right payment being made", async function () {
      await this.contract.updatePresaleStatus(false);

      expect(await this.contract.balanceOf(this.owner.address, 1)).to.equal(0);
      await expect(
        this.contract.batchMint(1, {
          value: ethers.utils.parseEther("0.02"),
        })
      ).to.be.revertedWith("InsufficientETH()");
      await this.contract.batchMint(1, {
        value: ethers.utils.parseEther("0.03"),
      });
      expect(await this.contract.balanceOf(this.owner.address, 1)).to.equal(1);

      await expect(
        this.contract.batchMint(2, {
          value: ethers.utils.parseEther("0.02"),
        })
      ).to.be.revertedWith("InsufficientETH()");
      await this.contract.batchMint(2, {
        value: ethers.utils.parseEther("0.06"),
      });
      expect(await this.contract.balanceOf(this.owner.address, 2)).to.equal(1);
      expect(await this.contract.balanceOf(this.owner.address, 3)).to.equal(1);

      await expect(
        this.contract.batchMint(3, {
          value: ethers.utils.parseEther("0.02"),
        })
      ).to.be.revertedWith("InsufficientETH()");
      await this.contract.batchMint(3, {
        value: ethers.utils.parseEther("0.09"),
      });
      expect(await this.contract.balanceOf(this.owner.address, 4)).to.equal(1);
      expect(await this.contract.balanceOf(this.owner.address, 5)).to.equal(1);
      expect(await this.contract.balanceOf(this.owner.address, 6)).to.equal(1);

      await expect(this.contract.batchMint(7)).to.be.revertedWith(
        "InvalidQuantity()"
      );
    });

    it("Should not be able to mint more than 3333 NFTs", async function () {
      await this.contract.updatePresaleStatus(false);

      for (let i = 0; i < 1111; i++) {
        await this.contract.batchMint(3, {
          value: ethers.utils.parseEther("0.09"),
        });
      }
      await expect(
        this.contract.batchMint(3, {
          value: ethers.utils.parseEther("0.09"),
        })
      ).to.be.revertedWith("SoldOut()");
      await expect(
        this.contract.batchMint(2, {
          value: ethers.utils.parseEther("0.06"),
        })
      ).to.be.revertedWith("SoldOut()");
      await expect(
        this.contract.batchMint(1, {
          value: ethers.utils.parseEther("0.03"),
        })
      ).to.be.revertedWith("SoldOut()");
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
      await this.contract.updatePresaleStatus(false);

      await expect(this.contract.uri(1)).to.be.revertedWith("InvalidTokenID()");

      await this.contract.batchMint(1, {
        value: ethers.utils.parseEther("0.03"),
      });
      validNFTURI = this.baseMetadataURI + "1.json";
      expect(await this.contract.uri(1)).to.equal(validNFTURI);
    });
  });
});
