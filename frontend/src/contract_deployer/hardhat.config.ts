import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://ethereum-sepolia.blockpi.network/v1/rpc/public`,
    },
  },
  etherscan: {
    apiKey: "9IECXZFI5XXIX4V995KI9C5IY72JENJS5W",
  },
};

export default config;
