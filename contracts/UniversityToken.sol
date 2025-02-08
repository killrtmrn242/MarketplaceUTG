// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UniversityToken is ERC20 {
    address public owner;
    mapping(address => uint256) public lastTransactionTimestamps;

    constructor() ERC20("UniversityGroupToken", "UGT") {
        _mint(msg.sender, 2000 * 10 ** decimals());
        owner = msg.sender;
    }

    function getLastTransactionTimestamp(address account) public view returns (string memory) {
        uint256 timestamp = lastTransactionTimestamps[account];
        require(timestamp != 0, "No transactions found");
        return _convertTimestampToDateTime(timestamp);
    }

    function getTransactionSender(address account) public view returns (address) {
        require(balanceOf(account) > 0, "No tokens held by this account");
        return account;
    }

    function _convertTimestampToDateTime(uint256 timestamp) internal pure returns (string memory) {
        uint256 year = 1970 + timestamp / 31556926;
        uint256 month = (timestamp % 31556926) / 2629743 + 1;
        uint256 day = (timestamp % 2629743) / 86400 + 1;
        return string(abi.encodePacked(uint2str(day), "/", uint2str(month), "/", uint2str(year)));
    }

    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}
