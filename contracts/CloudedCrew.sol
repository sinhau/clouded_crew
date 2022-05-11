// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract OwnableDelegateProxy {}

/**
Used to delegate ownership of a contract to another address, to save on unneeded transactions to approve contract use for users
 */
contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}

/////////////////////////////////
/// ERRORS
/////////////////////////////////

error PresaleNotActive();
error PresaleIsActive();
error SalePaused();
error InvalidPresaleAmount();
error NotOnWhitelist();
error InvalidQuantity();
error InsufficientETH();
error InvalidTokenID();
error InvalidGeneralSaleQuantity();
error FreeSupplyStillAvailable();

/// @title CloudedCrew
///@author Karsh Sinha <karsh@hey.com>
contract CloudedCrew is ERC1155, Ownable {
    /////////////////////////////////
    /// PUBLIC VARS
    /////////////////////////////////

    string public name;
    bool public isPresaleActive = true;
    bool public isSalePaused = false;
    mapping(address => uint256) public presaleMintCount;
    mapping(address => uint256) public freeSupplyMintCount;
    mapping(address => uint256) public generalSaleMintCount;
    uint256 public currentTokenID = 1;
    bytes32 public whitelist_merkle_tree_root;
    uint256 public minting_fee = 0.0333 ether;

    /////////////////////////////////
    /// CONSTANTS
    /////////////////////////////////

    string public constant METADATA_PROVENANCE_HASH =
        "0xf7be2e1dcabf611b83404e57c13cc31947115973d6716ba6a6f688a7209c4931";
    uint256 public constant MAX_NFT_SUPPLY = 60;
    uint256 public constant MAX_FREE_SUPPLY = 40;
    uint256 public constant MAX_PRESALE_MINT_COUNT = 3;
    uint256 public constant MAX_FREE_SUPPLY_MINT_COUNT = 6;
    uint256 public constant MAX_GENERAL_SALE_MINT_COUNT = 6;

    /////////////////////////////////
    /// PRIVATE VARS
    /////////////////////////////////

    address private _payout_wallet; //TODO: Create splits contract at 0xsplits.xyz before mainnet deployment
    address private immutable _PROXY_REGISTRY_ADDRESS;

    /////////////////////////////////
    /// MODIFIERS
    /////////////////////////////////

    modifier checkPresaleActive() {
        if (!isPresaleActive) {
            revert PresaleNotActive();
        }
        _;
    }

    modifier checkPresaleInactive() {
        if (isPresaleActive) {
            revert PresaleIsActive();
        }
        _;
    }

    modifier checkSaleStatus() {
        if (isSalePaused) {
            revert SalePaused();
        }
        _;
    }

    modifier checkPresaleMintCount(uint256 quantity) {
        if (presaleMintCount[msg.sender] + quantity > MAX_PRESALE_MINT_COUNT) {
            revert InvalidPresaleAmount();
        }
        _;
    }

    modifier verifyWhitelist(bytes32[] calldata proof) {
        if (
            !MerkleProof.verify(
                proof,
                whitelist_merkle_tree_root,
                keccak256(abi.encodePacked(msg.sender))
            )
        ) {
            revert NotOnWhitelist();
        }
        _;
    }

    modifier checkMaxSupply(uint256 quantity) {
        if (currentTokenID + quantity - 1 > MAX_NFT_SUPPLY) {
            revert InvalidQuantity();
        }
        _;
    }

    modifier checkFreeSupply(uint256 quantity) {
        if (currentTokenID + quantity - 1 > MAX_FREE_SUPPLY) {
            revert InvalidQuantity();
        }
        _;
    }

    modifier checkFreeSupplyMintCount(uint256 quantity) {
        if (
            freeSupplyMintCount[msg.sender] + quantity >
            MAX_FREE_SUPPLY_MINT_COUNT
        ) {
            revert InvalidQuantity();
        }
        _;
    }

    modifier checkGeneralSaleMintCount(uint256 quantity) {
        if (
            generalSaleMintCount[msg.sender] + quantity >
            MAX_GENERAL_SALE_MINT_COUNT
        ) {
            revert InvalidGeneralSaleQuantity();
        }
        _;
    }

    modifier checkTokenID(uint256 tokenID) {
        if (tokenID > currentTokenID - 1 || tokenID <= 0) {
            revert InvalidTokenID();
        }
        _;
    }

    modifier checkValue(uint256 quantity) {
        if (msg.value < quantity * minting_fee) {
            revert InsufficientETH();
        }
        _;
    }

    modifier checkFreeSupplyDone() {
        if (currentTokenID <= MAX_FREE_SUPPLY) {
            revert FreeSupplyStillAvailable();
        }
        _;
    }

    /////////////////////////////////
    /// CONSTRUCTOR
    /////////////////////////////////

    /// @notice Setting base metadata URI to unrevealed metadata during contract deployment. Once all NFTs have been minted, contract owner will update base metadata URI to point to the actual metadata.  To ensure that metadata for each NFT was set prior to contract deployment, we have stored the provenance hash of all metadata JSON files in the contract as METADATA_PROVENANCE_HASH.  This provenance hash was computed by hashing a list of hashes of JSON metadata object for each NFT in order from 1 to MAX_NFT_SUPPLY.  This was done in Python using the web3.solidityKeccak method
    constructor(
        bytes32 _whitelist_merkle_tree_root,
        address payout_wallet,
        string memory baseMetadataURI,
        address proxyRegistryAddressOpensea
    ) ERC1155(baseMetadataURI) {
        name = "Clouded Crew";
        whitelist_merkle_tree_root = _whitelist_merkle_tree_root;
        _payout_wallet = payout_wallet;
        _PROXY_REGISTRY_ADDRESS = proxyRegistryAddressOpensea;

        uint256[] memory _ids = new uint256[](33);
        uint256[] memory _numTokens = new uint256[](33);

        for (uint256 i = 0; i < 33; i++) {
            _ids[i] = currentTokenID + i;
            _numTokens[i] = 1;
        }
        currentTokenID = currentTokenID + 33;
        _mintBatch(msg.sender, _ids, _numTokens, "");
    }

    /////////////////////////////////
    /// EXTERNAL METHODS
    /////////////////////////////////

    /// @dev Function to mint presale NFTs
    /// @param proof Merkle proof provided by the client
    /// @param quantity Number of NFTs to mint
    function mintPresale(bytes32[] calldata proof, uint256 quantity)
        external
        checkPresaleActive
        checkSaleStatus
        verifyWhitelist(proof)
        checkPresaleMintCount(quantity)
    {
        uint256[] memory _ids = new uint256[](quantity);
        uint256[] memory _numTokens = new uint256[](quantity);

        for (uint256 i = 0; i < quantity; i++) {
            _ids[i] = currentTokenID + i;
            _numTokens[i] = 1;
        }
        currentTokenID = currentTokenID + quantity;
        presaleMintCount[msg.sender] += quantity;
        _mintBatch(msg.sender, _ids, _numTokens, "");
    }

    /// @dev Mint _quantity number of free NFTs
    /// @param quantity Number of NFTs to mint
    function mintFree(uint256 quantity)
        external
        checkPresaleInactive
        checkSaleStatus
        checkFreeSupplyMintCount(quantity)
        checkFreeSupply(quantity)
    {
        uint256[] memory _ids = new uint256[](quantity);
        uint256[] memory _numTokens = new uint256[](quantity);

        for (uint256 i = 0; i < quantity; i++) {
            _ids[i] = currentTokenID + i;
            _numTokens[i] = 1;
        }
        currentTokenID = currentTokenID + quantity;
        freeSupplyMintCount[msg.sender] += quantity;
        _mintBatch(msg.sender, _ids, _numTokens, "");
    }

    /// @dev Mint _quantity number of NFTs
    /// @param quantity Number of NFTs to mint
    function mintRegular(uint256 quantity)
        external
        payable
        checkPresaleInactive
        checkSaleStatus
        checkFreeSupplyDone
        checkMaxSupply(quantity)
        checkGeneralSaleMintCount(quantity)
        checkValue(quantity)
    {
        uint256[] memory _ids = new uint256[](quantity);
        uint256[] memory _numTokens = new uint256[](quantity);

        for (uint256 i = 0; i < quantity; i++) {
            _ids[i] = currentTokenID + i;
            _numTokens[i] = 1;
        }
        currentTokenID = currentTokenID + quantity;
        generalSaleMintCount[msg.sender] += quantity;
        _mintBatch(msg.sender, _ids, _numTokens, "");
    }

    /// @dev Function to start/pause the sale
    /// @param status Boolean to set sale to paused or unpaused
    function updateSalePausedStatus(bool status) external onlyOwner {
        isSalePaused = status;
    }

    /// @dev Update presale status
    /// @param status The new status of the presale
    function updatePresaleStatus(bool status) external onlyOwner {
        isPresaleActive = status;
    }

    /// @dev Withdraw full balance the splits contract
    function withdraw() external onlyOwner {
        payable(_payout_wallet).transfer(address(this).balance);
    }

    /// @dev Will update the base metadata URI of NFTs
    /// @param newBaseMetadataURI New base URL
    function setBaseMetadataURI(string calldata newBaseMetadataURI)
        external
        onlyOwner
    {
        _setURI(newBaseMetadataURI);
    }

    /// @dev Updates the payout wallet
    /// @param newPayoutWallet New payout wallet address
    function setPayoutWallet(address newPayoutWallet) external onlyOwner {
        _payout_wallet = newPayoutWallet;
    }

    /// @notice Update merkle tree root
    /// @param newMerkleTreeRoot New merkle tree root
    function updateWhitelistMerkleTreeRoot(bytes32 newMerkleTreeRoot)
        external
        onlyOwner
    {
        whitelist_merkle_tree_root = newMerkleTreeRoot;
    }

    /// @notice Update minting fee
    /// @param newMintingFee New minting fee
    function updateMintingFee(uint256 newMintingFee) external onlyOwner {
        minting_fee = newMintingFee;
    }

    /////////////////////////////////
    /// PUBLIC METHODS
    /////////////////////////////////

    bytes4 private constant INTERFACE_SIGNATURE_ERC165 = 0x01ffc9a7;
    bytes4 private constant INTERFACE_SIGNATURE_ERC1155 = 0xd9b67a26;

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        if (
            interfaceId == INTERFACE_SIGNATURE_ERC165 ||
            interfaceId == INTERFACE_SIGNATURE_ERC1155
        ) {
            return true;
        }
        return false;
    }

    /// @dev Generate NFT metadata URI for a given NFT token ID
    /// @param tokenID Token ID for the NFT
    function uri(uint256 tokenID)
        public
        view
        override
        checkTokenID(tokenID)
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    super.uri(tokenID),
                    Strings.toString(tokenID),
                    ".json"
                )
            );
    }

    /// @dev Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
    function isApprovedForAll(address owner, address operator)
        public
        view
        override
        returns (bool)
    {
        // Whitelist OpenSea proxy contract for easy trading.
        ProxyRegistry proxyRegistry = ProxyRegistry(_PROXY_REGISTRY_ADDRESS);
        if (address(proxyRegistry.proxies(owner)) == operator) {
            return true;
        }

        return super.isApprovedForAll(owner, operator);
    }
}
