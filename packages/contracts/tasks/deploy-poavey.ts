import { task, types } from "hardhat/config";

task("deploy:poavey", "Deploy a Poavey contract")
  .addOptionalParam(
    "semaphore",
    "Semaphore contract address",
    undefined,
    types.string
  )
  .addOptionalParam("logs", "Print the logs", true, types.boolean)
  .setAction(async ({ logs, semaphore: semaphoreAddress }, { ethers, run }) => {
    if (!semaphoreAddress) {
      semaphoreAddress = process.env.SEMAPHORE_CONTRACT_ADDRESS ?? "";
    }
    if (!semaphoreAddress) {
      const { semaphore } = await run("deploy:semaphore", {
        logs,
      });

      semaphoreAddress = semaphore.address;
    }

    const PoaveyFactory = await ethers.getContractFactory("Poavey");

    const poaveyContract = await PoaveyFactory.deploy(semaphoreAddress);

    await poaveyContract.deployed();

    if (logs) {
      console.info(
        `Poavey contract has been deployed to: ${poaveyContract.address}`
      );
    }

    return poaveyContract;
  });
