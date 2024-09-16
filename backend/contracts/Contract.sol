// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GettingCode is ERC20 {
    constructor() ERC20("Getting Code", "GCT") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}