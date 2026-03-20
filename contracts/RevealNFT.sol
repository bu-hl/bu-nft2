// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RevealNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    string private _baseTokenURI;
    string private _unrevealedURI;
    bool public revealed;

    event Revealed(string baseURI);

    constructor(string memory unrevealedURI) ERC721("RevealNFT", "RNFT") Ownable(msg.sender) {
        _nextTokenId = 1;
        _unrevealedURI = unrevealedURI;
        revealed = false;
    }

    function mint(address to) external returns (uint256) {
        require(!revealed, "Minting closed after reveal");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function reveal(string memory baseURI) external onlyOwner {
        require(!revealed, "Already revealed");
        _baseTokenURI = baseURI;
        revealed = true;
        emit Revealed(baseURI);
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        require(revealed, "Not revealed yet");
        _baseTokenURI = baseURI;
    }

    function setUnrevealedURI(string memory unrevealedURI) external onlyOwner {
        require(!revealed, "Already revealed");
        _unrevealedURI = unrevealedURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        if (!revealed) {
            return _unrevealedURI;
        }

        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }
}
