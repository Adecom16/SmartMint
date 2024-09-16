"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

export const SUPPORTED_CHAIN = 1115;

const coreDao = {
  chainId: 1115,
  name: "Core Blockchain Testnet",
  currency: "tCORE",
  explorerUrl: "https://scan.test.btcs.network",
  rpcUrl: `https://rpc.test.btcs.network`,
};

const metadata = {
  name: "SmartMint for Shardeum",
  description: "No code token and nft deployment and interaction",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [coreDao],
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  enableAnalytics: false, // Optional - defaults
  themeVariables: {
    "--w3m-accent": "#006AFF",
    "--w3m-border-radius-master": "",
    "--w3m-font-size-master": "16",
  },
  defaultChain: 1115,
});

export function Web3Modal({ children }) {
  return children;
}
