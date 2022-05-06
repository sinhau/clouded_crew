const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
require("dotenv").config();

describe("CloudedCrew", function () {
  before(async function () {
    this.accounts = await ethers.getSigners();
    this.owner = this.accounts[0];

    this.proxyRegistryAddressOpensea =
      "0x1E525EEAF261cA41b809884CBDE9DD9E1619573A";

    this.baseMetadataURI =
      "https://gateway.pinata.cloud/ipfs/QmVrLmQgrowmbMf1M9YseiQG6HN1ZHWwhaoui81V6wzahS/";

    this.whitelist = [];
    // Loop through this.accounts and add them to this.whitelist
    for (let i = 1; i < this.accounts.length; i++) {
      this.whitelist.push(this.accounts[i].address);
    }

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
      this.baseMetadataURI,
      this.proxyRegistryAddressOpensea
    );
  });

  describe("Deployment", function () {
    it("Contract owner should match hardhat owner address", async function () {
      expect(await this.contract.owner()).to.equal(this.owner.address);
    });
  });

  describe("Minting", function () {
    it("Should not be able to mint presale NFT if presale or sale is not active", async function () {
      await this.contract.updatePresaleStatus(false);
      await expect(
        this.contract.mintPresale(
          this.merkleTree.getHexProof(keccak256(this.owner.address)),
          1
        )
      ).to.be.revertedWith("PresaleNotActive()");

      await this.contract.updatePresaleStatus(true);
      await this.contract.updateSalePausedStatus(true);
      await expect(
        this.contract.mintPresale(
          this.merkleTree.getProof(keccak256(this.owner.address)),
          1
        )
      ).to.be.revertedWith("SalePaused()");
    });

    it("Should not be able to mint if address is not whitelisted", async function () {
      await expect(
        this.contract
          .connect(this.accounts[0])
          .mintPresale(
            this.merkleTree.getHexProof(keccak256(this.accounts[0].address)),
            1
          )
      ).to.be.revertedWith("NotOnWhitelist()");

      expect(
        await this.contract.balanceOf(this.accounts[1].address, 34)
      ).to.equal(0);
      await this.contract
        .connect(this.accounts[1])
        .mintPresale(
          this.merkleTree.getHexProof(keccak256(this.accounts[1].address)),
          1
        );
      expect(
        await this.contract.balanceOf(this.accounts[1].address, 34)
      ).to.equal(1);
    });

    it("Should not be able to mint more than 3 per whitelisted wallet", async function () {
      expect(
        await this.contract.balanceOf(this.accounts[2].address, 34)
      ).to.equal(0);
      await this.contract
        .connect(this.accounts[2])
        .mintPresale(
          this.merkleTree.getHexProof(keccak256(this.accounts[2].address)),
          2
        );
      await expect(
        this.contract
          .connect(this.accounts[2])
          .mintPresale(
            this.merkleTree.getHexProof(keccak256(this.accounts[2].address)),
            2
          )
      ).to.be.revertedWith("InvalidPresaleAmount()");
      await this.contract
        .connect(this.accounts[2])
        .mintPresale(
          this.merkleTree.getHexProof(keccak256(this.accounts[2].address)),
          1
        );
      expect(
        await this.contract.balanceOf(this.accounts[2].address, 34)
      ).to.equal(1);
      expect(
        await this.contract.balanceOf(this.accounts[2].address, 35)
      ).to.equal(1);
      await expect(
        this.contract
          .connect(this.accounts[2])
          .mintPresale(
            this.merkleTree.getHexProof(keccak256(this.accounts[2].address)),
            1
          )
      ).to.be.revertedWith("InvalidPresaleAmount()");
      await expect(
        this.contract
          .connect(this.accounts[2])
          .mintPresale(
            this.merkleTree.getHexProof(keccak256(this.accounts[2].address)),
            2
          )
      ).to.be.revertedWith("InvalidPresaleAmount()");

      await expect(
        this.contract
          .connect(this.accounts[3])
          .mintPresale(
            this.merkleTree.getHexProof(keccak256(this.accounts[3].address)),
            4
          )
      ).to.be.revertedWith("InvalidPresaleAmount()");
    });

    it("Should not be able to mint regular NFTs if presale is active or sale is paused", async function () {
      await expect(this.contract.mintRegular()).to.be.revertedWith(
        "PresaleIsActive()"
      );

      await this.contract.updatePresaleStatus(false);
      await this.contract.updateSalePausedStatus(true);
      await expect(this.contract.mintRegular()).to.be.revertedWith(
        "SalePaused()"
      );
    });

    it("Should only be able to mint max 3 per wallet during regular sale", async function () {
      await this.contract.updatePresaleStatus(false);

      expect(
        await this.contract.generalSaleMintCount(this.accounts[0].address)
      ).to.equal(0);
      for (let i = 0; i < 3; i++) {
        await this.contract.connect(this.accounts[0]).mintRegular();
      }
      expect(
        await this.contract.generalSaleMintCount(this.accounts[0].address)
      ).to.equal(3);

      await expect(
        this.contract.connect(this.accounts[0]).mintRegular()
      ).to.be.revertedWith("ReachedMintLimitPerWallet()");

      expect(
        await this.contract.generalSaleMintCount(this.accounts[1].address)
      ).to.equal(0);
      await expect(
        this.contract.connect(this.accounts[1]).mintRegular()
      ).to.be.revertedWith("InsufficientETH()");
      for (let i = 0; i < 3; i++) {
        await this.contract
          .connect(this.accounts[1])
          .mintRegular({ value: ethers.utils.parseEther("0.0333") });
      }
      expect(
        await this.contract.generalSaleMintCount(this.accounts[1].address)
      ).to.equal(3);
      await expect(
        this.contract.connect(this.accounts[1]).mintRegular()
      ).to.be.revertedWith("ReachedMintLimitPerWallet()");
    });

    it("Should successfully update base metadata URI only when updated by owner", async function () {
      await expect(
        this.contract.connect(this.accounts[1]).setBaseMetadataURI("test/")
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await this.contract.setBaseMetadataURI("test/");
      validURI = "test/1.json";
      expect(await this.contract.uri(1)).to.equal(validURI);
    });

    it("Should provide valid NFT metadata URI for minted NFTs only", async function () {
      await this.contract.updatePresaleStatus(false);

      await expect(this.contract.uri(34)).to.be.revertedWith(
        "InvalidTokenID()"
      );

      await this.contract.mintRegular({
        value: ethers.utils.parseEther("0.0333"),
      });
      validNFTURI = this.baseMetadataURI + "1.json";
      expect(await this.contract.uri(1)).to.equal(validNFTURI);
    });
    it("Update whitelist merkle tree root", async function () {
      this.whitelist.push(this.accounts[1].address);
      const leafNodes = this.whitelist.map((address) => keccak256(address));
      const merkleTree = new MerkleTree(leafNodes, keccak256, {
        sortPairs: true,
      });
      await this.contract.updateWhitelistMerkleTreeRoot(
        merkleTree.getHexRoot()
      );
      expect(await this.contract.whitelist_merkle_tree_root()).to.equal(
        merkleTree.getHexRoot()
      );
    });
    it("Should update whitelist merkle tree", async function () {
      let whitelist = [];
      // Loop through this.accounts and add them to this.whitelist
      for (let i = 2; i < this.accounts.length; i++) {
        whitelist.push(this.accounts[i].address);
      }

      let leafNodes = whitelist.map((address) => keccak256(address));
      let merkleTree = new MerkleTree(leafNodes, keccak256, {
        sortPairs: true,
      });
      await expect(
        this.contract
          .connect(this.accounts[1])
          .updateWhitelistMerkleTreeRoot(merkleTree.getHexRoot())
      ).to.be.revertedWith("Ownable: caller is not the owner");
      this.contract.updateWhitelistMerkleTreeRoot(merkleTree.getHexRoot());

      await expect(
        this.contract
          .connect(this.accounts[1])
          .mintPresale(
            merkleTree.getHexProof(keccak256(this.accounts[1].address)),
            1
          )
      ).to.be.revertedWith("NotOnWhitelist()");

      expect(
        await this.contract.balanceOf(this.accounts[2].address, 34)
      ).to.equal(0);
      await this.contract
        .connect(this.accounts[2])
        .mintPresale(
          merkleTree.getHexProof(keccak256(this.accounts[2].address)),
          1
        );
      expect(
        await this.contract.balanceOf(this.accounts[2].address, 34)
      ).to.equal(1);
    });
    it("Update minting fee", async function () {
      expect(await this.contract.minting_fee()).to.equal(
        ethers.utils.parseEther("0.0333")
      );
      await this.contract.updateMintingFee(ethers.utils.parseEther("0.06"));
      expect(await this.contract.minting_fee()).to.equal(
        ethers.utils.parseEther("0.06")
      );

      await this.contract.updatePresaleStatus(false);
      await this.contract.mintRegular();
      await this.contract.mintRegular();
      await this.contract.mintRegular();

      expect(
        await this.contract.balanceOf(this.accounts[1].address, 37)
      ).to.equal(0);
      await expect(
        this.contract.connect(this.accounts[1]).mintRegular({
          value: ethers.utils.parseEther("0.05"),
        })
      ).to.be.revertedWith("InsufficientETH()");
      await this.contract.connect(this.accounts[1]).mintRegular({
        value: ethers.utils.parseEther("0.06"),
      });
      expect(
        await this.contract.balanceOf(this.accounts[1].address, 37)
      ).to.equal(1);
    });
  });
});
