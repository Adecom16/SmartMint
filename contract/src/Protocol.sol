// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// When a contract address has already be added to the contract
error Protocol__AddressAlreadyExist(address _contracAddress);

/**
 * @title smartMint Protocol
 * @author @SuperDevFavour
 * @notice This contract aims to serves as a database where all contract created on the smartMint platform will be stored and gotten to be interacted with.
 */
contract Protocol {
    mapping(address => address[]) private s_ownerToContracts; //maps an owner to the contracts they have created.
    mapping(address => ContractDetail) private s_contractToDetail; //maps a contract to its details.

    /// @notice This event is emitted when a new contract is added to the contract.
    /// @param _contractAddress the address of the new contract added.
    /// @param _creator the owner of the contract.
    /// @param _type the type of contract that was added.
    event NewContractAdded(address _contractAddress, address _creator, ContractType _type);

    /// @notice This are the diffrent types of contract the protocol creates and stores
    enum ContractType {
        erc20,
        erc721,
        erc1155,
        governance,
        custom
    }

    /// @notice This is a data structure of information stored about the contract added
    struct ContractDetail {
        address _creator;
        string _name;
        bytes _abi;
        ContractType _type;
        bytes _sourceCode;
        uint256 _createdAt;
        bool _isExist;
    }

    /// @notice This function is responsible for adding new contract addresses to this protocol.
    /// @param _contractAddress the address of the contract being added.
    /// @param _name the name of the contract being added.
    /// @param _abi the hash of the abi of the contract.
    /// @param _type the type of this contract.
    /// @param _sourceCode the bytes of the sourceCode.
    function addContract(
        address _contractAddress,
        string memory _name,
        bytes memory _abi,
        ContractType _type,
        bytes memory _sourceCode
    ) external {
        if (s_contractToDetail[_contractAddress]._isExist) {
            revert Protocol__AddressAlreadyExist(_contractAddress);
        }

        ContractDetail memory _newContract =
            ContractDetail(msg.sender, _name, _abi, _type, _sourceCode, block.timestamp, true);

        s_contractToDetail[_contractAddress] = _newContract;
        s_ownerToContracts[msg.sender].push(_contractAddress);

        emit NewContractAdded(_contractAddress, msg.sender, _type);
    }

    /// @notice This retrieves the addresses of contract added by the owner/creator.
    /// @param _creator this is the address of the owner/creator whose contract addresses you want to get.
    /// @return _contractAddresses an array of address.
    function getCreatorAddresses(address _creator) external view returns (address[] memory _contractAddresses) {
        _contractAddresses = s_ownerToContracts[_creator];
    }

    /// @notice This retrieves the contract details of a particular contract address.
    /// @param _contractAddress the address of the contract you want to get its details.
    /// @return _contractdetail the details of the contract queried.
    function getContractDetails(address _contractAddress) public view returns (ContractDetail memory _contractdetail) {
        _contractdetail = s_contractToDetail[_contractAddress];
    }
}
