// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Protocol} from "../src/Protocol.sol";

contract ProtocolScript is Script {
    function run() public {
        vm.startBroadcast();
        Protocol protocol = new Protocol();
        console.log("This protocol is deployed to this address:", address(protocol));
        vm.stopBroadcast();
    }
}
