"use client";

import { useState } from "react";

import toast from "react-hot-toast";

// import { contractTxWithToast } from '@/utils/contract-tx-with-toast'

import { ExplorerFunctions } from "./ExplorerFunctions";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { getProvider } from "@/constants/providers";
import {
  getFungibleContract,
  getNonFungibleContract,
} from "@/constants/contracts";

export const Explorer = ({ metadata, abi }: { metadata: any, abi: any[] }) => {
  const [tab, setTab] = useState(0);
  const [currentFunction, setCurrentFunction] = useState("");
  const handleSetCurrentFunction = (id: string) => {
    setCurrentFunction(id);
  };
  const { walletProvider } = useWeb3ModalProvider();
  const readWriteProvider = getProvider(walletProvider);
  // const { address } = useWeb3ModalAccount();

  const handleBalance = async (address: string) => {
    try {
      const signer = readWriteProvider ? await readWriteProvider.getSigner() : null;

      const contract = getNonFungibleContract(signer, metadata?.address);
      const balance = await contract.balanceOf(address);
      console.log(balance);

      return Number(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      throw error;
    }
  };

  const handleGetApproved = async (tokenId: string): Promise<string> => {
    try {
      const signer = readWriteProvider ? await readWriteProvider.getSigner() : null;

      const contract = getNonFungibleContract(signer, metadata.address);
      const approval = await contract.getApproved(tokenId);
      console.log(approval);
      return approval;
    } catch (error) {
      console.error("Error handling approval:", (error as Error).message);
      throw error;
    }
  };

  const handleTokenUri = async (
    tokenId: string,
  ): Promise<number> => {
    try {
      const signer = readWriteProvider ? await readWriteProvider.getSigner() : null;

      const contract = getNonFungibleContract(signer, metadata.address);
      const tokenURI = await contract.tokenURI(tokenId);
      console.log(tokenURI);

      return tokenURI;
    } catch (error) {
      console.error("Error fetching allowance:", error);
      throw error;
    }
  };

  const handleApprove = async (
    to: string,
    tokenId: string
  ): Promise<boolean> => {
    try {
      const signer = readWriteProvider ? await readWriteProvider.getSigner() : null;

      const contract = getNonFungibleContract(signer, metadata.address);
      const transfer = await contract.approve(to, tokenId);
      const receipt = await transfer.wait();
      console.log(contract);
      if (receipt.status === 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error handling transfer:", error);
      throw error;
    }
  };

  const handleTransferFrom = async (
    from: string,
    to: string,
    tokenId: string
  ): Promise<boolean> => {
    try {
      const signer = readWriteProvider ? await readWriteProvider.getSigner() : null;

      const contract = getNonFungibleContract(signer, metadata.address);
      const transferFrom = await contract.transferFrom(from, to, tokenId);
      const receipt = await transferFrom.wait();

      console.log(receipt);
      if (receipt.status === 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error  handling transfer-from:", error);
      throw error;
    }
  };

  const handleOwnerOf = async (
    tokenId: string
  ): Promise<string> => {
    try {
      const signer = readWriteProvider ? await readWriteProvider.getSigner() : null;

      const contract = getNonFungibleContract(signer, metadata.address);
      const ownerOf = await contract.ownerOf(tokenId);
      return ownerOf;
      //   const receipt = await transferFrom.wait();

      //   console.log(receipt);
      //   if (receipt.status === 1) {
      //     return true;
      //   } else {
      //     return false;
      //   }
    } catch (error) {
      console.error("Error  handling transfer-from:", error);
      throw error;
    }
  };

  return (
    <>
      <h2 className="mb-2 text-2xl font-bold">Explorer</h2>
      <div className="explorer mt-6  flex gap-8">
        <div className="w-1/3 rounded border border-gray-600 ">
          <div className="flex w-full border-b border-gray-400  text-gray-200">
            <span
              className={`w-1/2 cursor-pointer px-4 py-2 text-center  font-bold ${tab === 0 ? "border-b-2 border-gray-300" : "border-0"
                }`}
              onClick={() => {
                setTab(0);
              }}
            >
              Write
            </span>
            <span
              className={`w-1/2 cursor-pointer px-4 py-2 text-center font-bold ${tab === 1 ? "border-b-2 border-gray-300" : "border-0"
                }`}
              onClick={() => {
                setTab(1);
              }}
            >
              Read
            </span>
          </div>

          {/* Functions */}

          {/* write Functions */}
          <div
            className={`section px-6 py-4 text-gray-500 ${tab === 0 ? "block" : "hidden"
              }`}
          >
            <p className="mb-2 border-b border-gray-800 pb-2 font-semibold text-gray-300">
              Functions
            </p>
            <p
              // className="mb-2 cursor-pointer font-mono font-semibold"
              className={`mb-2 cursor-pointer font-mono font-semibold ${currentFunction === "approve" ? "text-gray-200" : ""
                }`}
              id="approve"
              onClick={(e) => {
                handleSetCurrentFunction("approve");
              }}
            >
              approve
            </p>
            <p
              className={`mb-2 cursor-pointer font-mono font-semibold ${currentFunction === "safeTransferFrom" ? "text-gray-200" : ""
                }`}
              onClick={(e) => {
                handleSetCurrentFunction("safeTransferFrom");
              }}
            >
              safeTransferFrom
            </p>
            <p
              className={`mb-2 cursor-pointer font-mono font-semibold ${currentFunction === "safeTransferFrom(data)"
                  ? "text-gray-200"
                  : ""
                }`}
              onClick={(e) => {
                handleSetCurrentFunction("safeTransferFrom(data)");
              }}
            >
              safeTransferFrom
            </p>

            <p
              className={`mb-2 cursor-pointer font-mono font-semibold ${currentFunction === "transferFrom" ? "text-gray-200" : ""
                }`}
              onClick={(e) => {
                handleSetCurrentFunction("transferFrom");
              }}
            >
              transferFrom
            </p>
          </div>

          {/* Read Functions */}
          <div
            className={`section px-6 py-4 text-gray-500 ${tab === 1 ? "block" : "hidden"
              }`}
          >
            <p className="mb-2 border-b border-gray-800 pb-2 font-semibold text-gray-300">
              Functions
            </p>

            <p
              className={`mb-2 cursor-pointer font-mono font-semibold ${currentFunction === "balanceOf" ? "text-gray-200" : ""
                }`}
              onClick={(e) => {
                handleSetCurrentFunction("balanceOf");
              }}
            >
              balanceOf
            </p>

            <p
              className={`mb-2 cursor-pointer font-mono font-semibold ${currentFunction === "getApproved" ? "text-gray-200" : ""
                }`}
              onClick={(e) => {
                handleSetCurrentFunction("getApproved");
              }}
            >
              getApproved
            </p>

            <p
              className={`mb-2 cursor-pointer font-mono font-semibold ${currentFunction === "ownerOf" ? "text-gray-200" : ""
                }`}
              onClick={(e) => {
                handleSetCurrentFunction("ownerOf");
              }}
            >
              ownerOf
            </p>
            <p
              className={`mb-2 cursor-pointer font-mono font-semibold ${currentFunction === "tokenURI" ? "text-gray-200" : ""
                }`}
              onClick={(e) => {
                handleSetCurrentFunction("tokenURI");
              }}
            >
              tokenURI
            </p>
            <p
              className={`mb-2 cursor-pointer font-mono font-semibold ${currentFunction === "name" ? "text-gray-200" : ""
                }`}
              onClick={(e) => {
                handleSetCurrentFunction("name");
              }}
            >
              name
            </p>
            <p
              className={`mb-2 cursor-pointer font-mono font-semibold ${currentFunction === "symbol" ? "text-gray-200" : ""
                }`}
              onClick={(e) => {
                handleSetCurrentFunction("symbol");
              }}
            >
              symbol
            </p>
          </div>
        </div>

        <div className="w-full rounded border border-gray-600 px-8">
          {/* <div className="flex w-full">
            <span className="w-1/2 text-center">Write</span>
            <span className="w-1/2 text-center">Read</span>
          </div> */}
          <div className="section px-6 py-4 text-gray-500">
            <p className="mb-2 border-b border-gray-800 pb-2 text-2xl font-bold capitalize text-gray-300">
              {currentFunction || "No Method Selected"}
            </p>
            <small></small>
            {currentFunction === "approve" ? (
              <ExplorerFunctions
                to
                tokenId
                handleApprove={handleApprove}
              />
            ) : currentFunction === "transferFrom" ? (
              <ExplorerFunctions
                from
                to
                tokenId
                handleTransferFrom={handleTransferFrom}
              />
            ) : currentFunction === "balanceOf" ? (
              <ExplorerFunctions owner handleBalanceOf={handleBalance} />
            ) : currentFunction === "getApproved" ? (
              <ExplorerFunctions tokenId handleGetApproved={handleGetApproved} />
            ) : currentFunction === "ownerOf" ? (
              <ExplorerFunctions tokenId
                handleOwnerOf={handleOwnerOf}
              />
            ) : currentFunction === "tokenURI" ? (
              <ExplorerFunctions tokenId handleTokenUri={handleTokenUri} />
            ) : currentFunction === "safeTransferFrom" ? (
              <ExplorerFunctions
                from
                to
                tokenId
                handleBalanceOf={handleBalance}
              />
            ) : currentFunction === "safeTransferFrom(data)" ? (
              <ExplorerFunctions
                from
                to
                tokenId
                data
                handleBalanceOf={handleBalance}
              />
            ) : currentFunction === "name" ? (
              <ExplorerFunctions view={"name"} viewValue={metadata?.name} />
            ) : currentFunction === "symbol" ? (
              <ExplorerFunctions view={"symbol"} viewValue={metadata?.symbol} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};
