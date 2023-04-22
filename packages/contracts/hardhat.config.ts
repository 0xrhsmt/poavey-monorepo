import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv   from "dotenv";
import { resolve } from "path";
import { config } from "./package.json";
import "./tasks/deploy-poavey"

// to deploy contracts
// pnpm deploy:poavey --network arbitrumGoerli

// to verify contracts on etherscan
// pnpm exec hardhat verify --network arbitrumGoerli 0xCc8e419A08034C6A9867129e305d43E65Db36ce1 "0x3889927F0B5Eb1a02C6E2C20b39a1Bd4EAd76131"

dotenv.config()

const accounts = [`0x${process.env.ETHEREUM_PRIVATE_KEY}`];

const hardhatConfig: HardhatUserConfig = {
  solidity: config.solidity,
  paths: {
    sources: config.paths.contracts,
    tests: config.paths.tests,
    cache: config.paths.cache,
    artifacts: config.paths.build.contracts,
  },
  networks: {
    "arbitrumGoerli": {
      url: "https://goerli-rollup.arbitrum.io/rpc",
      chainId: 421613,
      accounts,
    },
  },
  etherscan: {
    apiKey: {
      "arbitrumGoerli": process.env.ETHERSCAN_API_KEY ?? ""
    },
    customChains: [
      {
        network: "arbitrumGoerli",
        chainId: 421613,
        urls: {
          apiURL: "https://api-goerli.arbiscan.io/api",
          browserURL: "https://testnet.arbiscan.io"
        }
      }
    ]
  }
};

export default hardhatConfig;
