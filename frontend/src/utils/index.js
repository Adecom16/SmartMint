import { ethers } from "ethers";
import { SUPPORTED_CHAIN } from "../connection";
import { erc1155, erc20, erc721, governor } from "@openzeppelin/wizard";

export const isSupportedChain = (chainId) =>
  Number(chainId) === SUPPORTED_CHAIN;

export const generateErc20Code = (props) => erc20.print(props);
export const generateErc721Code = (props) => erc721.print(props);
export const generateErc1155Code = (props) => erc1155.print(props);
export const generateDaoCode = (props) => governor.print(governor.defaults);

export const validateInputs = (inputValues, contractArguments) => {
  const errors = [];

  // Validate inputValues
  if (!inputValues.name || inputValues.name.trim() === "") {
    errors.push("Token name is required.");
  }
  if (!inputValues.symbol || inputValues.symbol.trim() === "") {
    errors.push("Token symbol is required.");
  }
  if (inputValues.premint < 0) {
    errors.push("Premint value cannot be negative.");
  }
  if (inputValues.decimal < 0 || inputValues.decimal > 18) {
    errors.push("Decimal value must be between 0 and 18.");
  }
  // Additional validations for description, booleans if necessary

  // Validate contractArguments
  if (inputValues.access === "ownable") {
    if (
      !contractArguments.ownable.initialOwner ||
      contractArguments.ownable.initialOwner.trim() === ""
    ) {
      errors.push("Initial owner address is required.");
    }
    if (ethers.isAddressable(contractArguments.ownable.initialOwner)) {
      errors.push("owner should be address.");
    }
  }
  if (inputValues.access === "roles") {
    if (
      !contractArguments.roles.defaultAdmin &&
      contractArguments.roles.defaultAdmin.trim() === ""
    ) {
      errors.push("Default admin address is required.");
    }
    if (
      (!contractArguments.roles.pauser ||
        contractArguments.roles.pauser.trim() === "") &&
      inputValues.pausable
    ) {
      errors.push("Pauser address is required.");
    }
    if (
      (!contractArguments.roles.minter ||
        contractArguments.roles.minter.trim() === "") &&
      inputValues.mintable
    ) {
      errors.push("Minter address is required.");
    }
    if (
      !contractArguments.roles.upgrader &&
      contractArguments.roles.upgrader.trim() &&
      inputValues.upgradeable === "uups"
    ) {
      errors.push("Upgrader address is required.");
    }
    /////
    if (ethers.isAddressable(contractArguments.roles.defaultAdmin)) {
      errors.push("Default admin address is required.");
    }
    if (
      ethers.isAddressable(contractArguments.roles.pauser) &&
      inputValues.pausable
    ) {
      errors.push("Pauser address is required.");
    }
    if (
      ethers.isAddressable(contractArguments.roles.minter) &&
      inputValues.mintable
    ) {
      errors.push("Minter address is required.");
    }
    if (
      ethers.isAddressable(contractArguments.roles.upgrader) &&
      inputValues.upgradeable === "uups"
    ) {
      errors.push("Upgrader address is required.");
    }
  }
  if (inputValues.access === "managed") {
    if (
      !contractArguments.managed.initialAuthority ||
      contractArguments.managed.initialAuthority.trim() === ""
    ) {
      errors.push("Initial authority address is required.");
    }
    if (ethers.isAddressable(contractArguments.managed.initialAuthority)) {
      errors.push("authority should be address.");
    }
  }

  return errors;
};
