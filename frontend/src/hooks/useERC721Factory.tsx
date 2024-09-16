import { useCallback, useEffect, useState } from "react";
import { isSupportedChain } from "../utils";
import { ethers } from "ethers";
import { getProvider, wssProvider } from "../constants/providers";
import { getFactoryContract } from "../constants/contracts";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { readOnlyProvider } from "../constants/providers";

// import { useToast } from "../components/ui/use-toast";

//Create ERC20 tokens
export const useCreateERC721 = (
  name: string,
  symbol: string,
  initialSupply: Number,
  description: string
) => {
  const { chainId, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  //   const { toast } = useToast();

  return useCallback(async () => {
    if (!isSupportedChain(chainId)) return console.error("Wrong network");
   
    const readWriteProvider = getProvider(walletProvider);
    const signer = readWriteProvider ? await readWriteProvider.getSigner() : null;


    const contract = getFactoryContract(signer);

    try {
     const transaction = await contract.createFungibleToken(name, symbol, initialSupply, description);

     console.log("transaction: ", transaction);
     const receipt = await transaction.wait();

     console.log("receipt: ", receipt);

    } catch (error) {
      console.error("error: ", error);
    }
  }, [ chainId, walletProvider]);
};


export const useGetAllERC721 = () => {
  const { address } = useWeb3ModalAccount();
  const contract = getFactoryContract(readOnlyProvider);
  const { walletProvider } = useWeb3ModalProvider();
  const readWriteProvider = getProvider(walletProvider);

  const [tokens, setTokens] = useState({
    loading: true,
    nfts: [],
  });

  const getTokens = () => {
    contract
      .getCreatedNFTByAddress(address)
      .then((res) => {
        const converted = res.map((token: any) => ({
          name: token.name,
          symbol: token.symbol,
          supply: token.totalSupply,
          description: token.description,
          address: token.contractAdd,
        }));
        setTokens({
          loading: false,
          nfts: converted,
        });
      })
      .catch((err) => {
        console.error("error fetching proposals: ", err);
        setTokens((prev) => ({ ...prev, loading: false }));
      });
  };

  useEffect(() => {
    const fetchTokens = async () => {
      const filter = {
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS,
        topics: [ethers.id("NftCreated(address,address)")],
      };

      try {
        const events = await readOnlyProvider
          .getLogs({
            ...filter,
            fromBlock: 5726200,
          })
          .then((events) => {
            getTokens();
          });
      } catch (error) {
        console.error("Error fetching logs: ", error);
      }

      contract.on("NftCreated", getTokens);

      // Cleanup function
      return () => contract.off("NftCreated", getTokens);
    };

    fetchTokens();
  }, []);

  return tokens;
};
