import { useCallback, useEffect, useState } from "react";
import { useSmartMintProtocol, useERC721 } from "./useSmartMintProtocol";
import { getFungibleContract, getNonFungibleContract } from "../constants/contracts";
import { getProvider, readOnlyProvider } from "@/constants/providers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { Addressable, ethers, toUtf8String } from "ethers";
import { useGetAllERC721 } from "./useERC721Factory";

// Get single ERC20 Token
export const useGetSingleERC20 = (tokenAddress: string) => {
  const { tokens } = useSmartMintProtocol();
  const { loading, data } = tokens;

  const getTokenByAddress = useCallback(
    (tokenAddress: string) => {
      const token = data.find((token: any) => token._contract === tokenAddress);
      return token;
    },
    [data]
  );

  const [selectedToken, setSelectedToken] = useState<any>(null);

  useEffect(() => {
    if (data.length > 0) {
      const token = getTokenByAddress(tokenAddress);
      setSelectedToken(token);
    }
  }, [data, getTokenByAddress]);

  return selectedToken;
};

// Handle ERC20 interaction
export const GetBalanceOf = (tokenAddress: string) => {
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const { address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const readWriteProvider = getProvider(walletProvider);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const signer = await readWriteProvider.getSigner();
        const signer = readWriteProvider ? await readWriteProvider.getSigner() : null;

        const contract = getFungibleContract(signer, tokenAddress);
        const balance = await contract.balanceOf(address);
        setBalance(balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        // Optionally handle the error or set a default balance
      }
    };

    fetchData();
  }, [tokenAddress, address]);

  return balance;
};

export const useGetSingleNFT = (tokenAddress: string) => {
  const { tokens } = useSmartMintProtocol();
  const { nfts } = useERC721(tokens.data);

  const getNFTByAddress = useCallback(
    (tokenAddress: string) => {
      const token = nfts.find((token: any) => token._contract === tokenAddress);
      return token;
    },
    [nfts]
  );

  const [selectedToken, setSelectedToken] = useState<any>(null);

  useEffect(() => {
    if (nfts.length > 0) {
      const token = getNFTByAddress(tokenAddress);
      setSelectedToken(token);
    }
  }, [nfts, getNFTByAddress]);

  return selectedToken;
};

export const GetBalanceOfNFT = (tokenAddress: string) => {
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const { address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const readWriteProvider = getProvider(walletProvider);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const signer = await readWriteProvider.getSigner();
        const signer = readWriteProvider ? await readWriteProvider.getSigner() : null;

        const contract = getNonFungibleContract(signer, tokenAddress);
        const balance = await contract.balanceOf(address);
        setBalance(balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        // Optionally handle the error or set a default balance
      }
    };

    fetchData();
  }, [tokenAddress, address]);

  return balance;
};
export const GetNFTUri = (tokenAddress: string) => {
  const [uri, setUri] = useState<string | undefined>(undefined);
  const { address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const readWriteProvider = getProvider(walletProvider);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const signer = readWriteProvider ? await readWriteProvider.getSigner() : null;

        const contract = getNonFungibleContract(signer, tokenAddress);
        const uri = await contract.tokenURI(0);
        setUri(uri);
        console.log(uri);
      } catch (error) {
        console.error('Error fetching balance:', error);
        // Optionally handle the error or set a default balance
      }
    };

    fetchData();
  }, [tokenAddress, address]);

  return uri;
};

export async function getTokenMetadata(_abi: string, _address: string, _user?: string) {
  if (_abi) {

    _abi = JSON.parse(toUtf8String(_abi));
  }
  const contract = new ethers.Contract(_address, _abi, readOnlyProvider);
  const symbol = await contract.symbol();
  const supply = await contract.totalSupply();
  const userBalance = _user && await contract.balanceOf(_user);
  const decimals = await contract.decimals();
  return { symbol, supply, decimals, userBalance }
}