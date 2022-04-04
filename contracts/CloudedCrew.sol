// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/////////////////////////////////
/// ERRORS
/////////////////////////////////

error PresaleNotActive();
error PresaleIsActive();
error SalePaused();
error AlreadyMintedPresaleNFT();
error NotOnWhitelist();
error InvalidQuantity();
error SoldOut();
error InsufficientETH();
error InvalidTokenID();

/// @title CloudedCrew
///@author Utkarsh Sinha <karsh@hey.com>
contract CloudedCrew is ERC1155, Ownable {
    /////////////////////////////////
    /// PUBLIC VARS
    /////////////////////////////////

    string public name;
    bool public isPresaleActive = true;
    bool public isSalePaused = false;
    mapping(address => bool) public didMintPresale;
    uint256 public currentTokenID = 1;

    /////////////////////////////////
    /// CONSTANTS
    /////////////////////////////////

    string public constant METADATA_PROVENANCE_HASH =
        "0x27df45b83a96bcb75c7dc6918f12fdc22120b800930ae129b3f18bfae68fb232"; //TODO: Create metadata provenance hash and store it here
    uint256 public constant MAX_NFT_SUPPLY = 3333;
    uint256 public constant FREE_NFT_SUPPLY = 333;
    uint256 public constant MAX_MINT_AMOUNT_PER_TRANSACTION = 3;
    uint256 public constant MINTING_FEE = 0.03 ether;
    bytes32 public immutable WHITELIST_MERKLE_TREE_ROOT;

    /////////////////////////////////
    /// PRIVATE VARS
    /////////////////////////////////

    address private immutable _SPLITS_CONTRACT; //TODO: Create splits contract at 0xsplits.xyz before mainnet deployment

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

    modifier checkPresaleAlreadyMinted() {
        if (didMintPresale[msg.sender]) {
            revert AlreadyMintedPresaleNFT();
        }
        _;
    }

    modifier verifyWhitelist(bytes32[] calldata proof) {
        if (
            !MerkleProof.verify(
                proof,
                WHITELIST_MERKLE_TREE_ROOT,
                keccak256(abi.encodePacked(msg.sender))
            )
        ) {
            revert NotOnWhitelist();
        }
        _;
    }

    modifier checkMaxMintAmount(uint256 quantity) {
        if (quantity < 0 || quantity > MAX_MINT_AMOUNT_PER_TRANSACTION) {
            revert InvalidQuantity();
        }
        _;
    }

    modifier checkSupply(uint256 quantity) {
        if (quantity + currentTokenID - 1 > MAX_NFT_SUPPLY) {
            revert SoldOut();
        }
        _;
    }

    modifier checkValue(uint256 quantity) {
        if (msg.value < MINTING_FEE * quantity) {
            revert InsufficientETH();
        }
        _;
    }

    modifier checkTokenID(uint256 tokenID) {
        if (tokenID > currentTokenID - 1 || tokenID <= 0) {
            revert InvalidTokenID();
        }
        _;
    }

    /////////////////////////////////
    /// CONSTRUCTOR
    /////////////////////////////////

    /// @notice Setting base metadata URI to unrevealed metadata during contract deployment. Once all NFTs have been minted, contract owner will update base metadata URI to point to the actual metadata.  To ensure that metadata for each NFT was set prior to contract deployment, we have stored the provenance hash of all metadata JSON files in the contract as METADATA_PROVENANCE_HASH.  This provenance hash was computed by hashing a list of hashes of JSON metadata object for each NFT in order from 1 to MAX_NFT_SUPPLY.  This was done in Python using the web3.solidityKeccak method
    constructor(
        bytes32 whitelist_merkle_tree_root,
        address splits_contract,
        string memory baseMetadataURI
    ) ERC1155(baseMetadataURI) {
        name = "Lofty Clouds";
        WHITELIST_MERKLE_TREE_ROOT = whitelist_merkle_tree_root;
        _SPLITS_CONTRACT = splits_contract;
    }

    /////////////////////////////////
    /// EXTERNAL METHODS
    /////////////////////////////////

    /// @dev Function to mint presale NFTs
    /// @param proof Merkle proof provided by the client
    function mintPresale(bytes32[] calldata proof)
        external
        checkPresaleActive
        checkSaleStatus
        verifyWhitelist(proof)
        checkPresaleAlreadyMinted
    {
        ++currentTokenID;
        _updatePresaleMintStatus(msg.sender, true);
        _mint(msg.sender, currentTokenID - 1, 1, "");
    }

    /// @dev Mint _quantity number of NFTs
    /// @param quantity The number of NFTs to mint
    function batchMint(uint256 quantity)
        external
        payable
        checkPresaleInactive
        checkSaleStatus
        checkMaxMintAmount(quantity)
        checkSupply(quantity)
        checkValue(quantity)
    {
        uint256[] memory _ids = new uint256[](quantity);
        uint256[] memory _numTokens = new uint256[](quantity);

        for (uint256 i = 0; i < quantity; i++) {
            _ids[i] = currentTokenID + i;
            _numTokens[i] = 1;
        }
        currentTokenID = currentTokenID + quantity;
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
    function withdrawFullBalance() external payable onlyOwner {
        payable(_SPLITS_CONTRACT).transfer(address(this).balance);
    }

    /// @dev Generate contract metadata URI
    function contractURI() external view returns (string memory) {
        return string(abi.encodePacked(super.uri(1), "contractMetadata.json"));
    }

    /// @dev Will update the base metadata URI of NFTs
    /// @param newBaseMetadataURI New base URL
    function setBaseMetadataURI(string calldata newBaseMetadataURI)
        external
        onlyOwner
    {
        _setURI(newBaseMetadataURI);
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

    /////////////////////////////////
    /// PRIVATE METHODS
    /////////////////////////////////

    /// @dev Update mint status of whitelisted address
    /// @param addr The address to update
    /// @param status  The new status of the address
    function _updatePresaleMintStatus(address addr, bool status) private {
        didMintPresale[addr] = status;
    }
}
