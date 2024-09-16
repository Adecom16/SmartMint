// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Protocol} from "../src/Protocol.sol";

contract ProtocolTest is Test {
    Protocol public protocol;

    function setUp() public {
        protocol = new Protocol();
    }

    function test_addContract() public {
        address _contractAddress = address(1);
        string memory _name = "USDT";
        bytes memory _abi = abi.encodePacked(_name);
        Protocol.ContractType _type = Protocol.ContractType(0);
        bytes memory _sourceCode = abi.encodePacked(_name);
        vm.expectEmit();
        emit Protocol.NewContractAdded(_contractAddress, address(this), _type);
        protocol.addContract(_contractAddress, _name, _abi, _type, _sourceCode);
    }

    function test_addContractRevert() public {
        address _contractAddress = address(1);
        string memory _name = "USDT";
        bytes memory _abi = abi.encodePacked(_name);
        Protocol.ContractType _type = Protocol.ContractType(0);
        bytes memory _sourceCode = abi.encodePacked(_name);
        vm.expectEmit();
        emit Protocol.NewContractAdded(_contractAddress, address(this), _type);
        protocol.addContract(_contractAddress, _name, _abi, _type, _sourceCode);
        vm.expectRevert();
        protocol.addContract(_contractAddress, _name, _abi, _type, _sourceCode);
    }

    function test_getCreatorAddresses() public {
        test_addContract();
        address[] memory _addresses = protocol.getCreatorAddresses(address(this));
        assertEq(_addresses.length, 1);
    }

    function test_getContractDetail() public {
        test_addContract();
        Protocol.ContractDetail memory _contractDetail = protocol.getContractDetails(address(1));
        assertEq(_contractDetail._creator, address(this));
    }
}
