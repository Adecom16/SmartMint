import { useCallback, useEffect, useState } from "react";
import { isSupportedChain } from "../utils";
import { Addressable, ethers, solidityPacked } from "ethers";
import { getProvider, wssProvider } from "../constants/providers";
import { getFactoryContract } from "../constants/contracts";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { readOnlyProvider } from "../constants/providers";

// import { useToast } from "../components/ui/use-toast";

//Create ERC20 tokens
export const useERC20 = (
  tokens: any[]
) => {

  const erc20Tokens = tokens?.filter(token => Number(token._type) === 0);

  return { loading: false, data: erc20Tokens };
};

export const useERC721 = (
  tokens: any[]
) => {

  const erc721Tokens = tokens?.filter(token => Number(token._type) === 1);

  return { loading: false, nfts: erc721Tokens };
};

export const useERC1155 = (
  tokens: any[]
) => {

  const erc1155Tokens = tokens?.filter(token => Number(token._type) === 2);

  return { loading: false, nfts: erc1155Tokens };
};

export const useDao = (
  tokens: any[]
) => {

  const daoContracts = tokens?.filter(token => Number(token._type) === 3);

  return { loading: false, dao: daoContracts };
};



export const useSmartMintProtocol = () => {
  const { address } = useWeb3ModalAccount();
  const contract = getFactoryContract(readOnlyProvider);
  const { walletProvider } = useWeb3ModalProvider();
  const readWriteProvider = getProvider(walletProvider);

  const [tokens, setTokens] = useState<{ loading: boolean, data: any }>({
    loading: true,
    data: [],
  });

  const getUserTokens = async () => {
    try {
      const _addresses = await contract.getCreatorAddresses(address);
      console.log(_addresses);
      const _tokens = await Promise.all(_addresses.map(async (_address: Addressable) => {
        const _data = await contract.getContractDetails(_address);
        // console.log(_data);
        return { _creator: _data._creator, _name: _data._name, _abi: _data._abi, _type: _data._type, _sourceCode: _data._sourceCode, _createdAt: _data._createdAt, _contract: _address }
      }));
      console.log(_tokens);
      setTokens({
        loading: false,
        data: _tokens
      })
    } catch (error: any) {
      console.log(error)
    }
  }

  const addContract = async (_contractAddress: string | Addressable, _name: string, _abi: string, _type: number, _sourceCode: string) => {
    _abi = solidityPacked(['string'], [_abi]);
    _sourceCode = solidityPacked(['string'], [_sourceCode]);


    const readWriteProvider = getProvider(walletProvider);
    const signer = readWriteProvider ? await readWriteProvider.getSigner() : null;

    const contract = getFactoryContract(signer);

    try {
      const transaction = await contract.addContract(_contractAddress, _name, _abi, _type, _sourceCode);
      console.log("transaction: ", transaction);
      const receipt = await transaction.wait();

      console.log("receipt: ", receipt);
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        await getUserTokens();
      } catch (error) {
        console.error("Error fetching logs: ", error);
      }

      contract.on("NewContractAdded", getUserTokens);

      // Cleanup function
      return () => contract.off("NewContractAdded", getUserTokens);
    };

    fetchTokens();
  }, [address, walletProvider]);
  return { addContract, tokens }
}