// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

/**
 * @title LoftyClouds
 * @author Utkarsh Sinha <karsh@hey.com>
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

// contract OwnableDelegateProxy {}

// contract ProxyRegistry {
//     mapping(address => OwnableDelegateProxy) public proxies;
// }

contract LoftyClouds is ERC1155, Ownable {
    // address proxyRegistryAddress;
    string public name;

    //---------------------
    // CONSTANTS
    //---------------------
    string public constant METADATA_PROVENANCE_HASH =
        "0x27df45b83a96bcb75c7dc6918f12fdc22120b800930ae129b3f18bfae68fb232"; //TODO: Create metadata provenance hash and store it here
    uint256 public constant MAX_NFT_SUPPLY = 3333;
    uint256 public constant MAX_MINT_AMOUNT_PER_TRANSACTION = 3;
    uint256 public constant MINTING_FEE = 0.03 ether;

    //---------------------
    // PRIVATE VARS
    //---------------------
    uint256 private _currentTokenID = 1;
    address private constant _SPLITS_CONTRACT =
        0x86cC8121b46F6b7f8a2213C89087ad7741F8542A; //TODO: Create splits contract at 0xsplits.xyz before mainnet deployment

    /**
     * NOTE: Set base metadata URI to unrevealed metadata during contract deployment. Once all NFTs have been minted, contract owner will update base metadata URI to point to the actual metadata.  To ensure that metadata for each NFT was set prior to contract deployment, we have stored the provenance hash of all metadata JSON files in the contract as METADATA_PROVENANCE_HASH.  This provenance hash was computed by hashing the combined (string concatanation) hash of JSON metadata object for each NFT in order from 1 to MAX_NFT_SUPPLY.
     */
    // constructor(address _proxyRegistryAddress)
    constructor()
        ERC1155(
            "https://gateway.pinata.cloud/ipfs/Qmaxqbo2ZDBRYv7Ukw7L9B7dq2vUQqB1ysH6x5CLcDAVPa/"
        )
    {
        // proxyRegistryAddress = _proxyRegistryAddress;
        name = "Lofty Clouds";
    }

    /**
     * @dev Mint _quantity number of NFTs
     * @param _to          The address to mint tokens to
     * @param _quantity    The number of NFTs to mint
     */
    function batchMint(address _to, uint256 _quantity) external payable {
        require(
            _quantity <= MAX_MINT_AMOUNT_PER_TRANSACTION,
            "Cannot many more than 3 NFTs per transaction"
        );
        require(
            _quantity + _currentTokenID - 1 <= MAX_NFT_SUPPLY,
            "Not enought NFT supply left to mint"
        );
        require(
            msg.value >= _quantity * MINTING_FEE,
            "Insuficient ETH to mint"
        );

        bytes memory _data;
        uint256[] memory _ids = new uint256[](_quantity);
        uint256[] memory _numTokens = new uint256[](_quantity);

        for (uint256 i = 0; i < _quantity; i++) {
            _ids[i] = _currentTokenID + i;
            _numTokens[i] = 1;
        }
        _currentTokenID = _currentTokenID + _quantity;
        _mintBatch(_to, _ids, _numTokens, _data);
    }

    function withdrawFullBalance() external payable onlyOwner {
        payable(_SPLITS_CONTRACT).transfer(address(this).balance);
    }

    /**
     * @dev Generate contract metadata URI
     */
    function contractURI() external view returns (string memory) {
        return string(abi.encodePacked(super.uri(1), "contractMetadata.json"));
    }

    /**
     * @dev Generate NFT metadata URI for a given NFT token ID
     * @param _tokenID Token ID for the NFT
     */
    function uri(uint256 _tokenID)
        public
        view
        override
        returns (string memory)
    {
        require(_tokenID > 0, "Token ID must be greater than 0");
        require(_tokenID < _currentTokenID, "Token ID hasn't been minted yet");
        return
            string(
                abi.encodePacked(
                    super.uri(_tokenID),
                    Strings.toString(_tokenID),
                    ".json"
                )
            );
    }

    /**
     * @dev Will update the base metadata URI of NFTs
     * @param _newBaseMetadataURI New base URL
     */
    function setBaseMetadataURI(string calldata _newBaseMetadataURI)
        external
        onlyOwner
    {
        _setURI(_newBaseMetadataURI);
    }

    // /**
    //  * Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-free listings.
    //  */
    // function isApprovedForAll(address _owner, address _operator)
    //     public
    //     view
    //     override
    //     returns (bool isOperator)
    // {
    //     // Whitelist OpenSea proxy contract for easy trading.
    //     ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
    //     if (address(proxyRegistry.proxies(_owner)) == _operator) {
    //         return true;
    //     }

    //     return ERC1155.isApprovedForAll(_owner, _operator);
    // }

    bytes4 private constant INTERFACE_SIGNATURE_ERC165 = 0x01ffc9a7;
    bytes4 private constant INTERFACE_SIGNATURE_ERC1155 = 0xd9b67a26;

    /**
     * @dev See {IERC165-supportsInterface}.
     */
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
}
