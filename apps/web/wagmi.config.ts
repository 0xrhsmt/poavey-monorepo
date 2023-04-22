import { resolve } from "path"
import { etherscan, react } from "@wagmi/cli/plugins"
import { defineConfig } from "@wagmi/cli"
import { arbitrumGoerli } from "wagmi/chains"
import { config as dotenvConfig } from "dotenv"

dotenvConfig({ path: resolve(__dirname, ".env") })

export default defineConfig({
    out: "libs/generated.ts",
    plugins: [
        etherscan({
            apiKey: process.env.ETHERSCAN_API_KEY!,
            chainId: arbitrumGoerli.id,
            contracts: [
                {
                    name: "Poavey",
                    address: process.env.POAVEY_CONTRACT_ADDRESS! as `0x${string}`
                }
            ]
        }),
        react()
    ]
})
