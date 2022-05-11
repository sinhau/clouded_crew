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
    for (let i = 5; i < this.accounts.length; i++) {
      this.whitelist.push(this.accounts[i].address);
    }
    this.whitelist.push(this.owner.address);

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
    it("Should mint 33 NFTs to owner", async function () {
      expect(await this.contract.balanceOf(this.owner.address, 33)).to.equal(1);
    });
  });

  describe("Whitelist", function () {
    it("Should not mint if presale is inactive", async function () {
      await this.contract.updatePresaleStatus(false);
      await expect(
        this.contract.mintPresale(
          this.merkleTree.getHexProof(keccak256(this.owner.address)),
          1
        )
      ).to.be.revertedWith("PresaleNotActive()");

      await this.contract.updatePresaleStatus(true);
      await this.contract.mintPresale(
        this.merkleTree.getHexProof(keccak256(this.owner.address)),
        1
      );
      expect(await this.contract.balanceOf(this.owner.address, 34)).to.equal(1);
    });

    it("Should not mint if sale is paused", async function () {
      await this.contract.updateSalePausedStatus(true);
      await expect(
        this.contract.mintPresale(
          this.merkleTree.getHexProof(keccak256(this.owner.address)),
          1
        )
      ).to.be.revertedWith("SalePaused()");

      await this.contract.updateSalePausedStatus(false);
      await this.contract.mintPresale(
        this.merkleTree.getHexProof(keccak256(this.owner.address)),
        1
      );
      expect(await this.contract.balanceOf(this.owner.address, 34)).to.equal(1);
    });

    it("Should not mint if address is not on whitelist", async function () {
      await expect(
        this.contract
          .connect(this.accounts[1])
          .mintPresale(
            this.merkleTree.getHexProof(keccak256(this.accounts[1].address)),
            1
          )
      ).to.be.revertedWith("NotOnWhitelist()");

      await this.contract
        .connect(this.accounts[5])
        .mintPresale(
          this.merkleTree.getHexProof(keccak256(this.accounts[5].address)),
          1
        );
      expect(
        await this.contract.balanceOf(this.accounts[5].address, 34)
      ).to.equal(1);
    });

    it("Should not be able to mint more than 3 per wallet", async function () {
      // Should not be able to mint 4 or more in one txn
      await expect(
        this.contract
          .connect(this.accounts[5])
          .mintPresale(
            this.merkleTree.getHexProof(keccak256(this.accounts[5].address)),
            4
          )
      ).to.be.revertedWith("InvalidPresaleAmount()");

      // Checking if wallet count increment is working properly
      // Should be able to mint 2
      await this.contract
        .connect(this.accounts[6])
        .mintPresale(
          this.merkleTree.getHexProof(keccak256(this.accounts[6].address)),
          2
        );
      expect(
        await this.contract.balanceOf(this.accounts[6].address, 34)
      ).to.equal(1);
      expect(
        await this.contract.balanceOf(this.accounts[6].address, 35)
      ).to.equal(1);
      // Should not be able to mint more than one
      await expect(
        this.contract
          .connect(this.accounts[6])
          .mintPresale(
            this.merkleTree.getHexProof(keccak256(this.accounts[6].address)),
            2
          )
      ).to.be.revertedWith("InvalidPresaleAmount()");
      await this.contract
        .connect(this.accounts[6])
        .mintPresale(
          this.merkleTree.getHexProof(keccak256(this.accounts[6].address)),
          1
        );
      expect(
        await this.contract.balanceOf(this.accounts[6].address, 36)
      ).to.equal(1);
    });
  });

  describe("Free Mints", function () {
    it("Should not mint if presale is active", async function () {
      await expect(this.contract.mintFree(1)).to.be.revertedWith(
        "PresaleIsActive()"
      );

      await this.contract.updatePresaleStatus(false);
      await this.contract.mintFree(1);
      expect(await this.contract.balanceOf(this.owner.address, 34)).to.equal(1);
    });

    it("Should not mint if sale is paused", async function () {
      await this.contract.updatePresaleStatus(false);

      await this.contract.updateSalePausedStatus(true);
      await expect(this.contract.mintFree(1)).to.be.revertedWith(
        "SalePaused()"
      );

      await this.contract.updateSalePausedStatus(false);
      await this.contract.mintFree(1);
      expect(await this.contract.balanceOf(this.owner.address, 34)).to.equal(1);
    });

    it("Should not be able to mint more than 6 per wallet", async function () {
      await this.contract.updatePresaleStatus(false);

      // Should not be able to mint 7 or more in one txn
      await expect(this.contract.mintFree(7)).to.be.revertedWith(
        "InvalidQuantity()"
      );

      // Checking if wallet count increment is working properly
      // Should be able to mint 5
      await this.contract.mintFree(5);
      expect(await this.contract.balanceOf(this.owner.address, 38)).to.equal(1);
      // Should not be able to mint more than one
      await expect(this.contract.mintFree(2)).to.be.revertedWith(
        "InvalidQuantity()"
      );
      await this.contract.mintFree(1);
      expect(await this.contract.balanceOf(this.owner.address, 39)).to.equal(1);
    });

    it("Should not be able to mint more than MAX_FREE_SUPPLY", async function () {
      await this.contract.updatePresaleStatus(false);

      // Minting just to get token ID to 39
      await this.contract.mintFree(6);
      expect(await this.contract.balanceOf(this.owner.address, 39)).to.equal(1);

      // Should not be able to mint more than MAX_FREE_SUPPLY
      await expect(
        this.contract.connect(this.accounts[1]).mintFree(2)
      ).to.be.revertedWith("InvalidQuantity()");
      await this.contract.connect(this.accounts[1]).mintFree(1);
      expect(
        await this.contract.balanceOf(this.accounts[1].address, 40)
      ).to.equal(1);

      // Expect all txn to fail since token ID is above MAX_FREE_SUPPLY
      await expect(
        this.contract.connect(this.accounts[1]).mintFree(1)
      ).to.be.revertedWith("InvalidQuantity()");
      await expect(
        this.contract.connect(this.accounts[2]).mintFree(1)
      ).to.be.revertedWith("InvalidQuantity()");
    });
  });

  describe("Regular Mints", function () {
    it("Should not mint if presale is active", async function () {
      await expect(this.contract.mintRegular(1)).to.be.revertedWith(
        "PresaleIsActive()"
      );

      // Disable presale
      await this.contract.updatePresaleStatus(false);

      // Mint free to get token ID to paid number
      await this.contract.mintFree(6);
      await this.contract.connect(this.accounts[1]).mintFree(1);

      // Regular mint should go through now
      await this.contract.mintRegular(1, {
        value: ethers.utils.parseEther("0.0333"),
      });
      expect(await this.contract.balanceOf(this.owner.address, 41)).to.equal(1);
    });

    it("Should not mint if sale is paused", async function () {
      await this.contract.updatePresaleStatus(false);

      // Mint free to get token ID to paid number
      await this.contract.mintFree(6);
      await this.contract.connect(this.accounts[1]).mintFree(1);

      // Pause sale
      await this.contract.updateSalePausedStatus(true);

      // Regular mint should fail
      await expect(
        this.contract.mintRegular(1, {
          value: ethers.utils.parseEther("0.0333"),
        })
      ).to.be.revertedWith("SalePaused()");

      // Unpause sale
      await this.contract.updateSalePausedStatus(false);

      // Regular mint should go through now
      await this.contract.mintRegular(1, {
        value: ethers.utils.parseEther("0.0333"),
      });
      expect(await this.contract.balanceOf(this.owner.address, 41)).to.equal(1);
    });

    it("Should not mint if free supply is still available", async function () {
      await this.contract.updatePresaleStatus(false);

      await expect(
        this.contract.mintRegular(1, {
          value: ethers.utils.parseEther("0.0333"),
        })
      ).to.be.revertedWith("FreeSupplyStillAvailable()");

      await this.contract.mintFree(6);
      await expect(
        this.contract.mintRegular(1, {
          value: ethers.utils.parseEther("0.0333"),
        })
      ).to.be.revertedWith("FreeSupplyStillAvailable()");

      await this.contract.connect(this.accounts[1]).mintFree(1);
      await this.contract.mintRegular(2, {
        value: ethers.utils.parseEther("0.0666"),
      });
      expect(await this.contract.balanceOf(this.owner.address, 42)).to.equal(1);
    });

    it("Should not be able to mint more than max supply", async function () {
      await this.contract.updatePresaleStatus(false);

      // Mint free to get token ID to paid number
      await this.contract.mintFree(6);
      await this.contract.connect(this.accounts[1]).mintFree(1);

      // Mint up to max supply
      await this.contract.mintRegular(6, {
        value: ethers.utils.parseEther("0.1998"),
      });
      expect(await this.contract.balanceOf(this.owner.address, 46)).to.equal(1);
      await this.contract.connect(this.accounts[1]).mintRegular(6, {
        value: ethers.utils.parseEther("0.1998"),
      });
      expect(
        await this.contract.balanceOf(this.accounts[1].address, 52)
      ).to.equal(1);
      await this.contract.connect(this.accounts[2]).mintRegular(6, {
        value: ethers.utils.parseEther("0.1998"),
      });
      expect(
        await this.contract.balanceOf(this.accounts[2].address, 58)
      ).to.equal(1);

      await expect(
        this.contract.connect(this.accounts[3]).mintRegular(6, {
          value: ethers.utils.parseEther("0.1998"),
        })
      ).to.be.revertedWith("InvalidQuantity()");

      await this.contract.connect(this.accounts[3]).mintRegular(2, {
        value: ethers.utils.parseEther("0.0666"),
      });
      expect(
        await this.contract.balanceOf(this.accounts[3].address, 60)
      ).to.equal(1);

      await expect(
        this.contract.connect(this.accounts[4]).mintRegular(1, {
          value: ethers.utils.parseEther("0.0333"),
        })
      ).to.be.revertedWith("InvalidQuantity()");
    });

    it("Should not be able to mint more than 6 per wallet", async function () {
      await this.contract.updatePresaleStatus(false);

      // Mint free to get token ID to paid number
      await this.contract.mintFree(6);
      await this.contract.connect(this.accounts[1]).mintFree(1);

      // Should not be able to mint more than 6 at a time
      await expect(
        this.contract.mintRegular(7, {
          value: ethers.utils.parseEther("0.2331"),
        })
      ).to.be.revertedWith("InvalidGeneralSaleQuantity()");

      await this.contract.mintRegular(5, {
        value: ethers.utils.parseEther("0.1665"),
      });
      expect(await this.contract.balanceOf(this.owner.address, 45)).to.equal(1);
      await expect(
        this.contract.mintRegular(2, {
          value: ethers.utils.parseEther("0.0666"),
        })
      ).to.be.revertedWith("InvalidGeneralSaleQuantity()");
      await this.contract.mintRegular(1, {
        value: ethers.utils.parseEther("0.0333"),
      });
      expect(await this.contract.balanceOf(this.owner.address, 46)).to.equal(1);
    });

    it("Should not be able to mint if not enough ETH provided", async function () {
      await this.contract.updatePresaleStatus(false);

      // Mint free to get token ID to paid number
      await this.contract.mintFree(6);
      await this.contract.connect(this.accounts[1]).mintFree(1);

      // Should not be able to mint if not enough ETH provided
      await expect(
        this.contract.mintRegular(1, {
          value: ethers.utils.parseEther("0.033"),
        })
      ).to.be.revertedWith("InsufficientETH()");
      await expect(
        this.contract.mintRegular(2, {
          value: ethers.utils.parseEther("0.066"),
        })
      ).to.be.revertedWith("InsufficientETH()");
    });
  });

  describe("Other methods", function () {
    it("Should update presale status as owner only", async function () {
      await expect(
        this.contract.connect(this.accounts[1]).updatePresaleStatus(false)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await this.contract.updatePresaleStatus(false);
      expect(await this.contract.isPresaleActive()).to.equal(false);
    });

    it("Should update sale paused status as owner only", async function () {
      await expect(
        this.contract.connect(this.accounts[1]).updateSalePausedStatus(false)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await this.contract.updateSalePausedStatus(false);
      expect(await this.contract.isSalePaused()).to.equal(false);
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

      validNFTURI = this.baseMetadataURI + "1.json";
      expect(await this.contract.uri(1)).to.equal(validNFTURI);
    });

    it("Should update merkle tree as owner only", async function () {
      this.whitelist.push(this.accounts[1].address);
      const leafNodes = this.whitelist.map((address) => keccak256(address));
      const merkleTree = new MerkleTree(leafNodes, keccak256, {
        sortPairs: true,
      });

      await expect(
        this.contract
          .connect(this.accounts[1])
          .updateWhitelistMerkleTreeRoot(merkleTree.getRoot())
      ).to.be.revertedWith("Ownable: caller is not the owner");
      await this.contract.updateWhitelistMerkleTreeRoot(
        merkleTree.getHexRoot()
      );
      expect(await this.contract.whitelist_merkle_tree_root()).to.equal(
        merkleTree.getHexRoot()
      );
    });

    it("Should mint presale for newly added whitelist address", async function () {
      await expect(
        this.contract
          .connect(this.accounts[1])
          .mintPresale(
            this.merkleTree.getHexProof(keccak256(this.accounts[1].address)),
            1
          )
      ).to.be.revertedWith("NotOnWhitelist()");

      this.whitelist.push(this.accounts[1].address);
      const leafNodes = this.whitelist.map((address) => keccak256(address));
      const merkleTree = new MerkleTree(leafNodes, keccak256, {
        sortPairs: true,
      });

      await this.contract.updateWhitelistMerkleTreeRoot(
        merkleTree.getHexRoot()
      );

      await this.contract
        .connect(this.accounts[1])
        .mintPresale(
          merkleTree.getHexProof(keccak256(this.accounts[1].address)),
          1
        );
      expect(
        await this.contract.balanceOf(this.accounts[1].address, 34)
      ).to.equal(1);
    });

    it("Should update minting fee as owner only", async function () {
      // Update minting fee as owner only
      expect(await this.contract.minting_fee()).to.equal(
        ethers.utils.parseEther("0.0333")
      );
      await expect(
        this.contract
          .connect(this.accounts[1])
          .updateMintingFee(ethers.utils.parseEther("0.06"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
      await this.contract.updateMintingFee(ethers.utils.parseEther("0.06"));
      expect(await this.contract.minting_fee()).to.equal(
        ethers.utils.parseEther("0.06")
      );

      await this.contract.updatePresaleStatus(false);

      // Mint free to get token ID to paid number
      await this.contract.mintFree(6);
      await this.contract.connect(this.accounts[1]).mintFree(1);

      // Mint regular with updated fee
      await expect(
        this.contract.mintRegular(1, {
          value: ethers.utils.parseEther("0.0333"),
        })
      ).to.be.revertedWith("InsufficientETH()");
      await this.contract.mintRegular(1, {
        value: ethers.utils.parseEther("0.06"),
      });
      expect(await this.contract.balanceOf(this.owner.address, 41)).to.equal(1);
    });
  });
});
