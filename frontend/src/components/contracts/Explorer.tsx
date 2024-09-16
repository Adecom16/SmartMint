"use client";

import { useState, useEffect } from "react";
import { ExplorerFunctions } from "./ExplorerFunctions";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { getProvider } from "@/constants/providers";
import { ethers } from "ethers";

export const Explorer = ({ metadata, abi }: { metadata: any; abi: any[] }) => {
  const [tab, setTab] = useState(0);
  const [currentFunction, setCurrentFunction] = useState("");
  const [readFunctions, setReadFunctions] = useState([]);
  const [writeFunctions, setWriteFunctions] = useState([]);
  const [result, setResult] = useState<any>(null);

  const { walletProvider } = useWeb3ModalProvider();
  const readWriteProvider = getProvider(walletProvider);

  useEffect(() => {
    const parsedFunctions = abi.reduce((acc, item) => {
      if (item.type === 'function') {
        const functionType = item.stateMutability === 'view' || item.stateMutability === 'pure' ? 'read' : 'write';
        acc[functionType].push(item);
      }
      return acc;
    }, { read: [], write: [] });

    setReadFunctions(parsedFunctions.read);
    setWriteFunctions(parsedFunctions.write);
  }, [abi]);

  const handleSetCurrentFunction = (id: string) => {
    setCurrentFunction(id);
    setResult(null);
  };

  const handleFunction = async (functionName: string, args: any[]) => {
    try {
      const signer = readWriteProvider ? await readWriteProvider.getSigner() : null;
      const contract = new ethers.Contract(metadata._contract, abi, signer || readWriteProvider);
      const result = await contract[functionName](...args);

      if (typeof result.wait === 'function') {
        const receipt = await result.wait();
        setResult(receipt.status === 1 ? "True" : "False");

        return receipt.status === 1;
      } else {
        setResult(result);
        return result;
      }
    } catch (error) {
      console.error(`Error calling ${functionName}:`, error);
      throw error;
    }
  };

  const selectedFunction = [...readFunctions, ...writeFunctions].find((f: any) => f.name === currentFunction);

  return (
    <>
      <h2 className="mb-2 text-2xl font-bold">Contract Explorer</h2>
      <div className="explorer mt-6 flex gap-8">
        <div className="w-1/3 rounded border border-gray-600">
          <div className="flex w-full border-b border-gray-400 text-gray-200">
            <span
              className={`w-1/2 cursor-pointer px-4 py-2 text-center font-bold ${tab === 0 ? "border-b-2 border-gray-300" : "border-0"
                }`}
              onClick={() => setTab(0)}
            >
              Write
            </span>
            <span
              className={`w-1/2 cursor-pointer px-4 py-2 text-center font-bold ${tab === 1 ? "border-b-2 border-gray-300" : "border-0"
                }`}
              onClick={() => setTab(1)}
            >
              Read
            </span>
          </div>

          {/* Write Functions */}
          <div className={`section px-6 py-4 text-gray-500 ${tab === 0 ? "block" : "hidden"}`}>
            <p className="mb-2 border-b border-gray-800 pb-2 font-semibold text-gray-300">
              Write Functions
            </p>
            {writeFunctions.map((func: any) => (
              <p
                key={func.name}
                className={`mb-2 cursor-pointer font-mono font-semibold ${currentFunction === func.name ? "text-gray-200" : ""
                  }`}
                onClick={() => handleSetCurrentFunction(func.name)}
              >
                {func.name}
              </p>
            ))}
          </div>

          {/* Read Functions */}
          <div className={`section px-6 py-4 text-gray-500 ${tab === 1 ? "block" : "hidden"}`}>
            <p className="mb-2 border-b border-gray-800 pb-2 font-semibold text-gray-300">
              Read Functions
            </p>
            {readFunctions.map((func: any) => (
              <p
                key={func.name}
                className={`mb-2 cursor-pointer font-mono font-semibold ${currentFunction === func.name ? "text-gray-200" : ""
                  }`}
                onClick={() => handleSetCurrentFunction(func.name)}
              >
                {func.name}
              </p>
            ))}
          </div>
        </div>

        <div className="w-full rounded border border-gray-600 px-8">
          <div className="section px-6 py-4 text-gray-500">
            <p className="mb-2 border-b border-gray-800 pb-2 text-2xl font-bold capitalize text-gray-300">
              {currentFunction || "No Method Selected"}
            </p>
            {selectedFunction && (
              <ExplorerFunctions
                functionData={selectedFunction}
                handleFunction={handleFunction}
                result={result}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};