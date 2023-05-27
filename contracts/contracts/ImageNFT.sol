pragma solidity ^0.8.0;
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";



contract ImageNFT is ERC721, ERC721URIStorage ,Ownable {
    string private BASE_URI;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => uint256[]) private users;


    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function getNFTIdOfOwner(address ownerAddress) external view returns(uint256[] memory){
        return users[ownerAddress];
    }

    function buyImageNFT(address to, address payable from,uint256 amountToPay, uint256 tokenID) external payable {
        require(msg.value >= amountToPay, "TokenContract: Invalid currency amount.");
        _transfer(from, to, tokenID);
        from.transfer(msg.value);
    }


    function getBalance() external view returns(uint256){
        return address(this).balance;
    }

    function widthDraw() onlyOwner external payable {
        payable(owner()).transfer(address(this).balance);
    }

    constructor  (
        address owner,
        string memory _name,
        string memory _symbol,
        string memory base_uri
    ) ERC721(_name, _symbol){
        transferOwnership(owner);
        BASE_URI =  base_uri;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    

    function _baseURI() internal view override returns (string memory) {
        return BASE_URI;
    }

    function mintImage(address recipient,string memory uri) payable external returns(uint256){
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, uri);
        users[recipient].push(newTokenId);
        setApprovalForAll(address(this), true);

        return newTokenId;
    }
}